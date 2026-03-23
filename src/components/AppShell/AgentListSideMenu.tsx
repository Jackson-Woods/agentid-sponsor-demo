import { useLocation, useNavigate } from 'react-router-dom';
import { makeStyles, tokens, Text, Input } from '@fluentui/react-components';
import {
  SearchRegular,
  InfoRegular,
  ContactCardRegular,
  BoxRegular,
  AppsRegular,
  DoorArrowLeftRegular,
} from '@fluentui/react-icons';

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

  const isOverview = location.pathname === '/';
  const isAgentList = location.pathname === '/agents';

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
      <button
        className={`${styles.menuItem} ${isAgentList ? styles.active : ''}`}
        onClick={() => navigate('/agents')}
      >
        <ContactCardRegular className={styles.menuIcon} fontSize={16} />
        All agent identities
      </button>
      <button className={`${styles.menuItem}`}>
        <BoxRegular className={styles.menuIcon} fontSize={16} />
        Agent registry
      </button>
      <button className={`${styles.menuItem}`}>
        <AppsRegular className={styles.menuIcon} fontSize={16} />
        Agent collections
      </button>

      <Text className={styles.groupTitle}>Activity</Text>
      <button className={`${styles.menuItem}`}>
        <DoorArrowLeftRegular className={styles.menuIcon} fontSize={16} />
        Sign-in logs
      </button>
    </nav>
  );
}
