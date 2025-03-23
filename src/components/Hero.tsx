
import React from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ArrowRight, Map, Wallet, Bot } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function Hero() {
  const isMobile = useIsMobile();

  const features = [
    {
      icon: <Map className="h-5 w-5 text-travel-blue" />,
      title: "AI Trip Planner",
      description: "Get personalized itineraries based on your preferences",
    },
    {
      icon: <Wallet className="h-5 w-5 text-travel-teal" />,
      title: "Expense Tracker",
      description: "Track and categorize all your travel expenses in ₹",
    },
    {
      icon: <Bot className="h-5 w-5 text-travel-purple" />,
      title: "Travel Assistant",
      description: "AI chatbot to answer all your travel queries",
    },
  ];

  return (
    <div className="relative pt-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-travel-blue/10 via-travel-purple/5 to-travel-teal/10 -z-10" />
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30 -z-10" 
           style={{ 
             backgroundImage: 'radial-gradient(circle at 25px 25px, #ddd 2%, transparent 0%), radial-gradient(circle at 75px 75px, #ddd 2%, transparent 0%)',
             backgroundSize: '100px 100px' 
           }} />

      <Container className="relative z-10">
        <div className="flex flex-col items-center text-center pt-16 pb-12 md:pt-24 md:pb-16">
          <div 
            className="inline-block px-3 py-1 mb-6 text-xs font-medium text-travel-indigo bg-travel-indigo/10 rounded-full animate-slide-in"
            style={{ animationDelay: '0.1s' }}
          >
            AI-Powered Travel Planning for Indian Travelers
          </div>
          
          <h1 
            className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-slide-in"
            style={{ animationDelay: '0.2s' }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-travel-blue via-travel-indigo to-travel-purple">
              Plan, Track, Travel
            </span>
            <br />
            <span>Your Journey Made Simple</span>
          </h1>
          
          <p 
            className="max-w-2xl text-lg md:text-xl text-gray-600 mb-8 animate-slide-in"
            style={{ animationDelay: '0.3s' }}
          >
            The all-in-one AI travel companion that helps you plan itineraries, track expenses in ₹, 
            and optimize your budget for the perfect Indian adventure.
          </p>
          
          <div 
            className="flex flex-col sm:flex-row gap-4 mb-16 md:mb-24 animate-slide-in"
            style={{ animationDelay: '0.4s' }}
          >
            <Button 
              size="lg" 
              className="rounded-full bg-travel-blue hover:bg-travel-blue/90 shadow-lg hover:shadow-xl transition-all duration-300 px-8"
            >
              Start Planning <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="rounded-full border-travel-indigo text-travel-indigo hover:bg-travel-indigo/10 transition-all duration-300 px-8"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 pb-16 md:pb-24">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="glass-card rounded-2xl p-6 transition-all duration-300 hover:shadow-xl animate-slide-up"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-gray-100 mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
