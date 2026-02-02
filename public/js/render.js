import { dom } from './dom.js';
import { directionLabel, formatPrice, formatDelta } from './utils.js';

export function setSyncStatus(isOnline) {
  if (!dom.syncStatus) return;
  dom.syncStatus.textContent = isOnline ? 'LIVE' : 'OFFLINE';
  dom.syncStatus.classList.toggle('online', isOnline);
  dom.syncStatus.classList.toggle('offline', !isOnline);
  if (dom.offlineBanner) {
    dom.offlineBanner.style.display = isOnline ? 'none' : 'flex';
  }
}

export function renderServerTime(serverTime) {
  if (!dom.serverTime) return;
  const value = serverTime ? new Date(serverTime) : new Date();
  dom.serverTime.textContent = value.toLocaleTimeString('en-US', { hour12: false });
}

export function renderLastSync(syncTime) {
  if (!dom.lastSync) return;
  const value = syncTime ? new Date(syncTime) : new Date();
  dom.lastSync.textContent = value.toLocaleTimeString('en-US', { hour12: false });
}

export function renderLive(live, endTimeRef) {
  if (!live) {
    dom.liveSymbol.textContent = '--';
    dom.liveRoundId.textContent = 'round --';
    dom.liveStatus.textContent = '--';
    dom.liveDuration.textContent = '--';
    dom.livePrice.textContent = '--';
    dom.liveStartPrice.textContent = '--';
    dom.liveDelta.textContent = '--';
    dom.liveDelta.classList.remove('positive', 'negative');
    dom.liveDeltaHint.textContent = 'vs start';
    endTimeRef.endTime = null;
    renderJudgments([]);
    return;
  }

  dom.liveSymbol.textContent = live.symbol;
  dom.liveRoundId.textContent = live.round_id;
  dom.liveStatus.textContent = live.status;
  dom.liveDuration.textContent = `${live.duration_min} min`;
  dom.livePrice.textContent = formatPrice(live.current_price);
  dom.liveStartPrice.textContent = formatPrice(live.start_price);
  endTimeRef.endTime = live.end_time;

  if (typeof live.current_price === 'number' && typeof live.start_price === 'number') {
    const delta = ((live.current_price - live.start_price) / live.start_price) * 100;
    dom.liveDelta.textContent = formatDelta(delta, 2);
    dom.liveDelta.classList.toggle('positive', delta > 0);
    dom.liveDelta.classList.toggle('negative', delta < 0);
    dom.liveDeltaHint.textContent = delta === 0 ? 'flat' : 'vs start';
  } else {
    dom.liveDelta.textContent = '--';
    dom.liveDelta.classList.remove('positive', 'negative');
    dom.liveDeltaHint.textContent = 'vs start';
  }

  renderJudgments(live.judgments);
}

export function renderJudgments(judgments) {
  dom.judgmentRow.innerHTML = '';
  if (!judgments || judgments.length === 0) {
    dom.judgmentRow.innerHTML = '<div class="judgment-card">等待判断...</div>';
    return;
  }

  judgments.forEach((item) => {
    const card = document.createElement('div');
    const directionClass = item.direction.toLowerCase();
    card.className = 'judgment-card';
    card.innerHTML = `
      <div class="agent">${item.agent_name}</div>
      <div class="direction ${directionClass}">${directionLabel(item.direction)} ${item.confidence}%</div>
      <div class="comment">${item.comment}</div>
    `;
    dom.judgmentRow.appendChild(card);
  });
}

export function renderVerdict(lastVerdict, highlight) {
  dom.verdictCard.classList.remove('fail', 'win');

  if (!lastVerdict) {
    dom.verdictTag.textContent = '裁决中';
    dom.verdictAgent.textContent = '--';
    dom.verdictText.textContent = '等待第一局裁决';
    dom.verdictDelta.textContent = '--';
    dom.verdictScore.textContent = '--';
    return;
  }

  if (highlight) {
    const isFail = highlight.result === 'FAIL';
    dom.verdictTag.textContent = isFail ? '翻车裁决' : '胜利裁决';
    dom.verdictCard.classList.add(isFail ? 'fail' : 'win');
    dom.verdictAgent.textContent = `${isFail ? '❌' : '✅'} ${highlight.agent}`;
    dom.verdictText.textContent = highlight.text;
    dom.verdictDelta.textContent = formatDelta(lastVerdict.delta_pct);
    const sign = highlight.score_change > 0 ? '+' : '';
    dom.verdictScore.textContent = `${sign}${highlight.score_change} 分`;
    return;
  }

  dom.verdictTag.textContent = '裁决完成';
  dom.verdictAgent.textContent = '🔔 裁决完成';
  dom.verdictText.textContent = `实际 ${formatDelta(lastVerdict.delta_pct)}`;
  dom.verdictDelta.textContent = formatDelta(lastVerdict.delta_pct);
  dom.verdictScore.textContent = '--';
}

export function renderAgents(agents) {
  dom.agentList.innerHTML = '';

  if (!agents || agents.length === 0) {
    dom.agentList.innerHTML = '<div class="agent-row">暂无数据</div>';
    return;
  }

  const lowestScore = Math.min(...agents.map((agent) => agent.score));

  agents.forEach((agent, index) => {
    const row = document.createElement('div');
    row.className = 'agent-row';
    if (agent.score === lowestScore) {
      row.classList.add('lowest');
    }

    const skull = agent.score === lowestScore ? '💀' : '';

    row.innerHTML = `
      <div class="agent-rank">${index + 1}</div>
      <div>
        <div class="agent-name">${agent.name} ${skull}</div>
        <div class="meta">${agent.persona}</div>
      </div>
      <div class="agent-score">${agent.score}</div>
    `;
    dom.agentList.appendChild(row);
  });
}

export function renderFeed(feed) {
  dom.feedList.innerHTML = '';

  if (!feed || feed.length === 0) {
    dom.feedList.innerHTML = '<div class="feed-card">暂无翻车记录</div>';
    return;
  }

  feed.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = `feed-card ${item.result === 'FAIL' ? 'fail' : 'win'}`;
    card.style.animationDelay = `${index * 70}ms`;

    const sign = item.score_change > 0 ? '+' : '';
    const time = item.timestamp
      ? new Date(item.timestamp).toLocaleTimeString('en-US', { hour12: false })
      : '--:--:--';
    const scoreClass = item.score_change >= 0 ? 'positive' : 'negative';
    const tag =
      item.result === 'FAIL' && item.confidence >= 80 ? '<span class="tag">HIGH CONF</span>' : '';

    card.innerHTML = `
      <div>
        <div class="title">${item.title} ${tag}</div>
        <div class="meta">${item.text}</div>
        <div class="feed-meta">${item.confidence}% · ${time}</div>
      </div>
      <div class="score ${scoreClass}">${sign}${item.score_change} 分</div>
    `;

    dom.feedList.appendChild(card);
  });
}
