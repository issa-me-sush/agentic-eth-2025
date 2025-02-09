import { useState } from 'react';
import { Message } from '../../types/chat';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, userMessage]);

      // Get response
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content }),
      });

      if (!res.ok) throw new Error('Failed to send message');

      const responseData = await res.json();
      
      // Add timestamp to response if not present
      if (!responseData.timestamp) {
        responseData.timestamp = Date.now();
      }
      
      // Add assistant message
      setMessages(prev => [...prev, responseData]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage,
  };
} 