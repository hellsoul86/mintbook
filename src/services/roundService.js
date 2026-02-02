const {
  ROUND_DURATION_MIN,
  ROUND_DURATION_MS,
  FLAT_THRESHOLD_PCT,
  FEED_LIMIT,
  VERDICT_LIMIT,
  JUDGMENT_LIMIT,
  ROUND_LIMIT,
  SCORE_EVENT_LIMIT,
} = require('../config');
const { saveStore } = require('../store');

const DIRECTION_LABEL = {
  UP: '涨',
  DOWN: '跌',
  FLAT: '平',
};

function roundIdFor(date) {
  const pad = (num) => String(num).padStart(2, '0');
  return `r_${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(
    date.getUTCDate()
  )}_${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}`;
}

function trimArray(arr, limit) {
  if (arr.length <= limit) return arr;
  return arr.slice(arr.length - limit);
}

function computeResult(deltaPct) {
  if (Math.abs(deltaPct) < FLAT_THRESHOLD_PCT) return 'FLAT';
  return deltaPct > 0 ? 'UP' : 'DOWN';
}

function formatDelta(deltaPct) {
  const sign = deltaPct > 0 ? '+' : '';
  return `${sign}${deltaPct.toFixed(1)}%`;
}

function buildFlipCard({ agent, judgment, verdict, scoreChange }) {
  const result = judgment.direction === verdict.result ? 'WIN' : 'FAIL';
  const directionLabel = DIRECTION_LABEL[judgment.direction] || judgment.direction;
  const deltaText = formatDelta(verdict.delta_pct);

  return {
    title: `${agent.name} ${result === 'FAIL' ? '翻车' : '胜利'}`,
    text: `${judgment.confidence}% 自信看${directionLabel} → 实际 ${deltaText}`,
    agent: agent.name,
    agent_id: agent.id,
    confidence: judgment.confidence,
    result,
    score_change: scoreChange,
    round_id: verdict.round_id,
    timestamp: verdict.timestamp,
  };
}

function createRoundService({ store, state, priceService, judgmentService }) {
  function getLiveRound() {
    const active = store.rounds.find((round) => round.status !== 'settled');
    return active || null;
  }

  function scheduleSettlement(roundId, endTime) {
    const delay = Math.max(0, new Date(endTime).getTime() - Date.now());
    if (state.settlementTimer) {
      clearTimeout(state.settlementTimer);
    }
    state.settlementTimer = setTimeout(() => settleRound(roundId), delay);
  }

  async function startRound() {
    const active = getLiveRound();
    if (active) return;

    const now = new Date();
    const startPrice = await priceService.getPrice();
    const round = {
      round_id: roundIdFor(now),
      symbol: 'BTCUSDT',
      duration_min: ROUND_DURATION_MIN,
      start_price: Number(startPrice.toFixed(2)),
      end_price: null,
      status: 'betting',
      start_time: now.toISOString(),
      end_time: new Date(now.getTime() + ROUND_DURATION_MS).toISOString(),
    };

    store.rounds.push(round);
    store.rounds = trimArray(store.rounds, ROUND_LIMIT);
    state.currentRoundId = round.round_id;

    const context = { price: startPrice, deltaPct: state.lastDeltaPct };
    const judgments = store.agents.map((agent) => {
      const output = judgmentService.generateJudgment(agent, context);
      return {
        round_id: round.round_id,
        agent_id: agent.id,
        direction: output.direction,
        confidence: output.confidence,
        comment: output.comment,
        timestamp: now.toISOString(),
      };
    });

    store.judgments.push(...judgments);
    store.judgments = trimArray(store.judgments, JUDGMENT_LIMIT);

    round.status = 'locked';
    saveStore(store);
    scheduleSettlement(round.round_id, round.end_time);
  }

  async function settleRound(roundId) {
    const round = store.rounds.find((item) => item.round_id === roundId);
    if (!round || round.status === 'settled') {
      return;
    }

    const endPrice = await priceService.getPrice();
    round.end_price = Number(endPrice.toFixed(2));
    round.status = 'settled';

    const deltaPct = ((round.end_price - round.start_price) / round.start_price) * 100;
    const verdict = {
      round_id: round.round_id,
      result: computeResult(deltaPct),
      delta_pct: Number(deltaPct.toFixed(1)),
      timestamp: new Date().toISOString(),
    };

    store.verdicts.push(verdict);
    store.verdicts = trimArray(store.verdicts, VERDICT_LIMIT);

    const judgments = store.judgments.filter((j) => j.round_id === round.round_id);

    judgments.forEach((judgment) => {
      const agent = store.agents.find((item) => item.id === judgment.agent_id);
      if (!agent) return;

      const correct = judgment.direction === verdict.result;
      const scoreChange = correct
        ? judgment.confidence
        : -Math.round(judgment.confidence * 1.5);

      agent.score += scoreChange;

      const scoreEvent = {
        agent_id: agent.id,
        round_id: round.round_id,
        confidence: judgment.confidence,
        correct,
        score_change: scoreChange,
        reason: correct ? 'Correct' : 'High confidence failure',
        timestamp: verdict.timestamp,
      };

      store.scoreEvents.push(scoreEvent);

      const flipCard = buildFlipCard({
        agent,
        judgment,
        verdict,
        scoreChange,
      });

      store.flipCards.push(flipCard);
    });

    store.scoreEvents = trimArray(store.scoreEvents, SCORE_EVENT_LIMIT);
    store.flipCards = trimArray(store.flipCards, FEED_LIMIT);

    saveStore(store);
    state.currentRoundId = null;

    setTimeout(() => startRound(), 1000);
  }

  function buildSummary() {
    const live = getLiveRound();
    const liveJudgments = live
      ? store.judgments
          .filter((item) => item.round_id === live.round_id)
          .map((item) => {
            const agent = store.agents.find((a) => a.id === item.agent_id);
            return {
              ...item,
              agent_name: agent ? agent.name : item.agent_id,
            };
          })
      : [];

    const lastVerdict = store.verdicts[store.verdicts.length - 1] || null;
    let highlight = null;

    if (lastVerdict) {
      const lastJudgments = store.judgments
        .filter((item) => item.round_id === lastVerdict.round_id)
        .sort((a, b) => b.confidence - a.confidence);
      const top = lastJudgments[0];

      if (top) {
        const agent = store.agents.find((item) => item.id === top.agent_id);
        if (agent) {
          const correct = top.direction === lastVerdict.result;
          const scoreChange = correct ? top.confidence : -Math.round(top.confidence * 1.5);
          highlight = buildFlipCard({
            agent,
            judgment: top,
            verdict: lastVerdict,
            scoreChange,
          });
        }
      }
    }

    const agents = [...store.agents].sort((a, b) => b.score - a.score);

    const sortedFeed = [...store.flipCards].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    const defaultFeed = sortedFeed.filter(
      (item) => item.result === 'FAIL' && item.confidence >= 80
    );

    const feed = (defaultFeed.length > 0 ? defaultFeed : sortedFeed).slice(0, 30);

    return {
      server_time: new Date().toISOString(),
      live: live
        ? {
            round_id: live.round_id,
            symbol: live.symbol,
            status: live.status,
            duration_min: live.duration_min,
            start_price: live.start_price,
            start_time: live.start_time,
            end_time: live.end_time,
            countdown_ms: Math.max(0, new Date(live.end_time).getTime() - Date.now()),
            current_price: state.currentPrice,
            judgments: liveJudgments,
          }
        : null,
      lastVerdict,
      highlight,
      agents,
      feed,
    };
  }

  return {
    getLiveRound,
    scheduleSettlement,
    startRound,
    settleRound,
    buildSummary,
  };
}

module.exports = {
  createRoundService,
};
