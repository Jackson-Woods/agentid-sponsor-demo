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
import { HomePage } from './pages/Home/HomePage';
import { UsersPage } from './pages/Users/UsersPage';
import { GroupsPage } from './pages/Groups/GroupsPage';
import { AllGroupsPage } from './pages/Groups/AllGroupsPage';
import { NewGroupPage } from './pages/Groups/NewGroupPage';
import { GroupDetailPage } from './pages/Groups/GroupDetailPage';
import { GroupPropertiesPage } from './pages/Groups/GroupPropertiesPage';
import { EntitlementManagementPage } from './pages/EntitlementManagement/EntitlementManagementPage';
import { PIMPage } from './pages/PrivilegedIdentityManagement/PIMPage';
import { LifecycleWorkflowsPage } from './pages/LifecycleWorkflows/LifecycleWorkflowsPage';
import { EnterpriseAppsPage } from './pages/EnterpriseApps/EnterpriseAppsPage';
import { AppRegistrationsPage } from './pages/AppRegistrations/AppRegistrationsPage';
import { AppSettingsContext } from './AppSettingsContext';

export function App() {
  const [isDark, setIsDark] = useState(false);
  const [limitGroupSponsors, setLimitGroupSponsors] = useState(false);
  const [prefilterSponsors, setPrefilterSponsors] = useState(false);

  const settingsValue = useMemo(() => ({ limitGroupSponsors, prefilterSponsors, isDark }), [limitGroupSponsors, prefilterSponsors, isDark]);

  return (
    <FluentProvider theme={isDark ? webDarkTheme : webLightTheme} style={{ height: '100%' }}>
      <AppSettingsContext.Provider value={settingsValue}>
        <HashRouter>
          <AppShell
            isDark={isDark}
            onToggleTheme={() => setIsDark((d) => !d)}
            limitGroupSponsors={limitGroupSponsors}
            onToggleLimitGroupSponsors={() => setLimitGroupSponsors((v) => {
              const next = !v;
              if (!next) setPrefilterSponsors(false);
              return next;
            })}
            prefilterSponsors={prefilterSponsors}
            onTogglePrefilterSponsors={() => setPrefilterSponsors((v) => !v)}
          >
            <Routes>
              <Route path="/" element={<AgentIdOverviewPage />} />
              <Route path="/agents" element={<AgentListPage />} />
              <Route path="/agent/:objectId" element={<AgentOverviewPage />} />
              <Route
                path="/agent/:objectId/owners-sponsors"
                element={<OwnersAndSponsorsPage />}
              />
              <Route path="/home" element={<HomePage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/groups" element={<GroupsPage />} />
              <Route path="/groups/all" element={<AllGroupsPage />} />
              <Route path="/groups/new" element={<NewGroupPage />} />
              <Route path="/groups/:groupId" element={<GroupDetailPage />} />
              <Route path="/groups/:groupId/properties" element={<GroupPropertiesPage />} />
              <Route path="/entitlement-management" element={<EntitlementManagementPage />} />
              <Route path="/pim" element={<PIMPage />} />
              <Route path="/lifecycle-workflows" element={<LifecycleWorkflowsPage />} />
              <Route path="/enterprise-apps" element={<EnterpriseAppsPage />} />
              <Route path="/app-registrations" element={<AppRegistrationsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppShell>
        </HashRouter>
      </AppSettingsContext.Provider>
    </FluentProvider>
  );
}
