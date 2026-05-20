import { createContext, useContext } from 'react';

export type DefaultDisableVariant = 1 | 2 | 3;
export type ExperienceTier = 'free' | 'premium';

interface AppSettings {
  limitGroupSponsors: boolean;
  prefilterSponsors: boolean;
  isDark: boolean;
  showDefaultDisableUx: boolean;
  defaultDisableVariant: DefaultDisableVariant;
  experienceTier: ExperienceTier;
}

export const AppSettingsContext = createContext<AppSettings>({
  limitGroupSponsors: false,
  prefilterSponsors: false,
  isDark: false,
  showDefaultDisableUx: false,
  defaultDisableVariant: 1,
  experienceTier: 'premium',
});

export function useAppSettings() {
  return useContext(AppSettingsContext);
}
