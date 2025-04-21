
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
  async sendMessage(content: string, purpose: string = "general"): Promise<AIMessageContent> {
    try {
      const apiUrl = currentConfig.apiUrl || defaultConfig.apiUrl;
      
      console.log(`Sending message to ${apiUrl}/chat with purpose: ${purpose}`);
      
      // In development, we might still use mock responses if the backend isn't ready
      // or if explicitly requested via environment variable
      if (process.env.NODE_ENV === "development" && process.env.REACT_APP_USE_MOCK_AI === "true") {
        return this.getMockResponse(content, purpose);
      }
      
      // Fallback to mock if no API URL is configured
      if (!apiUrl || apiUrl.trim() === "") {
        console.warn("No API URL configured, using mock response");
        return this.getMockResponse(content, purpose);
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
          content: content,
          model: currentConfig.model,
          purpose: purpose // Add purpose to help guide the model's response
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
  async getMockResponse(content: string, purpose: string = "general"): Promise<AIMessageContent> {
    // Different types of mock responses based on the query purpose
    if (purpose === "itinerary") {
      return this.getMockItinerary(content);
    } else if (purpose === "budget") {
      return this.getMockBudget(content);
    }
    
    // General mock responses
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
  },
  
  // Mock itinerary generator
  async getMockItinerary(query: string): Promise<AIMessageContent> {
    // Extract some basic information from the query
    const destination = query.includes("Goa") ? "Goa" : 
                        query.includes("Jaipur") ? "Jaipur" : 
                        query.includes("Manali") ? "Manali" : 
                        query.includes("Kerala") ? "Kerala" : 
                        query.includes("Darjeeling") ? "Darjeeling" : "your destination";
    
    const days = query.includes("3 day") || query.includes("3-day") ? 3 : 
                 query.includes("5 day") || query.includes("5-day") ? 5 : 
                 query.includes("7 day") || query.includes("7-day") ? 7 : 4;
    
    const budget = query.toLowerCase().includes("budget") || query.toLowerCase().includes("affordable") ? "budget-friendly" : 
                  query.toLowerCase().includes("luxury") ? "luxury" : "mid-range";
    
    // Create a mock itinerary
    return `
## ${days}-Day ${budget.charAt(0).toUpperCase() + budget.slice(1)} Itinerary for ${destination}

### Overview
- **Duration**: ${days} days
- **Budget Level**: ${budget}
- **Best Time to Visit**: ${destination === "Goa" ? "November to February" : destination === "Kerala" ? "October to March" : "March to June"}

### Day 1
- **Morning**: Arrive and check in to your accommodation
- **Afternoon**: Orientation walk around main areas
- **Evening**: Welcome dinner at a local restaurant
- **Accommodation**: ${budget === "budget-friendly" ? "Backpacker hostel" : budget === "luxury" ? "5-star resort" : "3-star hotel"}
- **Daily Budget**: ${budget === "budget-friendly" ? "₹2,000-3,000" : budget === "luxury" ? "₹15,000-20,000" : "₹5,000-8,000"} per person

### Day 2
- **Morning**: Visit the main attractions
- **Afternoon**: Cultural experience or workshop
- **Evening**: Street food tour
- **Daily Budget**: Similar to Day 1

${days >= 3 ? `### Day 3
- **Morning**: Day trip to nearby attraction
- **Afternoon**: Free time for shopping or relaxation
- **Evening**: Sunset viewing spot
- **Daily Budget**: Add ₹1,000-2,000 for transportation` : ""}

${days >= 4 ? `### Day 4
- **Morning**: Adventure activity (hiking/water sports)
- **Afternoon**: Beach/garden relaxation
- **Evening**: Cultural show
- **Daily Budget**: Add ₹1,500-3,000 for activities` : ""}

${days >= 5 ? `### Day 5
- **Morning**: Local market exploration
- **Afternoon**: Museum or historical site
- **Evening**: Farewell dinner
- **Daily Budget**: Similar to Day 1` : ""}

${days >= 6 ? `### Day 6
- **Morning**: Wellness activity (yoga/spa)
- **Afternoon**: Cooking class
- **Evening**: Free time
- **Daily Budget**: Add ₹2,000-4,000 for special activities` : ""}

${days >= 7 ? `### Day 7
- **Morning**: Last-minute shopping
- **Afternoon**: Departure
- **Daily Budget**: Transportation to airport/station (₹500-2,000)` : ""}

### Total Estimated Budget
- **Accommodation**: ${budget === "budget-friendly" ? `₹${(days * 1000).toLocaleString()}-${(days * 2000).toLocaleString()}` : budget === "luxury" ? `₹${(days * 8000).toLocaleString()}-${(days * 12000).toLocaleString()}` : `₹${(days * 3000).toLocaleString()}-${(days * 5000).toLocaleString()}`}
- **Food**: ${budget === "budget-friendly" ? `₹${(days * 800).toLocaleString()}-${(days * 1200).toLocaleString()}` : budget === "luxury" ? `₹${(days * 3000).toLocaleString()}-${(days * 5000).toLocaleString()}` : `₹${(days * 1500).toLocaleString()}-${(days * 2500).toLocaleString()}`}
- **Transportation**: ${budget === "budget-friendly" ? `₹${(days * 300).toLocaleString()}-${(days * 500).toLocaleString()}` : budget === "luxury" ? `₹${(days * 2000).toLocaleString()}-${(days * 3000).toLocaleString()}` : `₹${(days * 800).toLocaleString()}-${(days * 1200).toLocaleString()}`}
- **Activities**: ${budget === "budget-friendly" ? `₹${(days * 500).toLocaleString()}-${(days * 1000).toLocaleString()}` : budget === "luxury" ? `₹${(days * 3000).toLocaleString()}-${(days * 5000).toLocaleString()}` : `₹${(days * 1000).toLocaleString()}-${(days * 2000).toLocaleString()}`}
- **Miscellaneous**: ${budget === "budget-friendly" ? `₹${(days * 300).toLocaleString()}-${(days * 500).toLocaleString()}` : budget === "luxury" ? `₹${(days * 1000).toLocaleString()}-${(days * 2000).toLocaleString()}` : `₹${(days * 500).toLocaleString()}-${(days * 1000).toLocaleString()}`}
- **TOTAL**: ${budget === "budget-friendly" ? `₹${(days * 2900).toLocaleString()}-${(days * 5200).toLocaleString()}` : budget === "luxury" ? `₹${(days * 17000).toLocaleString()}-${(days * 27000).toLocaleString()}` : `₹${(days * 6800).toLocaleString()}-${(days * 11700).toLocaleString()}`}

### Suggested Accommodations
- **Budget**: ${destination === "Goa" ? "Zostel Goa, Backpacker Panda" : destination === "Jaipur" ? "Moustache Hostel, Zostel Jaipur" : "Local hostels and guesthouses"}
- **Mid-range**: ${destination === "Goa" ? "Sea Queen Hotel, Santana Beach Resort" : destination === "Jaipur" ? "Umaid Bhawan, Alsisar Haveli" : "3-star hotels and heritage stays"}
- **Luxury**: ${destination === "Goa" ? "W Goa, Grand Hyatt" : destination === "Jaipur" ? "Taj Rambagh Palace, Oberoi Rajvilas" : "5-star hotels and luxury resorts"}

Would you like me to modify this itinerary or provide more specific details on any aspect?
`;
  },
  
  // Mock budget planner
  async getMockBudget(query: string): Promise<AIMessageContent> {
    // Extract some basic information from the query
    const destination = query.includes("Goa") ? "Goa" : 
                        query.includes("Jaipur") ? "Jaipur" : 
                        query.includes("Manali") ? "Manali" : 
                        query.includes("Kerala") ? "Kerala" : 
                        query.includes("Darjeeling") ? "Darjeeling" : "your destination";
    
    const days = query.includes("3 day") || query.includes("3-day") ? 3 : 
                 query.includes("5 day") || query.includes("5-day") ? 5 : 
                 query.includes("7 day") || query.includes("7-day") ? 7 : 4;
                 
    const people = query.includes("family") ? 4 : 
                  query.includes("couple") ? 2 : 
                  query.includes("solo") ? 1 : 2;
                  
    const budget = query.toLowerCase().includes("budget") || query.toLowerCase().includes("affordable") ? "budget-friendly" : 
                  query.toLowerCase().includes("luxury") ? "luxury" : "mid-range";
    
    // Calculate sample costs
    const accommodationCostPerDay = budget === "budget-friendly" ? 1500 : 
                                  budget === "luxury" ? 10000 : 4000;
                                  
    const foodCostPerDay = budget === "budget-friendly" ? 800 : 
                         budget === "luxury" ? 3000 : 1500;
                         
    const transportCostPerDay = budget === "budget-friendly" ? 400 : 
                              budget === "luxury" ? 2500 : 1000;
                              
    const activityCostPerDay = budget === "budget-friendly" ? 600 : 
                             budget === "luxury" ? 4000 : 1500;
                             
    const miscCostPerDay = budget === "budget-friendly" ? 300 : 
                         budget === "luxury" ? 1500 : 600;
                         
    // Total costs
    const accommodationTotal = accommodationCostPerDay * days;
    const foodTotal = foodCostPerDay * days * people;
    const transportTotal = transportCostPerDay * days;
    const activityTotal = activityCostPerDay * days * people;
    const miscTotal = miscCostPerDay * days * people;
    const grandTotal = accommodationTotal + foodTotal + transportTotal + activityTotal + miscTotal;
    
    return `
## ${budget.charAt(0).toUpperCase() + budget.slice(1)} Budget Plan for ${destination} (${days} days, ${people} ${people === 1 ? "person" : "people"})

### Accommodation
- **Type**: ${budget === "budget-friendly" ? "Hostel/Budget Hotel" : budget === "luxury" ? "5-star Resort/Hotel" : "3-star Hotel"}
- **Cost per night**: ₹${accommodationCostPerDay.toLocaleString()}
- **Total for ${days} nights**: ₹${accommodationTotal.toLocaleString()}
- **Tips**: ${budget === "budget-friendly" ? "Book in advance and consider hostels with shared facilities" : budget === "luxury" ? "Look for package deals that include spa or dining credits" : "Check for free breakfast options to save on meal costs"}

### Food
- **Average cost per person per day**: ₹${foodCostPerDay.toLocaleString()}
- **Total for ${people} ${people === 1 ? "person" : "people"} for ${days} days**: ₹${foodTotal.toLocaleString()}
- **Breakdown**:
  - Breakfast: ₹${(foodCostPerDay * 0.2).toFixed(0)} per person
  - Lunch: ₹${(foodCostPerDay * 0.3).toFixed(0)} per person
  - Dinner: ₹${(foodCostPerDay * 0.4).toFixed(0)} per person
  - Snacks/drinks: ₹${(foodCostPerDay * 0.1).toFixed(0)} per person

### Local Transportation
- **Average daily cost**: ₹${transportCostPerDay.toLocaleString()}
- **Total for ${days} days**: ₹${transportTotal.toLocaleString()}
- **Options**: ${budget === "budget-friendly" ? "Public buses, shared taxis" : budget === "luxury" ? "Private car with driver" : "Mix of taxis and occasional private transport"}

### Activities & Sightseeing
- **Average cost per person per day**: ₹${activityCostPerDay.toLocaleString()}
- **Total for ${people} ${people === 1 ? "person" : "people"} for ${days} days**: ₹${activityTotal.toLocaleString()}
- **Must-do experiences**: 
  ${destination === "Goa" ? "- Beach activities: ₹500-1500\n  - Water sports: ₹1000-3000\n  - Spice plantation tour: ₹500-1000" : 
    destination === "Jaipur" ? "- Fort entry fees: ₹500-1000\n  - Elephant ride: ₹1000-1500\n  - City Palace tour: ₹700-1500" : 
    "- Local attractions: ₹500-2000\n  - Adventure activities: ₹1000-3000\n  - Cultural experiences: ₹500-1500"}

### Miscellaneous
- **Average per person**: ₹${miscCostPerDay.toLocaleString()} per day
- **Total for ${people} ${people === 1 ? "person" : "people"} for ${days} days**: ₹${miscTotal.toLocaleString()}
- **Includes**: Shopping, tips, medicines, unexpected expenses

### Grand Total
- **Estimated budget for entire trip**: ₹${grandTotal.toLocaleString()}
- **Per person cost**: ₹${(grandTotal / people).toLocaleString()}
- **Daily cost per person**: ₹${(grandTotal / people / days).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}

### Money-Saving Tips
${budget === "budget-friendly" ? 
  "1. Travel during off-season for better rates\n2. Use public transportation\n3. Eat at local eateries\n4. Book accommodation with kitchen facilities\n5. Look for free activities and attractions" : 
  budget === "luxury" ? 
  "1. Book luxury packages in advance for better deals\n2. Look for complimentary airport transfers\n3. Check for hotel credit inclusions\n4. Use premium credit cards for travel benefits\n5. Consider all-inclusive resorts" : 
  "1. Mix budget meals with occasional splurges\n2. Book mid-range hotels slightly away from tourist centers\n3. Use a mix of public and private transportation\n4. Look for combo tickets for attractions\n5. Set a daily spending limit"}

### Payment Methods
- ${destination === "Goa" || destination === "Jaipur" ? "Major tourist areas accept cards, but carry cash for street vendors and small shops" : "Carry more cash as card acceptance may be limited"}
- ATMs available in ${budget === "luxury" ? "all areas" : "major areas"}
- Consider carrying a prepaid travel card for security

Need any adjustments to this budget plan? I can help you find ways to reduce costs or enhance your experience within your budget constraints.
`;
  }
};
