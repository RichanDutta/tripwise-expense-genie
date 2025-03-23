
export type AIMessageSender = "user" | "assistant";
export type AIMessageContent = string;

export interface AIMessage {
  sender: AIMessageSender;
  content: AIMessageContent;
}

// This will be expanded when integrating with the Python backend
export interface AIAssistantConfig {
  apiUrl?: string;
  apiKey?: string;
  model?: string;
}
