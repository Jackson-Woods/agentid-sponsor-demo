import { createContext, useContext } from 'react';

interface AppSettings {
  limitGroupSponsors: boolean;
  isDark: boolean;
}

export const AppSettingsContext = createContext<AppSettings>({
  limitGroupSponsors: false,
  isDark: false,
});

export function useAppSettings() {
  return useContext(AppSettingsContext);
}
