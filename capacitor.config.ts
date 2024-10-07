import type { CapacitorConfig } from '@capacitor/cli';


const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'PhilSafe',
  webDir: 'www',
  server: {
    url: 'https://192.168.1.5:7108',
    cleartext: true
  }
  
};

export default config;
