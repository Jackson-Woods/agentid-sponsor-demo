import { useLocation, useNavigate } from 'react-router-dom';
import { makeStyles, tokens, Text, Input } from '@fluentui/react-components';
import {
  SearchRegular,
  InfoRegular,
  DataBarVerticalRegular,
  DeleteRegular,
  WrenchRegular,
  SettingsRegular,
  ShieldPersonRegular,
  CheckmarkCircleRegular,
  BookRegular,
  PeopleQueueRegular,
  HeadsetRegular,
} from '@fluentui/react-icons';
import { GroupsIdentityIcon } from '../shared/SvgIcon';

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

export function GroupsSideMenu() {
  const styles = useStyles();
  const location = useLocation();
  const navigate = useNavigate();

  const isOverview = location.pathname === '/groups';
  const isAllGroups = location.pathname === '/groups/all';

  return (
    <nav className={styles.sidebar} aria-label="Groups menu">
      <Input
        className={styles.searchBox}
        contentBefore={<SearchRegular />}
        placeholder="Search"
        size="small"
      />

      <button
        className={`${styles.menuItem} ${isOverview ? styles.active : ''}`}
        onClick={() => navigate('/groups')}
      >
        <InfoRegular className={styles.menuIcon} fontSize={16} />
        Overview
      </button>
      <button
        className={`${styles.menuItem} ${isAllGroups ? styles.active : ''}`}
        onClick={() => navigate('/groups/all')}
      >
        <GroupsIdentityIcon className={styles.menuIcon} fontSize={16} />
        All groups
      </button>
      <button className={styles.menuItem}>
        <DataBarVerticalRegular className={styles.menuIcon} fontSize={16} />
        Insights (Preview)
      </button>
      <button className={styles.menuItem}>
        <DeleteRegular className={styles.menuIcon} fontSize={16} />
        Deleted groups
      </button>
      <button className={styles.menuItem}>
        <WrenchRegular className={styles.menuIcon} fontSize={16} />
        Diagnose and solve problems
      </button>

      <Text className={styles.groupTitle}>Settings</Text>
      <button className={styles.menuItem}>
        <SettingsRegular className={styles.menuIcon} fontSize={16} />
        General
      </button>
      <button className={styles.menuItem}>
        <SettingsRegular className={styles.menuIcon} fontSize={16} />
        Expiration
      </button>
      <button className={styles.menuItem}>
        <SettingsRegular className={styles.menuIcon} fontSize={16} />
        Naming policy
      </button>

      <Text className={styles.groupTitle}>Activity</Text>
      <button className={styles.menuItem}>
        <ShieldPersonRegular className={styles.menuIcon} fontSize={16} />
        Privileged Identity Management
      </button>
      <button className={styles.menuItem}>
        <CheckmarkCircleRegular className={styles.menuIcon} fontSize={16} />
        Access reviews
      </button>
      <button className={styles.menuItem}>
        <BookRegular className={styles.menuIcon} fontSize={16} />
        Audit logs
      </button>
      <button className={styles.menuItem}>
        <PeopleQueueRegular className={styles.menuIcon} fontSize={16} />
        Bulk operation results
      </button>

      <Text className={styles.groupTitle}>Troubleshooting + Support</Text>
      <button className={styles.menuItem}>
        <HeadsetRegular className={styles.menuIcon} fontSize={16} />
        New support request
      </button>
    </nav>
  );
}
