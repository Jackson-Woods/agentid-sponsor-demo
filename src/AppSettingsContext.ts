import { createContext, useContext } from 'react';

interface AppSettings {
  limitGroupSponsors: boolean;
  prefilterSponsors: boolean;
  isDark: boolean;
}

export const AppSettingsContext = createContext<AppSettings>({
  limitGroupSponsors: false,
  prefilterSponsors: false,
  isDark: false,
});

export function useAppSettings() {
  return useContext(AppSettingsContext);
}
