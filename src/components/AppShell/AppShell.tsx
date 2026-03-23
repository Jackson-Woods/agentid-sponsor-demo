import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { makeStyles, tokens } from '@fluentui/react-components';
import { TopNav } from './TopNav';
import { SideMenu } from './SideMenu';
import { AgentListSideMenu } from './AgentListSideMenu';

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
}

export function AppShell({ children, isDark, onToggleTheme, limitGroupSponsors, onToggleLimitGroupSponsors }: AppShellProps) {
  const styles = useStyles();
  const location = useLocation();

  // Show side menu only when viewing a specific agent
  const agentMatch = location.pathname.match(/^\/agent\/([^/]+)/);
  const agentId = agentMatch?.[1];
  const isAgentList = location.pathname === '/' || location.pathname === '/agents';

  return (
    <div className={styles.root}>
      <TopNav
        isDark={isDark}
        onToggleTheme={onToggleTheme}
        limitGroupSponsors={limitGroupSponsors}
        onToggleLimitGroupSponsors={onToggleLimitGroupSponsors}
      />
      <div className={styles.body}>
        {agentId && <SideMenu agentId={agentId} />}
        {isAgentList && <AgentListSideMenu />}
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
