
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { type AIAssistantConfig as AIConfig } from "@/types/aiAssistant";
import { aiAssistantService } from "@/services/aiAssistantService";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AIAssistantConfigProps {
  onConfigChanged?: (config: AIConfig) => void;
}

export function AIAssistantConfig({ onConfigChanged }: AIAssistantConfigProps) {
  const currentConfig = aiAssistantService.getConfig();
  const [apiUrl, setApiUrl] = useState(currentConfig.apiUrl || "");
  const [apiKey, setApiKey] = useState(currentConfig.apiKey || "");
  const [model, setModel] = useState(currentConfig.model || "default");
  const [open, setOpen] = useState(false);
  const [testStatus, setTestStatus] = useState<{success?: boolean; message?: string}>({});

  const handleSave = () => {
    const newConfig = aiAssistantService.configure({
      apiUrl,
      apiKey,
      model
    });
    
    if (onConfigChanged) {
      onConfigChanged(newConfig);
    }
    
    // Don't close the dialog if we're testing the connection
    if (!testStatus.message) {
      setOpen(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      setTestStatus({ message: "Testing connection..." });
      
      // Configure first
      aiAssistantService.configure({
        apiUrl,
        apiKey,
        model
      });
      
      // Test with a simple message
      await aiAssistantService.sendMessage("Hello");
      
      // If successful
      setTestStatus({ success: true, message: "Connection successful!" });
      
      // Clear success message after 3 seconds
      setTimeout(() => setTestStatus({}), 3000);
    } catch (error) {
      setTestStatus({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to connect to AI backend"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute top-3 right-3">
          <Settings className="h-4 w-4 text-gray-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>AI Assistant Configuration</DialogTitle>
          <DialogDescription>
            Configure the connection to your Python backend LLM service.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="apiUrl" className="text-right text-sm font-medium">
              API URL
            </label>
            <Input
              id="apiUrl"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="http://localhost:5000/api/ai-assistant"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="apiKey" className="text-right text-sm font-medium">
              API Key
            </label>
            <Input
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              type="password"
              placeholder="Optional"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="model" className="text-right text-sm font-medium">
              Model
            </label>
            <Input
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="default"
              className="col-span-3"
            />
          </div>
          
          {testStatus.message && (
            <Alert variant={testStatus.success ? "default" : "destructive"} className="mt-2">
              <AlertDescription>{testStatus.message}</AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleTestConnection}>
            Test Connection
          </Button>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
