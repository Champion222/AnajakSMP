import React, { createContext, useContext, useState, useEffect } from 'react';
import { StoreSettings } from '@anajaksmp/shared';
import { api } from '../services/api.js';

interface ServerStatus {
  online: boolean;
  serverIp: string;
  players: { online: number; max: number };
  version: string;
  motd: string;
}

interface SettingsContextType {
  settings: StoreSettings | null;
  serverStatus: ServerStatus | null;
  isLoading: boolean;
  copiedIp: boolean;
  copyServerIp: () => void;
  currency: 'USD' | 'KHR';
  setCurrency: (c: 'USD' | 'KHR') => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedIp, setCopiedIp] = useState(false);
  const [currency, setCurrency] = useState<'USD' | 'KHR'>('USD');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [settingsData, statusData] = await Promise.allSettled([
          api.getSettings(),
          api.getServerStatus(),
        ]);

        if (settingsData.status === 'fulfilled') {
          setSettings(settingsData.value);
        }
        if (statusData.status === 'fulfilled') {
          setServerStatus(statusData.value);
        }
      } catch (err) {
        console.error('Error loading settings/status', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Refresh server status every 60s
    const interval = setInterval(async () => {
      try {
        const status = await api.getServerStatus();
        setServerStatus(status);
      } catch {
        // silent catch
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const copyServerIp = () => {
    const ip = settings?.server_ip || 'play.anajaksmp.xyz';
    navigator.clipboard.writeText(ip);
    setCopiedIp(true);
    setTimeout(() => setCopiedIp(false), 2500);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        serverStatus,
        isLoading,
        copiedIp,
        copyServerIp,
        currency,
        setCurrency,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};
