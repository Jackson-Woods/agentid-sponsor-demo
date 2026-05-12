import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { makeStyles, tokens } from '@fluentui/react-components';
import { TopNav } from './TopNav';
import { SideMenu } from './SideMenu';
import { AgentListSideMenu } from './AgentListSideMenu';
import { GroupsSideMenu } from './GroupsSideMenu';
import { GroupDetailSideMenu } from './GroupDetailSideMenu';
import { UsersSideMenu } from './UsersSideMenu';
import { LifecycleWorkflowsSideMenu } from './LifecycleWorkflowsSideMenu';
import { FrameSideNav } from './FrameSideNav';
import type { DefaultDisableVariant } from '../../AppSettingsContext';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  body: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '20px 24px',
    backgroundColor: tokens.colorNeutralBackground1,
  },
});

interface AppShellProps {
  children: ReactNode;
  isDark: boolean;
  onToggleTheme: () => void;
  limitGroupSponsors: boolean;
  onToggleLimitGroupSponsors: () => void;
  prefilterSponsors: boolean;
  onTogglePrefilterSponsors: () => void;
  showDefaultDisableUx: boolean;
  onToggleShowDefaultDisableUx: () => void;
  defaultDisableVariant: DefaultDisableVariant;
  onChangeDefaultDisableVariant: (v: DefaultDisableVariant) => void;
}

export function AppShell({
  children,
  isDark,
  onToggleTheme,
  limitGroupSponsors,
  onToggleLimitGroupSponsors,
  prefilterSponsors,
  onTogglePrefilterSponsors,
  showDefaultDisableUx,
  onToggleShowDefaultDisableUx,
  defaultDisableVariant,
  onChangeDefaultDisableVariant,
}: AppShellProps) {
  const styles = useStyles();
  const location = useLocation();

  // Show side menu only when viewing a specific agent
  const agentMatch = location.pathname.match(/^\/agent\/([^/]+)/);
  const agentId = agentMatch?.[1];
  const isAgentList = location.pathname === '/' || location.pathname === '/agents';
  const isGroupsListPage = location.pathname === '/groups' || location.pathname === '/groups/all' || location.pathname === '/groups/new';
  const groupDetailMatch = location.pathname.match(/^\/groups\/(?!all$|new$)([^/]+)/);
  const isGroupDetail = !!groupDetailMatch;
  const isUsersPage = location.pathname === '/users';
  const isLifecycleWorkflows = location.pathname.startsWith('/lifecycle-workflows');

  return (
    <div className={styles.root}>
      <TopNav
        isDark={isDark}
        onToggleTheme={onToggleTheme}
        limitGroupSponsors={limitGroupSponsors}
        onToggleLimitGroupSponsors={onToggleLimitGroupSponsors}
        prefilterSponsors={prefilterSponsors}
        onTogglePrefilterSponsors={onTogglePrefilterSponsors}
        showDefaultDisableUx={showDefaultDisableUx}
        onToggleShowDefaultDisableUx={onToggleShowDefaultDisableUx}
        defaultDisableVariant={defaultDisableVariant}
        onChangeDefaultDisableVariant={onChangeDefaultDisableVariant}
      />
      <div className={styles.body}>
        <FrameSideNav />
        {agentId && <SideMenu agentId={agentId} />}
        {isAgentList && <AgentListSideMenu />}
        {isGroupsListPage && <GroupsSideMenu />}
        {isGroupDetail && <GroupDetailSideMenu groupId={groupDetailMatch[1]} />}
        {isUsersPage && <UsersSideMenu />}
        {isLifecycleWorkflows && <LifecycleWorkflowsSideMenu />}
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
