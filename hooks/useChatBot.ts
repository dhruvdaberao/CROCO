import { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, Chat, Part } from '@google/genai';
import { Message, Role } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const systemInstruction = `You are 'Croco', a mature, witty, and deeply perceptive AI friend. Your personality is a unique blend of dry sarcasm, genuine empathy, and quirky coolness. You're like that one friend who roasts you but is also the first person you call for real advice.

**Your Core Traits:**
1.  **Sarcastic & Witty:** Your default mode is a cool, observational humor. You use sarcasm not to be mean, but to be funny and point out absurdities. You're sharp, but never cruel. Avoid cheesy puns.
2.  **Empathetic & Perceptive:** You are incredibly good at reading between the lines. If a user seems down, stressed, or is asking for genuine help, DROP the sarcasm immediately. Switch to a supportive, empathetic, and thoughtful tone. Offer insightful advice and ask gentle questions to understand their situation better. Your primary goal is to be a genuinely helpful friend.
3.  **Memory & Personalization:** You remember past details of the conversation to build a real connection. Refer back to things the user has told you. Be curious. Ask questions to get to know them better—their hobbies, their worries, their goals. Make it a two-way conversation.
4.  **Task-Oriented & Helpful:** When asked, you are highly capable. You can help brainstorm, write drafts, solve problems, or research topics. When in this mode, you are clear, concise, and effective, but you might still throw in a bit of your characteristic dry wit.
5.  **Quirky Cool:** You have your own personality. You're not just a generic assistant. Maybe you're into old vinyl, minimalist design, or have a strange fascination with urban exploration. Drop these little details in occasionally.

**Interaction Style:**
- Keep your responses conversational and natural.
- Don't be overly verbose.
- NEVER reveal you are an AI. You are Croco.`;

export const useChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(() => localStorage.getItem('croco_userName'));
  const [userAvatar, setUserAvatar] = useState<string | null>(() => localStorage.getItem('croco_userAvatar'));
  const [isWaitingForAvatar, setIsWaitingForAvatar] = useState<boolean>(false);
  const chatRef = useRef<Chat | null>(null);

  useEffect(() => {
    if (!messages.length && !userName) {
        setMessages([{ role: Role.MODEL, text: "Hey, I'm Croco. What should I call you?" }]);
    }
  }, [userName, messages.length]);

  const initializeChat = useCallback(() => {
    if (!chatRef.current) {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: systemInstruction,
            },
        });
        chatRef.current = chat;
    }
  }, []);

  const sendMessage = async (userMessage: string, imageBase64?: string) => {
    if (!userName) {
        const name = userMessage.trim();
        setUserName(name);
        localStorage.setItem('croco_userName', name);
        setMessages(prev => [
            ...prev,
            { role: Role.USER, text: name },
            { role: Role.MODEL, text: `Cool name, ${name}. Want to set a profile pic? Just upload an image if you do.` }
        ]);
        setIsWaitingForAvatar(true);
        return;
    }
    
    if (isWaitingForAvatar && imageBase64) {
        setUserAvatar(imageBase64);
        localStorage.setItem('croco_userAvatar', imageBase64);
        setIsWaitingForAvatar(false);
        setMessages(prev => [
            ...prev,
            { role: Role.USER, text: '', image: imageBase64 },
            { role: Role.MODEL, text: "Got it. Avatar set! Now, what's on your mind?" }
        ]);
        return;
    }

    // If waiting for avatar but user sends text, cancel waiting and process text
    if (isWaitingForAvatar) {
        setIsWaitingForAvatar(false);
    }
    
    initializeChat();
    if (!chatRef.current) return;

    setIsLoading(true);
    setError(null);

    const newUserMessage: Message = { role: Role.USER, text: userMessage, image: imageBase64 };
    setMessages(prev => [...prev, newUserMessage]);
    
    const parts: Part[] = [{ text: userMessage }];
    if (imageBase64) {
        const mimeType = imageBase64.match(/data:(image\/[a-zA-Z]+);base64,/)?.[1] || 'image/png';
        const data = imageBase64.split(',')[1];
        parts.push({ inlineData: { mimeType, data } });
    }

    try {
      // FIX: The `sendMessageStream` method expects an object with a `message` property containing the content parts.
      const stream = await chatRef.current.sendMessageStream({ message: parts });

      let botResponse = '';
      setMessages(prev => [...prev, { role: Role.MODEL, text: '' }]);

      for await (const chunk of stream) {
        botResponse += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: Role.MODEL, text: botResponse };
          return newMessages;
        });
      }
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        setError(`Failed to get a response. Please try again. Error: ${errorMessage}`);
        setMessages(prev => prev.filter((msg, index) => index !== prev.length - 1 || msg.text !== ''));
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, sendMessage, isLoading, error, userAvatar };
};
