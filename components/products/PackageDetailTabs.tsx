'use client';

import { useState } from 'react';

type TabId = 'contents' | 'storage';

export function PackageDetailTabs({
  contents,
  storage,
}: {
  contents: string[];
  storage: string[];
}) {
  const [active, setActive] = useState<TabId>('contents');

  const tabs: { id: TabId; label: string; body: string[] }[] = [
    { id: 'contents', label: 'Package Contents', body: contents },
    { id: 'storage', label: 'Storage Logic', body: storage },
  ];

  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <div className="rounded-[10px] border border-line bg-paper">
      <div
        role="tablist"
        aria-label="Package details"
        className="flex flex-wrap gap-1 border-b border-line px-2 pt-2"
      >
        {tabs.map((t) => {
          const isActive = t.id === active;
          return (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls={`panel-${t.id}`}
              id={`tab-${t.id}`}
              onClick={() => setActive(t.id)}
              className={`relative flex-1 rounded-t-[6px] px-4 py-3 text-micro font-medium uppercase tracking-[0.08em] transition-colors ${
                isActive
                  ? 'bg-mist text-brand-teal'
                  : 'text-muted hover:text-ink'
              }`}
            >
              {t.label}
              {isActive && (
                <span
                  aria-hidden
                  className="absolute inset-x-3 bottom-0 h-px bg-brand-teal"
                />
              )}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`panel-${current.id}`}
        aria-labelledby={`tab-${current.id}`}
        className="px-6 py-6"
      >
        <ul className="space-y-2 text-body text-muted">
          {current.body.map((line, i) => (
            <li key={i} className="leading-relaxed">
              {line}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
