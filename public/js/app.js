import { fetchSummary } from './api.js';
import { dom } from './dom.js';
import { state } from './state.js';
import { formatCountdown } from './utils.js';
import {
  renderAgents,
  renderFeed,
  renderLive,
  renderLastSync,
  renderServerTime,
  renderVerdict,
  setSyncStatus,
} from './render.js';

const REFRESH_MS = 5000;

function updateCountdown() {
  if (!state.endTime) {
    dom.liveCountdown.textContent = '--:--';
    return;
  }
  const remaining = new Date(state.endTime).getTime() - Date.now();
  dom.liveCountdown.textContent = formatCountdown(remaining);
}

async function refresh() {
  try {
    const summary = await fetchSummary();
    state.summary = summary;
    renderServerTime(summary.server_time);
    state.lastSync = Date.now();
    renderLastSync(state.lastSync);
    renderLive(summary.live, state);
    renderVerdict(summary.lastVerdict, summary.highlight);
    renderAgents(summary.agents);
    renderFeed(summary.feed);
    setSyncStatus(true);
    triggerVerdictImpact(summary.highlight);
  } catch (error) {
    console.error(error);
    setSyncStatus(false);
  }
}

function triggerVerdictImpact(highlight) {
  if (!highlight || !highlight.round_id) return;
  if (state.lastHighlight === highlight.round_id) return;
  state.lastHighlight = highlight.round_id;
  dom.verdictCard.classList.remove('impact');
  void dom.verdictCard.offsetWidth;
  dom.verdictCard.classList.add('impact');
}

function startLoops() {
  if (state.countdownTimer) {
    clearInterval(state.countdownTimer);
  }
  if (state.refreshTimer) {
    clearInterval(state.refreshTimer);
  }

  state.countdownTimer = setInterval(updateCountdown, 1000);
  state.refreshTimer = setInterval(refresh, REFRESH_MS);
}

refresh();
startLoops();
