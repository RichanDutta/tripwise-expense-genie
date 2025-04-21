
import React, { useState } from "react";
import { Bot, Send, CalendarDays, MapPin, Compass, BadgeDollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { AIMessage } from "@/types/aiAssistant";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { AIAssistantConfig as AIConfigComponent } from "./AIAssistantConfig";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AIAssistant() {
  const [inputMessage, setInputMessage] = useState("");
  const { messages, isLoading, error, sendMessage, configure } = useAIAssistant();
  const [activeTab, setActiveTab] = useState("general");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    
    try {
      await sendMessage(inputMessage, activeTab);
      setInputMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      
      let errorMessage = "Failed to send message. Please check the Python backend connection.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleConfigChange = (newConfig) => {
    configure(newConfig);
    toast({
      title: "Configuration Updated",
      description: "AI Assistant is now connected to " + newConfig.apiUrl,
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const getPlaceholderText = () => {
    switch (activeTab) {
      case "itinerary":
        return "Ask for an itinerary (e.g., '5-day trip to Goa')...";
      case "budget":
        return "Ask about travel costs (e.g., 'Budget for Kerala')...";
      default:
        return "Ask anything about your trip...";
    }
  };

  const getSampleQueries = () => {
    switch (activeTab) {
      case "itinerary":
        return [
          "Create a 5-day itinerary for Manali",
          "Plan a budget-friendly 3-day trip to Goa",
          "Luxury weekend getaway in Jaipur"
        ];
      case "budget":
        return [
          "Cost breakdown for a week in Kerala",
          "Budget for family trip to Darjeeling",
          "Luxury vacation expenses in Goa"
        ];
      default:
        return [
          "Suggest budget-friendly stays in Goa",
          "What are the best places to visit in Jaipur?",
          "When is the best time to visit Kerala?"
        ];
    }
  };

  return (
    <Card className="shadow-md border border-travel-purple/20 h-full relative">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Bot className="mr-2 h-5 w-5 text-travel-purple" />
          AI Travel Assistant
        </CardTitle>
      </CardHeader>
      <AIConfigComponent onConfigChanged={handleConfigChange} />
      <CardContent className="flex flex-col h-[calc(100%-60px)]">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-3">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="general" className="text-xs">
              <Compass className="h-3.5 w-3.5 mr-1" />
              General
            </TabsTrigger>
            <TabsTrigger value="itinerary" className="text-xs">
              <CalendarDays className="h-3.5 w-3.5 mr-1" />
              Itinerary
            </TabsTrigger>
            <TabsTrigger value="budget" className="text-xs">
              <BadgeDollarSign className="h-3.5 w-3.5 mr-1" />
              Budget
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex-1 overflow-y-auto space-y-3 mb-3">
          {messages.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 italic">
                {activeTab === "itinerary" ? 
                  "\"I can create detailed daily itineraries for your destination with activities, accommodations, and local insights.\"" :
                activeTab === "budget" ? 
                  "\"Let me help you plan your travel budget with breakdowns for accommodation, food, transportation, and activities.\"" :
                  "\"How can I help you plan your trip today? Ask me about destinations, budget tips, or local recommendations.\""}
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg ${
                  message.sender === "user" 
                    ? "bg-travel-indigo/10 ml-4" 
                    : "bg-gray-50 mr-4"
                }`}
              >
                {message.sender === "assistant" ? (
                  <div className="text-sm whitespace-pre-line markdown-content">{message.content}</div>
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="bg-gray-50 rounded-lg p-3 mr-4 animate-pulse">
              <p className="text-sm text-gray-500">Thinking...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 rounded-lg p-3 mr-4 text-red-500">
              <p className="text-sm">Error: {error}</p>
              <p className="text-xs mt-1">Check the Python backend connection in settings</p>
            </div>
          )}
        </div>

        <div className="space-y-2 mt-auto">
          {messages.length === 0 && (
            <>
              {getSampleQueries().map((query, index) => (
                <Button 
                  key={index}
                  variant="outline" 
                  className="w-full justify-start text-left h-auto py-2 px-3"
                  onClick={() => {
                    setInputMessage(query);
                    handleSubmit(new Event('click') as any);
                  }}
                >
                  {query}
                </Button>
              ))}
            </>
          )}
          
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              placeholder={getPlaceholderText()}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={isLoading || !inputMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>

      <style>{`
        .markdown-content h2 {
          font-size: 1.1rem;
          font-weight: bold;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }

        .markdown-content h3 {
          font-size: 1rem;
          font-weight: 600;
          margin-top: 0.75rem;
          margin-bottom: 0.25rem;
        }

        .markdown-content ul, .markdown-content ol {
          list-style: disc;
          margin-left: 1.5rem;
        }

        .markdown-content p {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </Card>
  );
}
