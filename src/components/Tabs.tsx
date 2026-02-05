import type { ReactNode } from 'react';

export type TabItem<T extends string> = {
  id: T;
  label: string;
  content: ReactNode;
};

export function Tabs<T extends string>({
  items,
  activeId,
  onChange,
}: {
  items: Array<TabItem<T>>;
  activeId: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="tabs">
      <div className="tabs-list" role="tablist">
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              className={`tab-btn ${active ? 'active' : ''}`}
              onClick={() => onChange(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div className="tabs-panel" role="tabpanel">
        {items.find((item) => item.id === activeId)?.content}
      </div>
    </div>
  );
}
