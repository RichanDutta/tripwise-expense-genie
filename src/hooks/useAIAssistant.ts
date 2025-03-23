
import { useState, useCallback } from "react";
import { AIMessage, AIAssistantConfig } from "@/types/aiAssistant";
import { aiAssistantService } from "@/services/aiAssistantService";

export function useAIAssistant(initialConfig?: Partial<AIAssistantConfig>) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize with provided config
  if (initialConfig) {
    aiAssistantService.configure(initialConfig);
  }
  
  // Function to update configuration
  const configure = useCallback((config: Partial<AIAssistantConfig>) => {
    return aiAssistantService.configure(config);
  }, []);

  // Function to send message to the AI assistant
  const sendMessage = async (content: string) => {
    try {
      // Reset error state
      setError(null);
      
      // Add user message to the state
      const userMessage: AIMessage = { sender: "user", content };
      setMessages((prev) => [...prev, userMessage]);
      
      // Set loading state
      setIsLoading(true);
      
      // Call API service - connects to Python backend
      const response = await aiAssistantService.sendMessage(content);
      
      // Add AI response to the state
      const aiMessage: AIMessage = { sender: "assistant", content: response };
      setMessages((prev) => [...prev, aiMessage]);
      
      return response;
    } catch (error) {
      console.error("Error sending message:", error);
      setError(error instanceof Error ? error.message : "Unknown error occurred");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    configure,
    clearMessages: () => setMessages([]),
    clearError: () => setError(null),
  };
}
