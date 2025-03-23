
// This service will handle communication with the Python backend
// Currently implemented with mock responses but designed to be replaced with actual API calls

import { AIMessageContent } from "@/types/aiAssistant";

// This will be replaced with your Python backend URL
const API_BASE_URL = "/api/ai-assistant";

// Mock responses - these will be removed when connecting to the real Python backend
const mockResponses = [
  "Based on your budget, I recommend staying at Zostel or Backpacker Panda in North Goa for affordable accommodations with great social atmosphere.",
  "For Jaipur, don't miss Amber Fort, Hawa Mahal, City Palace, Jantar Mantar, and Jal Mahal. The local markets like Johari Bazaar are also worth exploring!",
  "I've created a 5-day itinerary for Manali: Day 1: Arrive and explore Mall Road. Day 2: Visit Solang Valley. Day 3: Hike to Jogini Waterfall. Day 4: Day trip to Naggar Castle. Day 5: Visit Beas River and Hadimba Temple before departure.",
  "October is a great time to visit Kerala as the monsoon ends and the weather becomes pleasant. The backwaters will be full, and the landscapes lush green!",
  "For a family of four, budget around ₹25,000 for accommodations, ₹15,000 for food, ₹10,000 for local transport, and ₹20,000 for activities over a 5-day trip to Darjeeling.",
];

export const aiAssistantService = {
  async sendMessage(content: string): Promise<AIMessageContent> {
    try {
      // In a real implementation, this would be replaced with an actual API call to your Python backend
      // For example:
      // const response = await fetch(`${API_BASE_URL}/chat`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ message: content }),
      // });
      // const data = await response.json();
      // return data.response;
      
      // Mock implementation - simulating network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return a random mock response
      const randomIndex = Math.floor(Math.random() * mockResponses.length);
      return mockResponses[randomIndex];
    } catch (error) {
      console.error("Error in AI Assistant Service:", error);
      throw new Error("Failed to get response from AI assistant");
    }
  }
};
