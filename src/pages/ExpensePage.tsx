
import React from "react";
import { Navbar } from "@/components/Navbar";
import { ExpenseTracker } from "@/components/ExpenseTracker";
import { Container } from "@/components/ui/container";

const ExpensePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Container className="py-16">
        <h1 className="text-3xl font-bold mb-6">Expense Manager</h1>
        <div className="max-w-4xl mx-auto">
          <ExpenseTracker />
        </div>
      </Container>
    </div>
  );
};

export default ExpensePage;
