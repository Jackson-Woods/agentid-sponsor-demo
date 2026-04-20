import { useLocation, useNavigate } from 'react-router-dom';
import { makeStyles, tokens, Text, Input } from '@fluentui/react-components';
import {
  SearchRegular,
  InfoRegular,
  WrenchRegular,
  SlideSettingsRegular,
  PersonRegular,
  ShieldPersonRegular,
  AppsListRegular,
  KeyRegular,
  ShieldPersonAddRegular,
  CheckmarkCircleRegular,
  BookRegular,
  PeopleQueueRegular,
  HeadsetRegular,
} from '@fluentui/react-icons';
import { GroupsIdentityIcon, AdminUnitsIcon } from '../shared/SvgIcon';

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

export function GroupDetailSideMenu({ groupId }: { groupId: string }) {
  const styles = useStyles();
  const location = useLocation();
  const navigate = useNavigate();

  const isOverview = !location.pathname.endsWith('/properties') &&
    !location.pathname.endsWith('/members') &&
    !location.pathname.endsWith('/owners');
  const isProperties = location.pathname.endsWith('/properties');

  return (
    <nav className={styles.sidebar} aria-label="Group detail menu">
      <Input
        className={styles.searchBox}
        contentBefore={<SearchRegular />}
        placeholder="Search"
        size="small"
      />

      <button
        className={`${styles.menuItem} ${isOverview ? styles.active : ''}`}
        onClick={() => navigate(`/groups/${groupId}`)}
      >
        <InfoRegular className={styles.menuIcon} fontSize={16} />
        Overview
      </button>
      <button className={styles.menuItem}>
        <WrenchRegular className={styles.menuIcon} fontSize={16} />
        Diagnose and solve problems
      </button>

      <Text className={styles.groupTitle}>Manage</Text>
      <button
        className={`${styles.menuItem} ${isProperties ? styles.active : ''}`}
        onClick={() => navigate(`/groups/${groupId}/properties`)}
      >
        <SlideSettingsRegular className={styles.menuIcon} fontSize={16} />
        Properties
      </button>
      <button className={styles.menuItem}>
        <GroupsIdentityIcon className={styles.menuIcon} fontSize={16} />
        Members
      </button>
      <button className={styles.menuItem}>
        <GroupsIdentityIcon className={styles.menuIcon} fontSize={16} />
        Owners
      </button>
      <button className={styles.menuItem}>
        <ShieldPersonRegular className={styles.menuIcon} fontSize={16} />
        Roles and administrators
      </button>
      <button className={styles.menuItem}>
        <AdminUnitsIcon className={styles.menuIcon} fontSize={16} />
        Administrative units
      </button>
      <button className={styles.menuItem}>
        <GroupsIdentityIcon className={styles.menuIcon} fontSize={16} />
        Group memberships
      </button>
      <button className={styles.menuItem}>
        <AppsListRegular className={styles.menuIcon} fontSize={16} />
        Applications
      </button>
      <button className={styles.menuItem}>
        <KeyRegular className={styles.menuIcon} fontSize={16} />
        Azure role assignments
      </button>

      <Text className={styles.groupTitle}>Activity</Text>
      <button className={styles.menuItem}>
        <ShieldPersonAddRegular className={styles.menuIcon} fontSize={16} />
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
