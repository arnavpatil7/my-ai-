import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Monitor, 
  MessageSquare, 
  Clock, 
  Camera,
  Navigation,
  Zap,
  CheckCircle
} from 'lucide-react';

interface AdvancedFeaturesProps {
  assistantName: string;
}

export const AdvancedFeatures: React.FC<AdvancedFeaturesProps> = ({ assistantName }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const featureCategories = [
    {
      id: 'device',
      icon: Smartphone,
      title: 'Device Control',
      badge: 'Native Required',
      features: [
        'Take screenshots',
        'Open any app by name',
        'Control system volume',
        'Adjust screen brightness',
        'Manage Wi-Fi settings'
      ],
      examples: [
        '"Take a screenshot"',
        '"Open camera app"',
        '"Volume up"',
        '"Turn Wi-Fi off"'
      ]
    },
    {
      id: 'communication',
      icon: MessageSquare,
      title: 'Communication',
      badge: 'Contacts Access',
      features: [
        'Make phone calls',
        'Send text messages',
        'Voice-to-text messaging',
        'Contact management'
      ],
      examples: [
        '"Call John"',
        '"Text mom saying I\'ll be late"',
        '"Send SMS to Sarah"'
      ]
    },
    {
      id: 'productivity',
      icon: Clock,
      title: 'Task Management',
      badge: 'Notifications',
      features: [
        'Set reminders',
        'Create timers and alarms',
        'Take voice notes',
        'Schedule notifications'
      ],
      examples: [
        '"Remind me to call back in 30 minutes"',
        '"Set timer for 10 minutes"',
        '"Create note about meeting"'
      ]
    },
    {
      id: 'navigation',
      icon: Navigation,
      title: 'Navigation & Maps',
      badge: 'Location Access',
      features: [
        'Get directions',
        'Find nearby places',
        'Navigate to locations',
        'Traffic information'
      ],
      examples: [
        '"Navigate to the airport"',
        '"Directions to nearest gas station"'
      ]
    }
  ];

  return (
    <Card className="p-6 bg-card/80 backdrop-blur-sm border border-border/50">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold gradient-text mb-2">
          {assistantName} Advanced Capabilities
        </h2>
        <p className="text-sm text-muted-foreground">
          Full functionality available when deployed as native app
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {featureCategories.map((category) => {
          const Icon = category.icon;
          const isExpanded = expandedSection === category.id;
          
          return (
            <div
              key={category.id}
              className="border border-border/30 rounded-lg p-4 bg-secondary/20 hover:bg-secondary/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-primary" />
                  <h3 className="font-medium">{category.title}</h3>
                </div>
                <Badge variant="outline" className="text-xs">
                  {category.badge}
                </Badge>
              </div>

              <div className="space-y-2 mb-3">
                {category.features.slice(0, isExpanded ? undefined : 2).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-3 h-3 text-primary" />
                    {feature}
                  </div>
                ))}
                {!isExpanded && category.features.length > 2 && (
                  <div className="text-xs text-muted-foreground">
                    +{category.features.length - 2} more features
                  </div>
                )}
              </div>

              {isExpanded && (
                <div className="space-y-2 mb-3">
                  <h4 className="text-sm font-medium text-primary">Example Commands:</h4>
                  {category.examples.map((example, index) => (
                    <div key={index} className="text-xs bg-secondary/50 p-2 rounded border-l-2 border-primary/30">
                      {example}
                    </div>
                  ))}
                </div>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandedSection(isExpanded ? null : category.id)}
                className="w-full text-xs"
              >
                {isExpanded ? 'Show Less' : 'Show More'}
              </Button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-primary" />
          <h3 className="font-medium text-sm">Deployment Note</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Advanced features require native app deployment with proper system permissions. 
          Current web version provides command recognition and feedback.
        </p>
      </div>
    </Card>
  );
};