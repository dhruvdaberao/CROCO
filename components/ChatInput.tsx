import React, { useState, useRef, useEffect } from 'react';
import { SendIcon, ImageFileIcon } from './Icons';

interface ChatInputProps {
  onSend: (message: string, imageBase64?: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((inputValue.trim() || image) && !isLoading) {
      onSend(inputValue.trim(), image || undefined);
      setInputValue('');
      setImage(null);
      if(fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div>
        {image && (
            <div className="mb-2 p-2 bg-secondary rounded-lg w-fit relative">
                <img src={image} alt="Preview" className="h-20 w-20 object-cover rounded" />
                <button onClick={() => setImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs">&times;</button>
            </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center bg-secondary p-2 rounded-full shadow-md w-full border border-gray-300/60">
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 text-gray-500 hover:text-accent transition-colors"
            aria-label="Attach image"
        >
            <ImageFileIcon />
        </button>
        <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isLoading ? "Croco is thinking..." : "Type your message..."}
            className="flex-1 bg-transparent px-3 py-2 text-text-light placeholder-gray-500/70 resize-none focus:outline-none"
            rows={1}
            disabled={isLoading}
            aria-label="Chat input"
        />
        <button
            type="submit"
            disabled={isLoading || (!inputValue.trim() && !image)}
            className="p-2.5 rounded-full bg-accent text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-hover transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary focus:ring-accent"
            aria-label="Send message"
        >
            <SendIcon />
        </button>
        </form>
    </div>
  );
};

export default ChatInput;
