
import React from "react";
import { Container } from "@/components/ui/container";
import { TripCard } from "./TripCard";
import { ExpenseTracker } from "./ExpenseTracker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Dashboard() {
  // Sample trip data
  const trips = [
    {
      id: 1,
      title: "Goa Beach Vacation",
      destination: "Goa, India",
      date: "Oct 15 - Oct 20, 2023",
      imageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1000",
      progress: 75,
    },
    {
      id: 2,
      title: "Manali Adventure",
      destination: "Manali, Himachal Pradesh",
      date: "Dec 10 - Dec 15, 2023",
      imageUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1000",
      progress: 30,
    },
    {
      id: 3,
      title: "Rajasthan Heritage Tour",
      destination: "Jaipur, Rajasthan",
      date: "Jan 5 - Jan 12, 2024",
      imageUrl: "https://images.unsplash.com/photo-1599661046827-9a2f7a531220?auto=format&fit=crop&q=80&w=1000",
      progress: 10,
    },
  ];

  return (
    <div className="py-16 bg-gray-50">
      <Container>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Your Travel Dashboard</h2>
          <Button className="rounded-full">
            <Plus className="mr-2 h-4 w-4" /> New Trip
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Upcoming Trips</h3>
                <Button variant="ghost" size="sm" className="text-travel-indigo">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {trips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    title={trip.title}
                    destination={trip.destination}
                    date={trip.date}
                    imageUrl={trip.imageUrl}
                    progress={trip.progress}
                    className="animate-fade-in"
                    style={{ animationDelay: `${trip.id * 0.1}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <ExpenseTracker />
            
            <Card className="shadow-md border border-travel-purple/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Bot className="mr-2 h-5 w-5 text-travel-purple" />
                  AI Travel Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 italic">
                    "How can I help you plan your trip today? Ask me about destinations, 
                    budget tips, or local recommendations."
                  </p>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-left h-auto py-2 px-3">
                    Suggest budget-friendly stays in Goa
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-left h-auto py-2 px-3">
                    What are the best places to visit in Jaipur?
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-left h-auto py-2 px-3">
                    Create a 5-day itinerary for Manali
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
