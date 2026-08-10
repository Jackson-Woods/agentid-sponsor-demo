import { useLocation, useNavigate } from 'react-router-dom';
import { makeStyles, tokens, Text, Input } from '@fluentui/react-components';
import {
  SearchRegular,
  InfoRegular,
  AppsRegular,
  SettingsRegular,
  DoorArrowLeftRegular,
} from '@fluentui/react-icons';
import { AgentCardIcon } from '../shared/SvgIcon';
import { useAppSettings } from '../../AppSettingsContext';

const useStyles = makeStyles({
  sidebar: {
    width: '220px',
    flexShrink: 0,
    backgroundColor: tokens.colorNeutralBackground1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
  },
  searchBox: {
    margin: '8px 12px',
  },
  groupTitle: {
    padding: '12px 16px 4px',
    fontSize: '13px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    border: 'none',
    background: 'none',
    color: tokens.colorNeutralForeground1,
    fontSize: '13px',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  menuIcon: {
    color: tokens.colorBrandForeground1,
  },
  active: {
    backgroundColor: tokens.colorNeutralBackground1Selected,
    borderLeft: `3px solid ${tokens.colorBrandForeground1}`,
    fontWeight: 600,
  },
});

export function AgentListSideMenu() {
  const styles = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const { showDefaultDisableUx } = useAppSettings();

  const isOverview = location.pathname === '/';
  const isAgentList = location.pathname === '/agents';
  const isAgentLifecyclePolicy = location.pathname.startsWith('/agents/lifecycle-policy');

  return (
    <nav className={styles.sidebar} aria-label="Agent ID menu">
      <Input
        className={styles.searchBox}
        contentBefore={<SearchRegular />}
        placeholder="Search"
        size="small"
      />

      <button
        className={`${styles.menuItem} ${isOverview ? styles.active : ''}`}
        onClick={() => navigate('/')}
      >
        <InfoRegular className={styles.menuIcon} fontSize={16} />
        Overview
      </button>
      <button className={`${styles.menuItem}`}>
        <AppsRegular className={styles.menuIcon} fontSize={16} />
        Agent blueprints
      </button>
      <button
        className={`${styles.menuItem} ${isAgentList ? styles.active : ''}`}
        onClick={() => navigate('/agents')}
      >
        <AgentCardIcon className={styles.menuIcon} fontSize={16} />
        Agent identities
      </button>

      {showDefaultDisableUx && (
        <>
          <Text className={styles.groupTitle}>Policies</Text>
          <button
            className={`${styles.menuItem} ${isAgentLifecyclePolicy ? styles.active : ''}`}
            onClick={() => navigate('/agents/lifecycle-policy')}
          >
            <SettingsRegular className={styles.menuIcon} fontSize={16} />
            Agent lifecycle (Preview)
          </button>
        </>
      )}

      <Text className={styles.groupTitle}>Activity</Text>
      <button className={`${styles.menuItem}`}>
        <DoorArrowLeftRegular className={styles.menuIcon} fontSize={16} />
        Sign-in logs
      </button>
    </nav>
  );
}
