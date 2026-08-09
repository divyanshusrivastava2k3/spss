"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface Settings {
  ngoName: string;
  ngoNameHi?: string;
  logoUrl: string;
  aboutText?: string;
  aboutTextHi?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  addressHi?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  faviconUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
}

interface SettingsContextType {
  settings: Settings;
  refresh: () => void;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: { ngoName: "NGO", logoUrl: "" },
  refresh: () => {},
});

export function SettingsProvider({
  children,
  initialSettings,
}: {
  children: React.ReactNode;
  initialSettings: Settings;
}) {
  const [settings, setSettings] = useState<Settings>(initialSettings);

  const refresh = () => {
    axios.get("/api/settings").then((res) => {
      if (res.data) setSettings(res.data);
    }).catch(() => {});
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, refresh }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
