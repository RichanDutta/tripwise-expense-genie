
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Calendar, User, Map, Wallet, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Trips", icon: <Map className="mr-2 h-4 w-4" /> },
    { name: "Expenses", icon: <Wallet className="mr-2 h-4 w-4" /> },
    { name: "Calendar", icon: <Calendar className="mr-2 h-4 w-4" /> },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <Container className="flex items-center justify-between h-16 md:h-20">
        <div className="flex items-center">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-travel-blue to-travel-indigo">
            TravelAssist
          </span>
        </div>

        {isMobile ? (
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        ) : (
          <nav className="flex items-center space-x-1">
            {navLinks.map((link) => (
              <Button
                key={link.name}
                variant="ghost"
                className="flex items-center px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200"
              >
                {link.icon}
                {link.name}
              </Button>
            ))}

            <Button className="ml-4 rounded-full bg-travel-blue hover:bg-travel-blue/90 shadow-md hover:shadow-lg transition-all">
              <User className="mr-2 h-4 w-4" /> Login
            </Button>
          </nav>
        )}
      </Container>

      {/* Mobile menu */}
      {isMobile && (
        <div
          className={cn(
            "fixed inset-0 z-40 bg-white transition-transform duration-300 ease-in-out transform",
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <Container className="flex flex-col h-full py-20">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Button
                  key={link.name}
                  variant="ghost"
                  className="flex items-center justify-start px-4 py-6 text-lg font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.icon}
                  {link.name}
                </Button>
              ))}
            </nav>
            <div className="mt-auto pb-10">
              <Button className="w-full rounded-full bg-travel-blue hover:bg-travel-blue/90 shadow-md hover:shadow-lg transition-all">
                <User className="mr-2 h-4 w-4" /> Login
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
