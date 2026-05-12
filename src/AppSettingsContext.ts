import { createContext, useContext } from 'react';

export type DefaultDisableVariant = 1 | 2 | 3;

interface AppSettings {
  limitGroupSponsors: boolean;
  prefilterSponsors: boolean;
  isDark: boolean;
  showDefaultDisableUx: boolean;
  defaultDisableVariant: DefaultDisableVariant;
}

export const AppSettingsContext = createContext<AppSettings>({
  limitGroupSponsors: false,
  prefilterSponsors: false,
  isDark: false,
  showDefaultDisableUx: false,
  defaultDisableVariant: 1,
});

export function useAppSettings() {
  return useContext(AppSettingsContext);
}
