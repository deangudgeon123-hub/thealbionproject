import React from 'react';
import { Message, Role } from '../types';

interface ChatMessageProps {
  message: Message;
}

// Utility to strip markdown bolding and ensure clean text
const cleanText = (text: string) => {
  return text
    .replace(/\*\*/g, '') // Remove double asterisks
    .replace(/^#+\s/gm, '') // Remove header hashes
    .trim();
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  if (isUser) {
    return (
      <div className="flex justify-end mb-6 w-full">
        <div className="max-w-[85%] text-right">
          <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-1 font-semibold">
            You
          </div>
          <div className="text-slate-800 text-sm md:text-base bg-white border border-slate-200 py-3 px-5 rounded-tl-xl rounded-tr-xl rounded-bl-xl shadow-sm">
            {message.text}
          </div>
        </div>
      </div>
    );
  }

  // AlbionAI Message
  return (
    <div className="flex justify-start mb-8 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="max-w-[95%] md:max-w-[85%]">
             <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-albion-blue rounded-full"></div>
                <div className="text-[10px] uppercase tracking-widest text-albion-blue font-bold">
                    AlbionAI Analysis
                </div>
             </div>
            
            <div className="bg-albion-blue text-white py-4 px-6 rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-md border border-blue-900/50">
                 <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-p:text-blue-50 prose-li:text-blue-50 prose-strong:text-white prose-strong:font-bold prose-headings:text-white">
                    <div className="whitespace-pre-wrap font-sans">
                        {cleanText(message.text).replace(/^AlbionAI analysis:\s*/i, '')}
                    </div>
                 </div>
            </div>
            
             <div className="flex items-center justify-between mt-2 px-1">
                <span className="text-[10px] text-slate-400 font-medium">Source: Official Policy Documentation</span>
                <span className="text-[10px] text-slate-400">{message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
        </div>
    </div>
  );
};

export default ChatMessage;