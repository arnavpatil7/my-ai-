import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.8f4a117a96ba4722814a112ef9895320',
  appName: 'my-ai-chorus',
  webDir: 'dist',
  server: {
    url: 'https://8f4a117a-96ba-4722-814a-112ef9895320.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;