
import React from 'react';
import { CrocoAvatarIcon } from './Icons';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-end space-x-3 animate-fade-in">
      <div className="w-8 h-8 rounded-full flex-shrink-0">
        <CrocoAvatarIcon />
      </div>
      <div className="p-4 bg-model-bg rounded-r-2xl rounded-bl-2xl shadow-md">
        <div className="flex items-center space-x-1.5">
          <div className="w-2 h-2 bg-text-dark/50 rounded-full animate-pulse-fast"></div>
          <div className="w-2 h-2 bg-text-dark/50 rounded-full animate-pulse-fast [animation-delay:0.2s]"></div>
          <div className="w-2 h-2 bg-text-dark/50 rounded-full animate-pulse-fast [animation-delay:0.4s]"></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
