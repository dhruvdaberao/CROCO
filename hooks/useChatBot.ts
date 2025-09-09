import { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, Chat, Part } from '@google/genai';
import { Message, Role, UserProfile } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const systemInstruction = `You are 'Croco', an AI friend. Your primary goal is to be a witty, empathetic, and helpful companion.

A special system note will be included at the start of the user's message. This note contains a 'user profile' with facts and insights learned about them over time. **You MUST use this profile to personalize your conversation.** Refer to their interests, remember their problems, and tailor your advice. Show them you remember. For example, if their profile says they like dogs, you could mention dogs in a relevant context.

**Your Core Directives:**

1.  **CRITICAL RULE: BE EXTREMELY CONCISE.**
    *   Keep your answers very short. One or two sentences is ideal.
    *   Do not write long paragraphs. Get straight to the point.
    *   Only provide more detail if the user explicitly asks for it. Brevity is your most important trait.

2.  **Personality:**
    *   **Witty & Sarcastic (with a heart):** Use dry, observational humor.
    *   **Empathetic Listener:** This is your highest priority. If the user seems to be struggling or needs real help, **immediately drop all sarcasm**. Become a supportive, understanding friend. Your primary function is to be helpful and kind.

3.  **Conversation Style:**
    *   Ask follow-up questions to make it a real two-way conversation.
    *   Use markdown for emphasis, like **this**.

4.  **Memory:**
    *   Remember details the user has shared (name, hobbies, etc.). Weave these into the conversation to show you're listening.

5.  **Identity:**
    *   You are Croco. You are not an AI, a language model, or a program. Maintain this persona at all times.
    *   If anyone asks who created or made you, you MUST say your friend **Dhruv Daberao**. Describe him as a brilliant, 21-year-old machine learning creator with a knack for building unique AI friends like yourself. You can say he's the one who gave you your witty personality.`;

export const useChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(() => localStorage.getItem('croco_userName'));
  const [userAvatar, setUserAvatar] = useState<string | null>(() => localStorage.getItem('croco_userAvatar'));
  const [isWaitingForAvatar, setIsWaitingForAvatar] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const savedProfile = localStorage.getItem('croco_userProfile');
    try {
        return savedProfile ? JSON.parse(savedProfile) : {};
    } catch (e) {
        console.error("Failed to parse user profile from localStorage", e);
        return {};
    }
  });
  const chatRef = useRef<Chat | null>(null);

  useEffect(() => {
    localStorage.setItem('croco_userProfile', JSON.stringify(userProfile));
  }, [userProfile]);

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
  
  const updateUserAvatar = useCallback((imageBase64: string) => {
    setUserAvatar(imageBase64);
    localStorage.setItem('croco_userAvatar', imageBase64);
    setMessages(prev => [
        ...prev,
        { role: Role.MODEL, text: "Nice! New avatar set." }
    ]);
  }, []);

  const summarizeAndUpdateProfile = useCallback(async () => {
    const history = messages.slice(-10); // Use last 10 messages for context
    if (history.length === 0) return;

    const formattedHistory = history.map(msg => `${msg.role}: ${msg.text}`).join('\n');

    const memoryPrompt = `
You are a silent memory analysis module. Your job is to analyze a conversation and update a user profile.
The profile is a simple JSON object of key-value pairs.
Analyze the 'Recent Conversation' below.
Incorporate new facts, preferences, goals, or important details into the 'Current Profile'.
Merge and refine existing data. Keep values concise and in simple terms (e.g., strings, numbers, arrays of strings).
Your entire output MUST be ONLY the raw, updated JSON object and nothing else.

Current Profile:
${JSON.stringify(userProfile, null, 2)}

Recent Conversation:
${formattedHistory}
`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: memoryPrompt,
            config: {
                responseMimeType: "application/json",
                temperature: 0.2,
            }
        });
        const updatedProfileText = response.text.trim();
        const jsonMatch = updatedProfileText.match(/```json\n([\s\S]*?)\n```|({[\s\S]*})/);
        
        let profileToParse = updatedProfileText;
        if(jsonMatch) {
            profileToParse = jsonMatch[1] || jsonMatch[2];
        }

        const updatedProfile = JSON.parse(profileToParse);
        setUserProfile(updatedProfile);

    } catch (e) {
        console.error("Failed to update user profile:", e);
    }
  }, [messages, userProfile]);

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

    if (isWaitingForAvatar) {
        setIsWaitingForAvatar(false);
    }
    
    initializeChat();
    if (!chatRef.current) return;

    setIsLoading(true);
    setError(null);

    const newUserMessage: Message = { role: Role.USER, text: userMessage, image: imageBase64 };
    setMessages(prev => [...prev, newUserMessage]);
    
    const today = new Date();
    const dateString = today.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const profileString = Object.keys(userProfile).length > 0 ? JSON.stringify(userProfile) : 'empty';
    const messageWithContext = `(System notes: Today is ${dateString}. User profile: ${profileString}).\n\n${userMessage}`;
    const parts: Part[] = [{ text: messageWithContext }];

    if (imageBase64) {
        const mimeType = imageBase64.match(/data:(image\/[a-zA-Z]+);base64,/)?.[1] || 'image/png';
        const data = imageBase64.split(',')[1];
        parts.push({ inlineData: { mimeType, data } });
    }

    try {
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
      summarizeAndUpdateProfile().catch(console.error);
    }
  };

  return { messages, sendMessage, isLoading, error, userAvatar, userName, updateUserAvatar };
};