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
  Monitor
} from 'lucide-react';

interface QuickControlsProps {
  onCommand: (command: string) => void;
}

export const QuickControls: React.FC<QuickControlsProps> = ({ onCommand }) => {
  const controls = [
    { icon: Volume2, label: 'Volume Up', command: 'volume up' },
    { icon: VolumeX, label: 'Mute', command: 'mute' },
    { icon: Play, label: 'Play/Pause', command: 'play pause' },
    { icon: SkipForward, label: 'Next Track', command: 'next track' },
    { icon: Sun, label: 'Brightness Up', command: 'brightness up' },
    { icon: Moon, label: 'Brightness Down', command: 'brightness down' },
    { icon: Wifi, label: 'Wi-Fi Toggle', command: 'turn wifi on' },
    { icon: Lock, label: 'Lock System', command: 'lock' },
    { icon: Monitor, label: 'System Status', command: 'system status' },
    { icon: Power, label: 'Sleep', command: 'sleep' },
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