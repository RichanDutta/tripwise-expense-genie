
import React, { useState, useEffect } from "react";
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
import { 
  Wallet, 
  Plus, 
  TrendingUp, 
  Filter, 
  Calendar, 
  X,
  Download,
  ArrowUpDown
} from "lucide-react";
import { ExpenseChart } from "./ExpenseChart";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { AddExpenseForm, ExpenseFormData } from "./AddExpenseForm";
import { toast } from "@/hooks/use-toast";

export interface Expense {
  id: string;
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

const STORAGE_KEY = "travel_expenses";

export function ExpenseTracker() {
  const [activeTab, setActiveTab] = useState("chart");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Load expenses from localStorage on component mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem(STORAGE_KEY);
    if (savedExpenses) {
      try {
        setExpenses(JSON.parse(savedExpenses));
      } catch (error) {
        console.error("Failed to parse saved expenses", error);
        toast({
          title: "Error",
          description: "Failed to load saved expenses",
          variant: "destructive",
        });
      }
    }
  }, []);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  const handleAddExpense = (data: ExpenseFormData) => {
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      category: data.category,
      amount: data.amount,
      date: data.date.toISOString().split('T')[0],
      description: data.description,
    };
    
    setExpenses((prev) => [...prev, newExpense]);
    setIsDialogOpen(false);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    toast({
      title: "Success",
      description: "Expense deleted successfully",
    });
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(expenses, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `travel-expenses-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Success",
      description: "Expenses exported successfully",
    });
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Filter and sort expenses
  const filteredExpenses = expenses
    .filter(expense => !filterCategory || expense.category === filterCategory)
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

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

  // Calculate total expense
  const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);

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
          <Button size="sm" className="rounded-full" onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-1 h-4 w-4" /> Add Expense
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chart" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="chart">Chart View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          <TabsContent value="chart" className="space-y-4">
            {chartData.length > 0 ? (
              <ExpenseChart data={chartData} />
            ) : (
              <div className="text-center py-10 text-gray-500">
                <Calendar className="h-10 w-10 mx-auto opacity-30 mb-3" />
                <p>No expense data to display</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus className="mr-1 h-4 w-4" /> Add Your First Expense
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="list">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-gray-500 flex items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2"
                  onClick={toggleSortOrder}
                >
                  <ArrowUpDown className="h-4 w-4 mr-1" /> 
                  {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
                </Button>
              </div>
              <div className="flex gap-2">
                {filterCategory && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-2 flex items-center gap-1"
                    onClick={() => setFilterCategory(null)}
                  >
                    {filterCategory} <X className="h-4 w-4" />
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2" 
                  onClick={handleExport}
                >
                  <Download className="h-4 w-4 mr-1" /> Export
                </Button>
              </div>
            </div>
            {filteredExpenses.length > 0 ? (
              <div className="space-y-3">
                {filteredExpenses.map((expense) => {
                  const category = CATEGORIES.find(
                    (c) => c.name === expense.category
                  );
                  return (
                    <div
                      key={expense.id}
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
                            <button 
                              className="hover:underline hover:text-travel-blue"
                              onClick={() => setFilterCategory(expense.category)}
                            >
                              {expense.category}
                            </button>
                            <span className="mx-2">•</span>
                            <span>{formatDate(expense.date)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-semibold">₹{expense.amount}</div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          onClick={() => handleDeleteExpense(expense.id)}
                        >
                          <X className="h-4 w-4 text-gray-500 hover:text-red-500" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                <Calendar className="h-10 w-10 mx-auto opacity-30 mb-3" />
                <p>No expenses found</p>
                {filterCategory && (
                  <p className="text-sm mt-2">Try removing the filter or add new expenses</p>
                )}
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus className="mr-1 h-4 w-4" /> Add Expense
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <div>
          <div className="text-sm text-gray-500">Total Spent</div>
          <div className="text-2xl font-bold">
            ₹{totalExpense.toLocaleString()}
          </div>
        </div>
        <Button 
          variant="outline" 
          className="rounded-full" 
          size="sm" 
          onClick={() => setActiveTab("chart")}
        >
          <TrendingUp className="mr-1 h-4 w-4" /> View Analytics
        </Button>
      </CardFooter>

      {/* Add Expense Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
          </DialogHeader>
          <AddExpenseForm 
            onAddExpense={handleAddExpense} 
            categories={CATEGORIES} 
            onClose={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
