
import { AIMessageContent, AIAssistantConfig } from "@/types/aiAssistant";

// Default configuration
const defaultConfig: AIAssistantConfig = {
  apiUrl: "http://localhost:5000/api/ai-assistant",
  apiKey: "",
  model: "default"
};

// Store the current configuration
let currentConfig: AIAssistantConfig = { ...defaultConfig };

export const aiAssistantService = {
  // Update the configuration
  configure(config: Partial<AIAssistantConfig>) {
    currentConfig = { ...currentConfig, ...config };
    console.log("AI Assistant configured with:", currentConfig);
    return currentConfig;
  },

  // Get the current configuration
  getConfig(): AIAssistantConfig {
    return { ...currentConfig };
  },

  // Send a message to the AI assistant
  async sendMessage(content: string): Promise<AIMessageContent> {
    try {
      const apiUrl = currentConfig.apiUrl || defaultConfig.apiUrl;
      
      console.log(`Sending message to ${apiUrl}/chat`);
      
      // In development, we might still use mock responses if the backend isn't ready
      if (process.env.NODE_ENV === "development" && process.env.REACT_APP_USE_MOCK_AI === "true") {
        return this.getMockResponse(content);
      }
      
      // Make the actual API call to the Python backend
      const response = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(currentConfig.apiKey && { 'Authorization': `Bearer ${currentConfig.apiKey}` }),
        },
        body: JSON.stringify({ 
          message: content,
          model: currentConfig.model
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Error in AI Assistant Service:", error);
      throw new Error("Failed to get response from AI assistant");
    }
  },
  
  // Mock response function - useful for development and testing
  async getMockResponse(content: string): Promise<AIMessageContent> {
    // Mock responses - these will be removed when connecting to the real Python backend
    const mockResponses = [
      "Based on your budget, I recommend staying at Zostel or Backpacker Panda in North Goa for affordable accommodations with great social atmosphere.",
      "For Jaipur, don't miss Amber Fort, Hawa Mahal, City Palace, Jantar Mantar, and Jal Mahal. The local markets like Johari Bazaar are also worth exploring!",
      "I've created a 5-day itinerary for Manali: Day 1: Arrive and explore Mall Road. Day 2: Visit Solang Valley. Day 3: Hike to Jogini Waterfall. Day 4: Day trip to Naggar Castle. Day 5: Visit Beas River and Hadimba Temple before departure.",
      "October is a great time to visit Kerala as the monsoon ends and the weather becomes pleasant. The backwaters will be full, and the landscapes lush green!",
      "For a family of four, budget around ₹25,000 for accommodations, ₹15,000 for food, ₹10,000 for local transport, and ₹20,000 for activities over a 5-day trip to Darjeeling.",
    ];
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return a random mock response
    const randomIndex = Math.floor(Math.random() * mockResponses.length);
    return mockResponses[randomIndex];
  }
};
