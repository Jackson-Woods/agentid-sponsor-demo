import { createContext, useContext } from 'react';

export type ExperienceTier = 'free' | 'premium';

interface AppSettings {
  limitGroupSponsors: boolean;
  prefilterSponsors: boolean;
  isDark: boolean;
  showDefaultDisableUx: boolean;
  experienceTier: ExperienceTier;
}

export const AppSettingsContext = createContext<AppSettings>({
  limitGroupSponsors: false,
  prefilterSponsors: false,
  isDark: false,
  showDefaultDisableUx: false,
  experienceTier: 'premium',
});

export function useAppSettings() {
  return useContext(AppSettingsContext);
}
