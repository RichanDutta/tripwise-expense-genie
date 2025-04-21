
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
    console.log("AI Assistant configured with:", { 
      apiUrl: currentConfig.apiUrl,
      model: currentConfig.model,
      apiKey: currentConfig.apiKey ? "API key provided" : "No API key" 
    });
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
      // or if explicitly requested via environment variable
      if (process.env.NODE_ENV === "development" && process.env.REACT_APP_USE_MOCK_AI === "true") {
        return this.getMockResponse(content);
      }
      
      // Fallback to mock if no API URL is configured
      if (!apiUrl || apiUrl.trim() === "") {
        console.warn("No API URL configured, using mock response");
        return this.getMockResponse(content);
      }
      
      // Make the actual API call to the Python backend
      const response = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(currentConfig.apiKey && { 'Authorization': `Bearer ${currentConfig.apiKey}` }),
          // Add CORS headers to allow cross-origin requests
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
        body: JSON.stringify({ 
          message: content,
          model: currentConfig.model
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        throw new Error(`API returned status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      
      if (!data || !data.response) {
        throw new Error("Invalid response format from AI backend");
      }
      
      return data.response;
    } catch (error) {
      console.error("Error in AI Assistant Service:", error);
      
      // Check if it's a network error (likely CORS or server not running)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error("Could not connect to the AI backend. Please check that your backend server is running and accessible.");
      }
      
      // Check if it's a CORS error
      if (error instanceof DOMException && error.name === "NetworkError") {
        throw new Error("CORS error: Your backend server needs to allow requests from this origin.");
      }
      
      throw new Error(error instanceof Error ? error.message : "Failed to get response from AI assistant");
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
