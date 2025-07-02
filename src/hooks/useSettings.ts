import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

// For now, we'll use localStorage. In a real app, this would be stored in a database
interface Settings {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  workingHours: {
    start: string;
    end: string;
    lunch: string;
  };
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  booking: {
    advanceTime: string;
    cancelTime: string;
    autoConfirm: boolean;
  };
}

const defaultSettings: Settings = {
  companyName: "BeautyBook",
  companyEmail: "contato@beautybook.com",
  companyPhone: "(11) 99999-9999",
  companyAddress: "Rua das Flores, 123 - São Paulo, SP",
  workingHours: {
    start: "09:00",
    end: "18:00",
    lunch: "12:00-14:00"
  },
  notifications: {
    email: true,
    sms: false,
    push: true
  },
  booking: {
    advanceTime: "15",
    cancelTime: "24",
    autoConfirm: false
  }
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadSettings = () => {
    if (!user) return;
    
    try {
      const savedSettings = localStorage.getItem(`settings_${user.id}`);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, [user]);

  const saveSettings = async (newSettings: Settings) => {
    if (!user) return false;

    try {
      localStorage.setItem(`settings_${user.id}`, JSON.stringify(newSettings));
      setSettings(newSettings);
      
      toast({
        title: "Configurações salvas!",
        description: "Todas as alterações foram aplicadas ao sistema.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao salvar configurações",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const updateSettings = (updates: Partial<Settings>) => {
    const newSettings = { ...settings, ...updates } as Settings;
    setSettings(newSettings);
  };

  const updateNestedSettings = (section: keyof Settings, field: string, value: any) => {
    const currentSection = settings[section];
    if (typeof currentSection === 'object' && currentSection !== null) {
      const newSettings = {
        ...settings,
        [section]: {
          ...currentSection,
          [field]: value
        }
      };
      setSettings(newSettings);
    }
  };

  return {
    settings,
    loading,
    saveSettings,
    updateSettings,
    updateNestedSettings,
    refetch: loadSettings
  };
}