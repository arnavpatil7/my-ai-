import React, { useState, useEffect } from 'react';
import { NameSetup } from '@/components/NameSetup';
import { VoiceInterface } from '@/components/VoiceInterface';

const Index = () => {
  const [assistantName, setAssistantName] = useState<string | null>(null);

  useEffect(() => {
    // Check if assistant name is already stored
    const storedName = localStorage.getItem('assistantName');
    if (storedName) {
      setAssistantName(storedName);
    }
  }, []);

  const handleNameSet = (name: string) => {
    localStorage.setItem('assistantName', name);
    setAssistantName(name);
  };

  if (!assistantName) {
    return <NameSetup onNameSet={handleNameSet} />;
  }

  return <VoiceInterface assistantName={assistantName} />;
};

export default Index;
