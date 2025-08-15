import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack,
  Sun,
  Moon,
  Wifi,
  WifiOff,
  Power,
  RotateCcw,
  Lock,
  Monitor,
  Camera,
  Phone,
  MessageSquare,
  Clock,
  Navigation
} from 'lucide-react';

interface QuickControlsProps {
  onCommand: (command: string) => void;
}

export const QuickControls: React.FC<QuickControlsProps> = ({ onCommand }) => {
  const controls = [
    { icon: Camera, label: 'Screenshot', command: 'take screenshot' },
    { icon: Phone, label: 'Call Contact', command: 'call mom' },
    { icon: MessageSquare, label: 'Send Text', command: 'text dad saying hello' },
    { icon: Clock, label: 'Set Reminder', command: 'remind me to call back in 1 hour' },
    { icon: Volume2, label: 'Volume Up', command: 'volume up' },
    { icon: VolumeX, label: 'Mute', command: 'mute' },
    { icon: Sun, label: 'Brightness Up', command: 'brightness up' },
    { icon: Navigation, label: 'Navigate', command: 'navigate to home' },
    { icon: Monitor, label: 'System Status', command: 'system status' },
    { icon: Lock, label: 'Lock System', command: 'lock' },
  ];

  return (
    <Card className="p-4 bg-secondary/30 border border-border/30">
      <h3 className="text-sm font-medium text-muted-foreground mb-3 text-center">Quick Controls</h3>
      <div className="grid grid-cols-5 gap-2">
        {controls.map((control, index) => {
          const Icon = control.icon;
          return (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className="h-12 w-12 p-0 hover:bg-primary/20 hover:text-primary transition-colors"
              onClick={() => onCommand(control.command)}
              title={control.label}
            >
              <Icon className="w-5 h-5" />
            </Button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground text-center mt-2">
        Tap icons for quick commands or use voice
      </p>
    </Card>
  );
};