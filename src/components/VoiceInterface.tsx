import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { VoiceWaveform } from './VoiceWaveform';
import { Mic, MicOff, Volume2, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import aiAvatar from '@/assets/ai-avatar.png';

interface VoiceInterfaceProps {
  assistantName: string;
}

export const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ assistantName }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const { toast } = useToast();
  const recognition = useRef<any>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionConstructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognition.current = new SpeechRecognitionConstructor();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = 'en-US';

      recognition.current.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };

      recognition.current.onerror = (event) => {
        setIsListening(false);
        toast({
          title: "Speech Recognition Error",
          description: "Could not access microphone. Please check permissions.",
          variant: "destructive",
        });
      };
    }

    // Greeting message
    setTimeout(() => {
      speakText(`Hello! I'm ${assistantName}, your AI voice assistant. How can I help you today?`);
    }, 1000);

    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
    };
  }, [assistantName, toast]);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      window.speechSynthesis.speak(utterance);
      setResponse(text);
    }
  };

  const toggleListening = () => {
    if (!recognition.current) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognition.current.stop();
      setIsListening(false);
      
      // Process the transcript
      if (transcript.trim()) {
        processCommand(transcript);
      }
    } else {
      setTranscript('');
      setIsListening(true);
      recognition.current.start();
    }
  };

  const processCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    let response = '';

    if (lowerCommand.includes('hello') || lowerCommand.includes('hi')) {
      response = `Hello! I'm ${assistantName}. How can I assist you today?`;
    } else if (lowerCommand.includes('time')) {
      const now = new Date();
      response = `The current time is ${now.toLocaleTimeString()}.`;
    } else if (lowerCommand.includes('date')) {
      const now = new Date();
      response = `Today is ${now.toLocaleDateString()}.`;
    } else if (lowerCommand.includes('name')) {
      response = `My name is ${assistantName}. I'm your AI voice assistant.`;
    } else if (lowerCommand.includes('weather')) {
      response = "I'd love to help with weather information. This feature will be available soon with weather API integration.";
    } else if (lowerCommand.includes('help')) {
      response = `I'm ${assistantName}, your AI assistant. You can ask me about the time, date, weather, or just have a conversation. Try saying hello, asking for the time, or any other question!`;
    } else {
      response = `I heard you say: "${command}". I'm still learning, but I'm here to help! Try asking about the time, date, or say hello.`;
    }

    setTimeout(() => {
      speakText(response);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* AI Avatar */}
        <div className="text-center">
          <div className="relative inline-block">
            <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-primary/30 to-primary-glow/30 blur-xl ${isSpeaking ? 'ai-pulse' : ''}`}></div>
            <img 
              src={aiAvatar} 
              alt={assistantName}
              className={`relative w-32 h-32 rounded-full border-2 border-primary/50 ${isSpeaking ? 'voice-active' : 'float'}`}
            />
          </div>
          <h1 className="text-3xl font-bold mt-4 gradient-text">{assistantName}</h1>
          <p className="text-muted-foreground">Your AI Voice Assistant</p>
        </div>

        {/* Voice Controls */}
        <Card className="p-8 bg-card/80 backdrop-blur-sm border border-border/50">
          <div className="flex flex-col items-center space-y-6">
            {/* Voice Waveform */}
            <VoiceWaveform isActive={isListening || isSpeaking} className="h-16" />
            
            {/* Main Voice Button */}
            <Button
              onClick={toggleListening}
              variant={isListening ? "voice-active" : "voice"}
              size="lg"
              className="w-20 h-20 rounded-full"
            >
              {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </Button>

            {/* Status Text */}
            <div className="text-center space-y-2">
              {isListening && (
                <p className="text-primary font-medium">Listening...</p>
              )}
              {isSpeaking && (
                <p className="text-primary-glow font-medium flex items-center justify-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  Speaking...
                </p>
              )}
              {!isListening && !isSpeaking && (
                <p className="text-muted-foreground">Tap to speak with {assistantName}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Transcript & Response */}
        {(transcript || response) && (
          <Card className="p-6 bg-secondary/50 border border-border/30">
            {transcript && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">You said:</h3>
                <p className="text-foreground">{transcript}</p>
              </div>
            )}
            {response && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">{assistantName} responded:</h3>
                <p className="text-foreground">{response}</p>
              </div>
            )}
          </Card>
        )}

        {/* Quick Actions */}
        <div className="flex justify-center space-x-4">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
};