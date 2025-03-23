
export type AIMessageSender = "user" | "assistant";
export type AIMessageContent = string;

export interface AIMessage {
  sender: AIMessageSender;
  content: AIMessageContent;
}

// Expanded configuration for Python backend integration
export interface AIAssistantConfig {
  apiUrl?: string;   // URL to the Python backend API
  apiKey?: string;   // Optional API key for authentication
  model?: string;    // LLM model to use (if the backend supports multiple models)
}

// Response format from the Python backend
export interface AIAssistantResponse {
  response: string;
  model?: string;
  tokens?: number;
  processingTime?: number;
}
