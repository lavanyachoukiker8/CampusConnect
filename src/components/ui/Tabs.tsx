import React, { useState } from 'react';

export const Tabs = ({ tabs }: { tabs: { label: string, content: React.ReactNode }[] }) => {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="border-b border-gray-200 flex space-x-4 overflow-x-auto" role="tablist">
        {tabs.map((tab, i) => (
          <button 
            key={i} 
            role="tab"
            aria-selected={active === i}
            aria-controls={`tabpanel-${i}`}
            id={`tab-${i}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)} 
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') {
                e.preventDefault();
                setActive((i + 1) % tabs.length);
              } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                setActive((i - 1 + tabs.length) % tabs.length);
              }
            }}
            className={`py-2 px-4 border-b-2 font-medium text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 whitespace-nowrap transition-colors motion-reduce:transition-none ${active === i ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div 
        className="mt-4 focus:outline-none" 
        role="tabpanel" 
        id={`tabpanel-${active}`} 
        aria-labelledby={`tab-${active}`}
        tabIndex={0}
      >
        {tabs[active].content}
      </div>
    </div>
  );
};
