import React from 'react';
import { SUGGESTED_TOPICS } from '../constants';
import { ActivityIcon, ChevronRightIcon } from './Icons';

interface TopicSelectorProps {
  onSelect: (prompt: string) => void;
  disabled: boolean;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({ onSelect, disabled }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      {SUGGESTED_TOPICS.map((topic, index) => (
        <button
          key={topic.id}
          onClick={() => onSelect(topic.prompt)}
          disabled={disabled}
          className="group relative flex flex-col items-start p-5 bg-slate-900/40 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/40 transition-all duration-300 text-left disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
        >
          {/* Background Grid Accent */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:12px_12px] opacity-0 group-hover:opacity-10 transition-opacity" />

          <div className="flex w-full justify-between items-start mb-3 z-10">
            <div className="flex items-center gap-2">
              <span className="text-xl opacity-80">{topic.icon}</span>
              <span className="text-[10px] font-mono text-blue-500 tracking-widest uppercase">
                Module 0{index + 1}
              </span>
            </div>
            <ActivityIcon />
          </div>

          <h3 className="text-sm md:text-base font-semibold text-slate-200 group-hover:text-white transition-colors z-10">
            {topic.label}
          </h3>

          <div className="mt-4 flex items-center text-xs text-slate-500 group-hover:text-blue-400 transition-colors gap-1 font-mono z-10">
            <span>INITIATE BRIEFING</span>
            <ChevronRightIcon />
          </div>
          
          {/* Corner accent */}
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-slate-600 group-hover:border-blue-500 transition-colors"></div>
        </button>
      ))}
    </div>
  );
};

export default TopicSelector;