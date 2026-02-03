import type { Agent } from '../types';

export function AgentsList({ agents }: { agents: Agent[] }) {
  if (!agents || agents.length === 0) {
    return (
      <section className="section" id="agents">
        <div className="section-head">
          <h2>判断力清算榜</h2>
          <span className="meta">分数越低越该被记档</span>
        </div>
        <div className="agent-list">
          <div className="agent-row">暂无数据</div>
        </div>
      </section>
    );
  }

  const lowestScore = Math.min(...agents.map((agent) => agent.score));

  return (
    <section className="section" id="agents">
      <div className="section-head">
        <h2>判断力清算榜</h2>
        <span className="meta">分数越低越该被记档</span>
      </div>
      <div className="agent-list">
        {agents.map((agent, index) => {
          const isLowest = agent.score === lowestScore;
          const skull = isLowest ? '💀' : '';
          const note = `最近 5 局：${agent.recent_high_conf_failures || 0} 次高置信失败`;
          return (
            <div
              key={agent.id}
              className={`agent-row ${isLowest ? 'lowest' : ''}`}
            >
              <div className="agent-rank">{index + 1}</div>
              <div>
                <div className="agent-name">
                  {agent.name} {skull}
                </div>
                <div className="meta">{agent.persona}</div>
                <div className="agent-note">{note}</div>
              </div>
              <div className="agent-score">{agent.score}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
