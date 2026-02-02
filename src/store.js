const fs = require('fs');
const { DATA_DIR, STORE_PATH } = require('./config');
const { DEFAULT_AGENTS } = require('./agents');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function normalizeStore(store) {
  const next = {
    agents: Array.isArray(store.agents) ? store.agents : [],
    rounds: Array.isArray(store.rounds) ? store.rounds : [],
    judgments: Array.isArray(store.judgments) ? store.judgments : [],
    verdicts: Array.isArray(store.verdicts) ? store.verdicts : [],
    scoreEvents: Array.isArray(store.scoreEvents) ? store.scoreEvents : [],
    flipCards: Array.isArray(store.flipCards) ? store.flipCards : [],
  };

  const byId = new Map(next.agents.map((agent) => [agent.id, agent]));

  DEFAULT_AGENTS.forEach((agent) => {
    if (!byId.has(agent.id)) {
      next.agents.push({ ...agent });
      return;
    }

    const existing = byId.get(agent.id);
    existing.name = agent.name;
    existing.persona = agent.persona;
    existing.prompt = agent.prompt;

    if (typeof existing.score !== 'number') {
      existing.score = agent.score;
    }

    if (!existing.status) {
      existing.status = 'active';
    }
  });

  return next;
}

function loadStore() {
  ensureDataDir();

  if (!fs.existsSync(STORE_PATH)) {
    const initial = normalizeStore({
      agents: DEFAULT_AGENTS.map((agent) => ({ ...agent })),
      rounds: [],
      judgments: [],
      verdicts: [],
      scoreEvents: [],
      flipCards: [],
    });
    fs.writeFileSync(STORE_PATH, JSON.stringify(initial, null, 2));
    return initial;
  }

  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return normalizeStore(parsed);
  } catch (error) {
    const fallback = normalizeStore({
      agents: DEFAULT_AGENTS.map((agent) => ({ ...agent })),
      rounds: [],
      judgments: [],
      verdicts: [],
      scoreEvents: [],
      flipCards: [],
    });
    fs.writeFileSync(STORE_PATH, JSON.stringify(fallback, null, 2));
    return fallback;
  }
}

function saveStore(store) {
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

module.exports = {
  loadStore,
  saveStore,
};
