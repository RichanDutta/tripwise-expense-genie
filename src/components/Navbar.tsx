
import React from "react";
import { Link } from "react-router-dom";
import { Container } from "./ui/container";
import { navigationMenuTriggerStyle } from "./ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useLocation } from "react-router-dom";

export function Navbar() {
  const location = useLocation();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex gap-6 md:gap-10">
            <Link to="/" className="flex items-center space-x-2">
              <span className="hidden font-bold sm:inline-block">
                Travel Planner
              </span>
            </Link>
            <nav className="flex gap-2">
              <Link 
                to="/" 
                className={cn(
                  navigationMenuTriggerStyle(),
                  location.pathname === "/" ? "bg-accent text-accent-foreground" : ""
                )}
              >
                Home
              </Link>
              <Link 
                to="/expenses" 
                className={cn(
                  navigationMenuTriggerStyle(),
                  location.pathname === "/expenses" ? "bg-accent text-accent-foreground" : ""
                )}
              >
                Expenses
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
            <Button size="sm">Get Started</Button>
          </div>
        </div>
      </Container>
    </header>
  );
}
