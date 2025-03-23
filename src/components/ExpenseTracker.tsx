
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, Plus, TrendingUp, Filter } from "lucide-react";
import { ExpenseChart } from "./ExpenseChart";

interface Expense {
  category: string;
  amount: number;
  date: string;
  description: string;
}

const CATEGORIES = [
  { name: "Transport", color: "#0EA5E9" }, // travel-blue
  { name: "Accommodation", color: "#6366F1" }, // travel-indigo
  { name: "Food", color: "#F97316" }, // travel-orange
  { name: "Activities", color: "#14B8A6" }, // travel-teal
  { name: "Shopping", color: "#8B5CF6" }, // travel-purple
  { name: "Other", color: "#F59E0B" }, // travel-amber
];

export function ExpenseTracker() {
  const [activeTab, setActiveTab] = useState("all");

  // Sample expense data
  const expenses: Expense[] = [
    {
      category: "Transport",
      amount: 2500,
      date: "2023-10-15",
      description: "Flight to Goa",
    },
    {
      category: "Accommodation",
      amount: 8000,
      date: "2023-10-15",
      description: "Hotel - 3 nights",
    },
    {
      category: "Food",
      amount: 1200,
      date: "2023-10-16",
      description: "Dinner at beach restaurant",
    },
    {
      category: "Activities",
      amount: 1500,
      date: "2023-10-17",
      description: "Scuba diving",
    },
    {
      category: "Shopping",
      amount: 900,
      date: "2023-10-18",
      description: "Souvenirs",
    },
    {
      category: "Transport",
      amount: 600,
      date: "2023-10-18",
      description: "Taxi fares",
    },
  ];

  // Process chart data
  const chartData = CATEGORIES.map((category) => {
    const total = expenses
      .filter((expense) => expense.category === category.name)
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    return {
      name: category.name,
      value: total,
      color: category.color,
    };
  }).filter(item => item.value > 0);

  // Format date string to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Wallet className="mr-2 h-5 w-5 text-travel-blue" />
              Expense Tracker
            </CardTitle>
            <CardDescription>
              Track and manage your travel expenses
            </CardDescription>
          </div>
          <Button size="sm" className="rounded-full">
            <Plus className="mr-1 h-4 w-4" /> Add Expense
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chart" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="chart">Chart View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          <TabsContent value="chart" className="space-y-4">
            <ExpenseChart data={chartData} />
          </TabsContent>
          <TabsContent value="list">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-gray-500">
                Recent Expenses
              </div>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <Filter className="h-4 w-4 mr-1" /> Filter
              </Button>
            </div>
            <div className="space-y-3">
              {expenses.map((expense, index) => {
                const category = CATEGORIES.find(
                  (c) => c.name === expense.category
                );
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <div
                        className="w-2 h-10 rounded-full mr-3"
                        style={{ backgroundColor: category?.color }}
                      />
                      <div>
                        <div className="font-medium">{expense.description}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <span>{expense.category}</span>
                          <span className="mx-2">•</span>
                          <span>{formatDate(expense.date)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">₹{expense.amount}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <div>
          <div className="text-sm text-gray-500">Total Spent</div>
          <div className="text-2xl font-bold">
            ₹{expenses.reduce((sum, expense) => sum + expense.amount, 0).toLocaleString()}
          </div>
        </div>
        <Button variant="outline" className="rounded-full" size="sm">
          <TrendingUp className="mr-1 h-4 w-4" /> View Analytics
        </Button>
      </CardFooter>
    </Card>
  );
}
