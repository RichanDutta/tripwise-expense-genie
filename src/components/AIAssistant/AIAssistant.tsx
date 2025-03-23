
import React, { useState } from "react";
import { Bot, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { AIMessage } from "@/types/aiAssistant";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

export function AIAssistant() {
  const [inputMessage, setInputMessage] = useState("");
  const { messages, isLoading, sendMessage } = useAIAssistant();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    
    try {
      await sendMessage(inputMessage);
      setInputMessage("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-md border border-travel-purple/20 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Bot className="mr-2 h-5 w-5 text-travel-purple" />
          AI Travel Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-[calc(100%-60px)]">
        <div className="flex-1 overflow-y-auto space-y-3 mb-3">
          {messages.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 italic">
                "How can I help you plan your trip today? Ask me about destinations, 
                budget tips, or local recommendations."
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
                <p className="text-sm">
                  {message.content}
                </p>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="bg-gray-50 rounded-lg p-3 mr-4 animate-pulse">
              <p className="text-sm text-gray-500">Thinking...</p>
            </div>
          )}
        </div>

        <div className="space-y-2 mt-auto">
          {messages.length === 0 && (
            <>
              <Button variant="outline" className="w-full justify-start text-left h-auto py-2 px-3">
                Suggest budget-friendly stays in Goa
              </Button>
              <Button variant="outline" className="w-full justify-start text-left h-auto py-2 px-3">
                What are the best places to visit in Jaipur?
              </Button>
              <Button variant="outline" className="w-full justify-start text-left h-auto py-2 px-3">
                Create a 5-day itinerary for Manali
              </Button>
            </>
          )}
          
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              placeholder="Ask anything about your trip..."
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
    </Card>
  );
}
