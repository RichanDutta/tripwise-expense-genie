
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TripCardProps {
  title: string;
  destination: string;
  date: string;
  imageUrl: string;
  progress: number;
  className?: string;
}

export function TripCard({
  title,
  destination,
  date,
  imageUrl,
  progress,
  className,
}: TripCardProps) {
  return (
    <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-lg", className)}>
      <div className="relative h-48 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transform transition-transform duration-500 hover:scale-110"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-xl font-semibold mb-1">{title}</h3>
          <div className="flex items-center text-sm opacity-90">
            <MapPin className="mr-1 h-4 w-4" />
            {destination}
          </div>
        </div>
      </div>
      <CardContent className="pt-4">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Calendar className="mr-2 h-4 w-4" />
          {date}
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-travel-blue" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Trip Progress</span>
          <span>{progress}%</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full rounded-full" variant="outline">
          View Details <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
