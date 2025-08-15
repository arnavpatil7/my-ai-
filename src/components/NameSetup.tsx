import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Bot, Sparkles } from 'lucide-react';

interface NameSetupProps {
  onNameSet: (name: string) => void;
}

export const NameSetup: React.FC<NameSetupProps> = ({ onNameSet }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onNameSet(name.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8 bg-card border border-border/50 ai-glow">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary-glow/20 rounded-full blur-xl"></div>
            <div className="relative bg-gradient-to-br from-primary to-primary-glow rounded-full p-6 w-24 h-24 mx-auto flex items-center justify-center">
              <Bot className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold gradient-text">Welcome</h1>
            <p className="text-muted-foreground">
              I'm your new AI voice assistant. What would you like to call me?
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Enter assistant name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-center text-lg bg-secondary/50 border-primary/30 focus:border-primary"
              autoFocus
            />
            
            <Button 
              type="submit" 
              variant="ai" 
              size="lg" 
              className="w-full"
              disabled={!name.trim()}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Initialize Assistant
            </Button>
          </form>

          <div className="text-xs text-muted-foreground">
            Cross-platform AI voice assistant ready for Android, iOS, Windows & macOS
          </div>
        </div>
      </Card>
    </div>
  );
};