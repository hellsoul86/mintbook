import { useTranslation } from 'react-i18next';
import type { Agent } from '../types';
import { localizeAgent } from '../utils/localize';

export function AgentsList({ agents }: { agents: Agent[] }) {
  const { t, i18n } = useTranslation();

  if (!agents || agents.length === 0) {
    return (
      <section className="section" id="agents">
        <div className="section-head">
          <h2>{t('agents.sectionTitle')}</h2>
          <span className="meta">{t('agents.sectionMeta')}</span>
        </div>
        <div className="agent-list">
          <div className="agent-row">{t('agents.empty')}</div>
        </div>
      </section>
    );
  }

  const highestScore = Math.max(...agents.map((agent) => agent.score));

  return (
    <section className="section" id="agents">
      <div className="section-head">
        <h2>{t('agents.sectionTitle')}</h2>
        <span className="meta">{t('agents.sectionMeta')}</span>
      </div>
      <div className="agent-list">
        {agents.map((agent, index) => {
          const localized = localizeAgent(agent, i18n.language, t);
          const isTop = localized.score === highestScore;
          const note = t('agents.note', {
            count: localized.recent_high_conf_failures || 0,
          });
          return (
            <div
              key={localized.id}
              className={`agent-row ${isTop ? 'top' : ''}`}
            >
              <div className="agent-rank">{index + 1}</div>
              <div>
                <div className="agent-name">{localized.name}</div>
                <div className="meta">{localized.persona}</div>
                <div className="agent-note">{note}</div>
              </div>
              <div className="agent-score">{localized.score}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
