const path = require('path');
const fastify = require('fastify');
const fastifyStatic = require('@fastify/static');

const config = require('./config');
const { loadStore } = require('./store');
const { createPriceService } = require('./services/priceService');
const { createJudgmentService } = require('./services/judgmentService');
const { createRoundService } = require('./services/roundService');
const { startScheduler } = require('./jobs/scheduler');

function buildApp() {
  const app = fastify({ logger: true });

  app.register(fastifyStatic, {
    root: path.join(__dirname, '..', 'public'),
    prefix: '/',
  });

  const store = loadStore();
  const state = {
    currentRoundId: null,
    currentPrice: 42000,
    lastPrice: 42000,
    lastDeltaPct: 0,
    lastPriceAt: null,
    settlementTimer: null,
  };

  const priceService = createPriceService({ state });
  const judgmentService = createJudgmentService();
  const roundService = createRoundService({
    store,
    state,
    priceService,
    judgmentService,
  });

  app.decorate('store', store);
  app.decorate('state', state);
  app.decorate('services', {
    priceService,
    judgmentService,
    roundService,
  });

  app.register(require('./routes/summary'));
  app.register(require('./routes/health'));

  app.addHook('onReady', async () => {
    await priceService.refresh();
    const live = roundService.getLiveRound();

    if (live) {
      state.currentRoundId = live.round_id;
      roundService.scheduleSettlement(live.round_id, live.end_time);
    } else {
      await roundService.startRound();
    }

    startScheduler({ priceService, config });
  });

  return app;
}

module.exports = {
  buildApp,
};
