
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
import { AIAssistantConfig } from "@/types/aiAssistant";
import { aiAssistantService } from "@/services/aiAssistantService";

interface AIAssistantConfigProps {
  onConfigChanged?: (config: AIAssistantConfig) => void;
}

export function AIAssistantConfig({ onConfigChanged }: AIAssistantConfigProps) {
  const currentConfig = aiAssistantService.getConfig();
  const [apiUrl, setApiUrl] = useState(currentConfig.apiUrl || "");
  const [apiKey, setApiKey] = useState(currentConfig.apiKey || "");
  const [model, setModel] = useState(currentConfig.model || "default");
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    const newConfig = aiAssistantService.configure({
      apiUrl,
      apiKey,
      model
    });
    
    if (onConfigChanged) {
      onConfigChanged(newConfig);
    }
    
    setOpen(false);
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
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
