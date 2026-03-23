import { useState, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
} from '@fluentui/react-components';
import { AppShell } from './components/AppShell/AppShell';
import { AgentIdOverviewPage } from './pages/AgentIdOverview/AgentIdOverviewPage';
import { AgentListPage } from './pages/AgentList/AgentListPage';
import { AgentOverviewPage } from './pages/AgentOverview/AgentOverviewPage';
import { OwnersAndSponsorsPage } from './pages/OwnersAndSponsors/OwnersAndSponsorsPage';
import { AppSettingsContext } from './AppSettingsContext';

export function App() {
  const [isDark, setIsDark] = useState(false);
  const [limitGroupSponsors, setLimitGroupSponsors] = useState(false);

  const settingsValue = useMemo(() => ({ limitGroupSponsors, isDark }), [limitGroupSponsors, isDark]);

  return (
    <FluentProvider theme={isDark ? webDarkTheme : webLightTheme} style={{ height: '100%' }}>
      <AppSettingsContext.Provider value={settingsValue}>
        <HashRouter>
          <AppShell
            isDark={isDark}
            onToggleTheme={() => setIsDark((d) => !d)}
            limitGroupSponsors={limitGroupSponsors}
            onToggleLimitGroupSponsors={() => setLimitGroupSponsors((v) => !v)}
          >
            <Routes>
              <Route path="/" element={<AgentIdOverviewPage />} />
              <Route path="/agents" element={<AgentListPage />} />
              <Route path="/agent/:objectId" element={<AgentOverviewPage />} />
              <Route
                path="/agent/:objectId/owners-sponsors"
                element={<OwnersAndSponsorsPage />}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppShell>
        </HashRouter>
      </AppSettingsContext.Provider>
    </FluentProvider>
  );
}
