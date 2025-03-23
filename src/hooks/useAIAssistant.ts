
import { useState } from "react";
import { AIMessage } from "@/types/aiAssistant";
import { aiAssistantService } from "@/services/aiAssistantService";

export function useAIAssistant() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    try {
      // Add user message to the state
      const userMessage: AIMessage = { sender: "user", content };
      setMessages((prev) => [...prev, userMessage]);
      
      // Set loading state
      setIsLoading(true);
      
      // Call API service - currently this is a mock but will connect to Python backend
      const response = await aiAssistantService.sendMessage(content);
      
      // Add AI response to the state
      const aiMessage: AIMessage = { sender: "assistant", content: response };
      setMessages((prev) => [...prev, aiMessage]);
      
      return response;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
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
