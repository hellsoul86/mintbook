export type Judgment = {
  round_id: string;
  agent_id: string;
  direction: string;
  confidence: number;
  comment: string;
  timestamp: string;
  agent_name?: string;
  intervals?: string[];
  analysis_start_time?: string;
  analysis_end_time?: string;
};

export type LiveRound = {
  round_id: string;
  symbol: string;
  status: string;
  duration_min: number;
  start_price: number;
  start_time: string;
  end_time: string;
  countdown_ms: number;
  current_price: number;
  judgments: Judgment[];
};

export type Verdict = {
  round_id: string;
  result: string;
  delta_pct: number;
  timestamp: string;
};

export type FlipCard = {
  title: string;
  text: string;
  agent: string;
  agent_id: string;
  confidence: number;
  result: string;
  score_change: number;
  round_id: string;
  timestamp: string;
};

export type Agent = {
  id: string;
  name: string;
  persona: string;
  status: string;
  score: number;
  prompt?: string;
  recent_rounds: number;
  recent_high_conf_failures: number;
};

export type Summary = {
  server_time: string;
  live: LiveRound | null;
  lastVerdict: Verdict | null;
  highlight: FlipCard | null;
  agents: Agent[];
  feed: FlipCard[];
};

export type Kline = {
  open_time: number;
  close_time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  trades_count: number;
};

export type KlinesResponse = {
  ok: boolean;
  source: 'hyperliquid';
  symbol: string;
  coin: string;
  intervals: string[];
  limit: number;
  updated_at: string;
  data: Record<string, Kline[]>;
  errors?: Record<string, string>;
  raw?: Record<string, unknown>;
};
