import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { VoiceWaveform } from './VoiceWaveform';
import { QuickControls } from './QuickControls';
import { AdvancedFeatures } from './AdvancedFeatures';
import { Mic, MicOff, Volume2, Settings, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [showAdvanced, setShowAdvanced] = useState(false);
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

    // Greeting commands
    if (lowerCommand.includes('hello') || lowerCommand.includes('hi')) {
      response = `Hello! I'm ${assistantName}. How can I assist you today?`;
    }
    
    // Time and date commands
    else if (lowerCommand.includes('time')) {
      const now = new Date();
      response = `The current time is ${now.toLocaleTimeString()}.`;
    } 
    else if (lowerCommand.includes('date')) {
      const now = new Date();
      response = `Today is ${now.toLocaleDateString()}.`;
    }
    
    // Screenshot commands
    else if (lowerCommand.includes('take screenshot') || lowerCommand.includes('screenshot') || lowerCommand.includes('capture screen')) {
      response = "Taking a screenshot now. Note: This requires native system permissions for full functionality.";
      // In native app, would use platform-specific screenshot APIs
    }
    
    // App launching commands
    else if (lowerCommand.includes('open') && (lowerCommand.includes('app') || lowerCommand.includes('application'))) {
      const appMatch = lowerCommand.match(/open\s+([\w\s]+?)(?:\s+app|\s+application|$)/);
      const appName = appMatch ? appMatch[1].trim() : 'the requested app';
      response = `Opening ${appName}. Note: This requires native system access to launch applications.`;
      // In native app, would use platform-specific app launching APIs
    }
    else if (lowerCommand.includes('open calculator')) {
      response = "Opening Calculator app. Note: This requires native system access.";
    }
    else if (lowerCommand.includes('open camera')) {
      response = "Opening Camera app. Note: This requires native system access.";
    }
    else if (lowerCommand.includes('open settings')) {
      response = "Opening Settings app. Note: This requires native system access.";
    }
    else if (lowerCommand.includes('open browser') || lowerCommand.includes('open chrome') || lowerCommand.includes('open safari')) {
      response = "Opening web browser. Note: This requires native system access.";
    }
    
    // Communication commands - Calling
    else if (lowerCommand.includes('call') || lowerCommand.includes('phone')) {
      const contactMatch = lowerCommand.match(/(?:call|phone)\s+([\w\s]+)/);
      const contactName = contactMatch ? contactMatch[1].trim() : 'the contact';
      response = `Initiating call to ${contactName}. Note: This requires phone permissions and contacts access.`;
      // In native app, would use phone dialer APIs
    }
    
    // Communication commands - Texting/SMS
    else if (lowerCommand.includes('text') || lowerCommand.includes('send message') || lowerCommand.includes('send sms')) {
      const textMatch = lowerCommand.match(/(?:text|send message to|send sms to)\s+([\w\s]+?)(?:\s+saying|\s+that|$)/);
      const contactName = textMatch ? textMatch[1].trim() : 'the contact';
      const messageMatch = lowerCommand.match(/(?:saying|that)\s+(.+)/);
      const messageContent = messageMatch ? messageMatch[1] : 'your message';
      response = `Sending text message to ${contactName}: "${messageContent}". Note: This requires SMS permissions and contacts access.`;
      // In native app, would use SMS APIs
    }
    
    // Task instruction commands
    else if (lowerCommand.includes('remind me') || lowerCommand.includes('set reminder')) {
      const taskMatch = lowerCommand.match(/(?:remind me to|set reminder to)\s+(.+?)(?:\s+in|\s+at|$)/);
      const timeMatch = lowerCommand.match(/(?:in|at)\s+([\w\s]+)/);
      const task = taskMatch ? taskMatch[1].trim() : 'complete the task';
      const time = timeMatch ? timeMatch[1].trim() : '5 minutes';
      response = `Setting reminder: "${task}" in ${time}. Note: This requires notification permissions for full functionality.`;
      // In native app, would use local notifications
    }
    else if (lowerCommand.includes('create note') || lowerCommand.includes('take note')) {
      const noteMatch = lowerCommand.match(/(?:create note|take note)(?:\s+about|\s+that)?\s+(.+)/);
      const noteContent = noteMatch ? noteMatch[1].trim() : 'your note';
      response = `Creating note: "${noteContent}". Note: This requires file system access for persistent storage.`;
      // In native app, would save to local storage or notes app
    }
    else if (lowerCommand.includes('set timer') || lowerCommand.includes('start timer')) {
      const timerMatch = lowerCommand.match(/(?:set timer|start timer)(?:\s+for)?\s+(\d+)\s*(minute|minutes|second|seconds|hour|hours)/);
      const duration = timerMatch ? `${timerMatch[1]} ${timerMatch[2]}` : '5 minutes';
      response = `Setting timer for ${duration}. Note: This requires background processing permissions.`;
      // In native app, would use timer APIs
    }
    else if (lowerCommand.includes('set alarm')) {
      const alarmMatch = lowerCommand.match(/set alarm(?:\s+for)?\s+([\d:]+(?:\s*[ap]m)?)/);
      const alarmTime = alarmMatch ? alarmMatch[1] : 'the specified time';
      response = `Setting alarm for ${alarmTime}. Note: This requires alarm/notification permissions.`;
      // In native app, would use alarm clock APIs
    }
    
    // Navigation and directions
    else if (lowerCommand.includes('navigate to') || lowerCommand.includes('directions to') || lowerCommand.includes('go to')) {
      const locationMatch = lowerCommand.match(/(?:navigate to|directions to|go to)\s+(.+)/);
      const location = locationMatch ? locationMatch[1].trim() : 'the destination';
      response = `Getting directions to ${location}. Note: This requires location permissions and maps integration.`;
      // In native app, would open maps with directions
    }
    
    // Media & Volume Controls
    else if (lowerCommand.includes('volume up')) {
      response = "Increasing system volume. Note: This requires native system access for full functionality.";
    }
    else if (lowerCommand.includes('volume down')) {
      response = "Decreasing system volume. Note: This requires native system access for full functionality.";
    }
    else if (lowerCommand.includes('mute')) {
      response = "Muting system audio. Note: This requires native system access for full functionality.";
    }
    else if (lowerCommand.includes('play') || lowerCommand.includes('pause')) {
      response = "Controlling media playback. Note: This requires native system access for full functionality.";
    }
    else if (lowerCommand.includes('next') && (lowerCommand.includes('track') || lowerCommand.includes('song'))) {
      response = "Skipping to next track. Note: This requires native system access for full functionality.";
    }
    else if (lowerCommand.includes('previous') && (lowerCommand.includes('track') || lowerCommand.includes('song'))) {
      response = "Going to previous track. Note: This requires native system access for full functionality.";
    }
    
    // Brightness Controls
    else if (lowerCommand.includes('brightness up')) {
      response = "Increasing screen brightness. Note: This requires native system access for full functionality.";
    }
    else if (lowerCommand.includes('brightness down')) {
      response = "Decreasing screen brightness. Note: This requires native system access for full functionality.";
    }
    
    // Wi-Fi Controls
    else if (lowerCommand.includes('wifi on') || lowerCommand.includes('wi-fi on') || lowerCommand.includes('turn wifi on')) {
      response = "Turning Wi-Fi on. Note: This requires native system permissions for full functionality.";
    }
    else if (lowerCommand.includes('wifi off') || lowerCommand.includes('wi-fi off') || lowerCommand.includes('turn wifi off')) {
      response = "Turning Wi-Fi off. Note: This requires native system permissions for full functionality.";
    }
    
    // Power Controls
    else if (lowerCommand.includes('shutdown') || lowerCommand.includes('shut down')) {
      response = "System shutdown command received. Note: This requires native system permissions to execute.";
    }
    else if (lowerCommand.includes('restart') || lowerCommand.includes('reboot')) {
      response = "System restart command received. Note: This requires native system permissions to execute.";
    }
    else if (lowerCommand.includes('sleep')) {
      response = "Putting system to sleep. Note: This requires native system permissions for full functionality.";
    }
    else if (lowerCommand.includes('lock')) {
      response = "Locking the system. Note: This requires native system permissions for full functionality.";
    }
    
    // System Status
    else if (lowerCommand.includes('how is my pc') || lowerCommand.includes('system status') || lowerCommand.includes('performance')) {
      const memoryInfo = (navigator as any).deviceMemory || 'unknown';
      const connectionType = (navigator as any).connection?.effectiveType || 'unknown';
      response = `System status: Device memory: ${memoryInfo}GB, Connection: ${connectionType}. For detailed system monitoring, native app access is required.`;
    }
    
    // Assistant info
    else if (lowerCommand.includes('name')) {
      response = `My name is ${assistantName}. I'm your AI voice assistant.`;
    }
    else if (lowerCommand.includes('weather')) {
      response = "I'd love to help with weather information. This feature will be available soon with weather API integration.";
    }
    else if (lowerCommand.includes('help') || lowerCommand.includes('what can you do')) {
      response = `I'm ${assistantName}, your comprehensive AI assistant. I can help with:
        
        📱 Device Control: "Take screenshot", "Open [app name]", "Volume up/down", "Brightness up/down"
        
        📞 Communication: "Call [contact]", "Text [contact] saying [message]"
        
        ⏰ Tasks & Reminders: "Remind me to [task]", "Set timer for [time]", "Set alarm for [time]", "Create note about [topic]"
        
        🗺️ Navigation: "Navigate to [location]", "Directions to [place]"
        
        🖥️ System: "Wi-Fi on/off", "Lock", "Sleep", "Shutdown", "System status"
        
        📅 Info: "What time is it?", "What's the date?"
        
        Note: Advanced features require native app deployment with proper permissions.`;
    }
    
    // Default response
    else {
      response = `I heard you say: "${command}". Try commands like "take screenshot", "open camera", "call mom", "text dad saying hello", "remind me to buy groceries", or say "help" for full capabilities!`;
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

        {/* Advanced Features Toggle */}
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-muted-foreground gap-2"
          >
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showAdvanced ? 'Hide Advanced Features' : 'Show Advanced Features'}
          </Button>
        </div>

        {/* Advanced Features Panel */}
        {showAdvanced && <AdvancedFeatures assistantName={assistantName} />}

        {/* Quick Controls */}
        <QuickControls onCommand={processCommand} />

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
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground"
            onClick={() => processCommand('help')}
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            Help
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
};