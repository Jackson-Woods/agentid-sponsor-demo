import { useLocation, useNavigate } from 'react-router-dom';
import { makeStyles, tokens, Text, Input } from '@fluentui/react-components';
import {
  SearchRegular,
  PersonRegular,
  BookRegular,
  ArrowEnterRegular,
  WrenchRegular,
  DeleteRegular,
  PasswordRegular,
  SettingsRegular,
  DataBarVerticalRegular,
  HeadsetRegular,
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

export function UsersSideMenu() {
  const styles = useStyles();
  const location = useLocation();
  const navigate = useNavigate();

  const isAllUsers = location.pathname === '/users';

  return (
    <nav className={styles.sidebar} aria-label="Users menu">
      <Input
        className={styles.searchBox}
        contentBefore={<SearchRegular />}
        placeholder="Search"
        size="small"
      />

      <button
        className={`${styles.menuItem} ${isAllUsers ? styles.active : ''}`}
        onClick={() => navigate('/users')}
      >
        <PersonRegular className={styles.menuIcon} fontSize={16} />
        All users
      </button>
      <button className={styles.menuItem}>
        <BookRegular className={styles.menuIcon} fontSize={16} />
        Audit logs
      </button>
      <button className={styles.menuItem}>
        <ArrowEnterRegular className={styles.menuIcon} fontSize={16} />
        Sign-in logs
      </button>
      <button className={styles.menuItem}>
        <WrenchRegular className={styles.menuIcon} fontSize={16} />
        Diagnose and solve problems
      </button>
      <button className={styles.menuItem}>
        <DeleteRegular className={styles.menuIcon} fontSize={16} />
        Deleted users
      </button>
      <button className={styles.menuItem}>
        <PasswordRegular className={styles.menuIcon} fontSize={16} />
        Password reset
      </button>
      <button className={styles.menuItem}>
        <SettingsRegular className={styles.menuIcon} fontSize={16} />
        User settings
      </button>
      <button className={styles.menuItem}>
        <DataBarVerticalRegular className={styles.menuIcon} fontSize={16} />
        Bulk operation results
      </button>
      <button className={styles.menuItem}>
        <DataBarVerticalRegular className={styles.menuIcon} fontSize={16} />
        Bulk operation results (Preview)
      </button>
      <button className={styles.menuItem}>
        <HeadsetRegular className={styles.menuIcon} fontSize={16} />
        New support request
      </button>
    </nav>
  );
}
