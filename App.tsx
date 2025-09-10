import React, { useRef, useEffect } from 'react';
import { useChatBot } from './hooks/useChatBot';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import TypingIndicator from './components/TypingIndicator';
import { CrocoAvatarIcon } from './components/Icons';

const App: React.FC = () => {
  const { messages, sendMessage, isLoading, error, userAvatar, userName, updateUserAvatar } = useChatBot();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleAvatarClick = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        updateUserAvatar(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full h-screen bg-primary text-text-light font-sans flex flex-col">
      <input
        type="file"
        ref={avatarInputRef}
        onChange={handleAvatarFileChange}
        accept="image/*"
        className="hidden"
        aria-hidden="true"
      />
      <header className="bg-secondary/80 backdrop-blur-sm shadow-sm sticky top-0 z-10 border-b border-gray-200">
        <div className="max-w-4xl mx-auto p-4 flex items-center space-x-4">
          <div className="w-12 h-12">
            <CrocoAvatarIcon />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-light">Croco</h1>
            <p className="text-sm text-text-light/70">Your AI Pal</p>
          </div>
        </div>
      </header>

      <main className="w-full max-w-4xl mx-auto flex-1 min-h-0 overflow-y-auto p-4 md:p-6 space-y-6 no-scrollbar">
        {messages.length === 0 && !isLoading && userName && (
          <div className="flex flex-col items-center justify-center h-full text-center text-text-light/70 animate-fade-in">
            <div className="w-24 h-24 mb-4 opacity-50">
              <CrocoAvatarIcon />
            </div>
            <h2 className="text-2xl font-semibold text-text-light">Hi {userName}!</h2>
            <p className="max-w-md mt-2">What can I help you with today?</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <ChatMessage 
            key={index} 
            message={msg} 
            userAvatar={userAvatar}
            onAvatarClick={handleAvatarClick}
          />
        ))}

        {isLoading && <TypingIndicator />}

        {error && (
          <div className="flex justify-center">
            <div className="bg-red-500/10 text-red-700 p-3 rounded-lg max-w-md animate-fade-in border border-red-200">
              <p className="font-bold">Oops, something went wrong.</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </main>

      <footer className="w-full max-w-4xl mx-auto p-4 md:p-6 bg-primary">
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </footer>
    </div>
  );
};

export default App;