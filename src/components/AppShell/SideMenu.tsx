import { useLocation, useNavigate } from 'react-router-dom';
import { makeStyles, tokens, Text, Input } from '@fluentui/react-components';
import {
  InfoRegular,
  BuildingRegular,
  BookRegular,
  DoorArrowLeftRegular,
  SearchRegular,
} from '@fluentui/react-icons';
import { GroupsIdentityIcon, VirtualNetworkGatewaysIcon } from '../shared/SvgIcon';

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
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    color: tokens.colorNeutralForeground1,
    fontSize: '13px',
    width: '100%',
    textAlign: 'left',
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

interface SideMenuProps {
  agentId: string;
}

export function SideMenu({ agentId }: SideMenuProps) {
  const styles = useStyles();
  const location = useLocation();
  const navigate = useNavigate();

  const isOverview = location.pathname === `/agent/${agentId}`;
  const isOwners = location.pathname === `/agent/${agentId}/owners-sponsors`;

  return (
    <nav className={styles.sidebar} aria-label="Agent menu">
      <Input
        className={styles.searchBox}
        contentBefore={<SearchRegular />}
        placeholder="Search"
        size="small"
      />

      <Text className={styles.groupTitle}></Text>
      <button
        className={`${styles.menuItem} ${isOverview ? styles.active : ''}`}
        onClick={() => navigate(`/agent/${agentId}`)}
        aria-current={isOverview ? 'page' : undefined}
      >
        <InfoRegular className={styles.menuIcon} fontSize={16} />
        Overview
      </button>
      <button
        className={`${styles.menuItem}`}
        aria-current={isOverview ? 'page' : undefined}
      >
        <BuildingRegular className={styles.menuIcon} fontSize={16} />
        Custom security attributes
      </button>

      <Text className={styles.groupTitle}>Access</Text>
      <button
        className={`${styles.menuItem} ${isOwners ? styles.active : ''}`}
        onClick={() => navigate(`/agent/${agentId}/owners-sponsors`)}
        aria-current={isOwners ? 'page' : undefined}
      >
        <GroupsIdentityIcon className={styles.menuIcon} fontSize={16} />
        Owners and sponsors
      </button>
      <button
        className={`${styles.menuItem}`}
        aria-current={isOwners ? 'page' : undefined}
      >
        <VirtualNetworkGatewaysIcon className={styles.menuIcon} fontSize={16} />
        Agent identity's access
      </button>

      <Text className={styles.groupTitle}>Activity</Text>
      <button
        className={`${styles.menuItem}`}
        aria-current={isOwners ? 'page' : undefined}
      >
        <BookRegular className={styles.menuIcon} fontSize={16} />
        Audit logs
      </button>
      <button
        className={`${styles.menuItem}`}
        aria-current={isOwners ? 'page' : undefined}
      >
        <DoorArrowLeftRegular className={styles.menuIcon} fontSize={16} />
        Sign-in logs
      </button>
    </nav>
  );
}
