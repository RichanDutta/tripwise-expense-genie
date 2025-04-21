
import React from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Plane } from "lucide-react";

const TripDetailsPage = () => {
  const { id } = useParams();
  
  // For now, we'll use mock data - in a real app, this would come from an API or state management
  const tripDetails = {
    id: 1,
    title: "Goa Beach Vacation",
    destination: "Goa, India",
    date: "Oct 15 - Oct 20, 2023",
    imageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1000",
    progress: 75,
    description: "Experience the vibrant beaches and rich culture of Goa. This trip includes beach activities, local cuisine exploration, and cultural visits.",
    activities: [
      "Beach hopping and water sports",
      "Visit to spice plantations",
      "Old Goa heritage tour",
      "Sunset cruise"
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Container className="py-16">
        <div className="relative h-64 rounded-lg overflow-hidden mb-8">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${tripDetails.imageUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-4xl font-bold mb-2">{tripDetails.title}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                {tripDetails.destination}
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                {tripDetails.date}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Trip Overview</h2>
              <p className="text-gray-600">{tripDetails.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Activities</h2>
              <ul className="space-y-3">
                {tripDetails.activities.map((activity, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Plane className="h-5 w-5 text-primary mt-0.5" />
                    <span>{activity}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default TripDetailsPage;
