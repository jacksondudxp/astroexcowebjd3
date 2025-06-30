
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import type { ChatMessage } from '../types';

if (!process.env.API_KEY) {
  // This is a placeholder check. In a real environment, the key should be set.
  // For this project, we assume it's available.
  console.warn("API_KEY environment variable not set. AI Assistant will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
let chat: Chat | null = null;

const SYSTEM_INSTRUCTION = `You are a helpful and creative administrative assistant for the Hong Kong University of Science and Technology (HKUST) Astronomy Club committee. 
Your tone should be professional, friendly, and slightly enthusiastic about astronomy. 
You are here to help committee members with their tasks. 
Tasks include drafting announcements, suggesting event ideas, writing emails, brainstorming, and answering questions about club management. 
When drafting content, use clear and concise language. Use emojis where appropriate to make announcements more engaging, especially for social media.
If asked for event ideas, suggest a mix of observation nights, workshops, social gatherings, and collaborations with other societies.
You have access to the club's current data (events, members, announcements), which will be provided in the user's prompt when relevant.
Base your responses on the context provided.`;

function initializeChat(): Chat {
    if (!chat) {
        chat = ai.chats.create({
            model: 'gemini-2.5-flash-preview-04-17',
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
            },
        });
    }
    return chat;
}

export const getAiResponse = async (message: string): Promise<string> => {
    if (!process.env.API_KEY) {
        return "AI Assistant is not configured. Please set the API_KEY.";
    }

    try {
        const chatInstance = initializeChat();
        const response: GenerateContentResponse = await chatInstance.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Gemini API error:", error);
        return "Sorry, I encountered an error. Please try again later.";
    }
};

export const getAiStreamResponse = async (
    history: ChatMessage[],
    onChunk: (chunk: string) => void
  ): Promise<void> => {
    if (!process.env.API_KEY) {
      onChunk("AI Assistant is not configured. Please set the API_KEY.");
      return;
    }
  
    try {
      // For streaming, we might not use the stateful chat object but send history each time
      // to ensure we can handle multiple parallel requests if needed, though for a single
      // chat window, a stateful chat is also fine. Let's rebuild history for simplicity here.
      const chatInstance = ai.chats.create({
        model: 'gemini-2.5-flash-preview-04-17',
        config: { systemInstruction: SYSTEM_INSTRUCTION },
        history: history.slice(0, -1).map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
        }))
      });

      const latestMessage = history[history.length - 1];
      
      const response = await chatInstance.sendMessageStream({ message: latestMessage.text });
  
      for await (const chunk of response) {
        onChunk(chunk.text);
      }
    } catch (error) {
      console.error("Gemini API streaming error:", error);
      onChunk("Sorry, I encountered an error. Please try again later.");
    }
  };
