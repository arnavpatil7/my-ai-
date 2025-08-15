import React from 'react';
import { cn } from '@/lib/utils';

interface VoiceWaveformProps {
  isActive: boolean;
  className?: string;
}

export const VoiceWaveform: React.FC<VoiceWaveformProps> = ({ isActive, className }) => {
  return (
    <div className={cn("flex items-center justify-center gap-1", className)}>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-1 bg-gradient-to-t from-primary to-primary-glow rounded-full transition-all duration-300",
            isActive ? "voice-wave" : "h-2",
            {
              "h-8": isActive && i === 2,
              "h-6": isActive && (i === 1 || i === 3),
              "h-4": isActive && (i === 0 || i === 4),
            }
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
};