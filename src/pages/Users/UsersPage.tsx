import { useState, useEffect, useMemo, useRef } from 'react';
import {
  makeStyles,
  tokens,
  Text,
  Input,
  Link,
  Spinner,
  Checkbox,
  Avatar,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  mergeClasses,
} from '@fluentui/react-components';
import {
  SearchRegular,
  AddRegular,
  EditRegular,
  DeleteRegular,
  ArrowDownloadRegular,
  ArrowSyncRegular,
  SlideSettingsRegular,
  ChatHelpRegular,
  FilterRegular,
  ChevronDownRegular,
  DocumentCopyRegular,
  PersonRegular,
  ShieldPersonRegular,
  OpenRegular,
} from '@fluentui/react-icons';
import { getUsers } from '../../services/dataService';
import { getAvatarColor } from '../../components/shared/avatarUtils';
import type { DummyUser } from '../../models/types';

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  titleIcon: {
    fontSize: '24px',
    color: tokens.colorBrandForeground1,
  },
  title: {
    fontSize: '20px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  subtitle: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground3,
  },
  banner: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: '#e8f4fd',
    borderRadius: '4px',
    fontSize: '13px',
    color: tokens.colorNeutralForeground1,
  },
  bannerIcon: {
    fontSize: '16px',
    color: tokens.colorBrandForeground1,
    flexShrink: 0,
  },
  bannerLink: {
    fontSize: '13px',
  },
  toolbarWrap: {
    position: 'relative',
  },
  commandBar: {
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    paddingBottom: '4px',
  },
  dropdownButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '2px',
  },
  chevronIcon: {
    fontSize: '12px',
  },
  /* New user flyout menu */
  menuOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 999,
  },
  menuPopup: {
    position: 'absolute',
    top: '100%',
    left: '0',
    zIndex: 1000,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: '4px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    minWidth: '280px',
    paddingTop: '4px',
    paddingBottom: '4px',
  },
  menuItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    padding: '10px 16px',
    border: 'none',
    background: 'none',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  menuItemTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  menuItemDesc: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
  },
  searchRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  searchBox: {
    width: '320px',
  },
  filterButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 12px',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: '4px',
    background: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    color: tokens.colorNeutralForeground1,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  count: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground3,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '8px 12px',
    fontSize: '12px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground3,
    borderBottom: `2px solid ${tokens.colorNeutralStroke1}`,
    userSelect: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    ':hover': {
      color: tokens.colorNeutralForeground1,
    },
  },
  thCheckbox: {
    width: '40px',
    padding: '8px 12px',
    borderBottom: `2px solid ${tokens.colorNeutralStroke1}`,
  },
  td: {
    padding: '8px 12px',
    fontSize: '13px',
    color: tokens.colorNeutralForeground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    verticalAlign: 'middle',
    whiteSpace: 'nowrap',
  },
  row: {
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  selectedRow: {
    backgroundColor: tokens.colorNeutralBackground1Selected,
  },
  nameCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  upnCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  copyIcon: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground3,
    cursor: 'pointer',
    flexShrink: 0,
    ':hover': {
      color: tokens.colorNeutralForeground1,
    },
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    padding: '60px',
  },
});

type SortField = 'displayName' | 'userPrincipalName' | 'userType';
type SortDir = 'asc' | 'desc';

export function UsersPage() {
  const styles = useStyles();
  const [users, setUsers] = useState<DummyUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('displayName');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showNewUserMenu, setShowNewUserMenu] = useState(false);
  const newUserRef = useRef<HTMLDivElement>(null);

  const loadData = () => {
    setLoading(true);
    getUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  };

  useEffect(loadData, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((u) => u.id)));
    }
  };

  const filtered = useMemo(() => {
    let list = users;
    if (search) {
      const lower = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.displayName.toLowerCase().includes(lower) ||
          u.userPrincipalName.toLowerCase().includes(lower),
      );
    }
    const dir = sortDir === 'asc' ? 1 : -1;
    return [...list].sort((a, b) => {
      const aVal = a[sortField] ?? '';
      const bVal = b[sortField] ?? '';
      return dir * String(aVal).localeCompare(String(bVal));
    });
  }, [users, search, sortField, sortDir]);

  const sortIndicator = (field: SortField) =>
    sortField === field ? (sortDir === 'asc' ? ' ↑↓' : ' ↑↓') : ' ↑↓';

  if (loading) {
    return (
      <div className={styles.center}>
        <Spinner label="Loading users..." />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <PersonRegular className={styles.titleIcon} />
          <Text className={styles.title}>Users</Text>
        </div>
        <Text className={styles.subtitle}>contoso</Text>
      </div>

      {/* Command bar */}
      <div className={styles.toolbarWrap} ref={newUserRef}>
        <Toolbar className={styles.commandBar}>
          <ToolbarButton
            icon={<AddRegular />}
            onClick={() => setShowNewUserMenu((v) => !v)}
          >
            <span className={styles.dropdownButton}>
              New user <ChevronDownRegular className={styles.chevronIcon} />
            </span>
          </ToolbarButton>
          <ToolbarButton icon={<EditRegular />} disabled>
            <span className={styles.dropdownButton}>
              Edit <ChevronDownRegular className={styles.chevronIcon} />
            </span>
          </ToolbarButton>
          <ToolbarButton icon={<DeleteRegular />} disabled={selected.size === 0}>
            Delete
          </ToolbarButton>
          <ToolbarButton icon={<ArrowDownloadRegular />} disabled>
            Download users (Preview)
          </ToolbarButton>
          <ToolbarButton disabled>
            <span className={styles.dropdownButton}>
              Bulk operations <ChevronDownRegular className={styles.chevronIcon} />
            </span>
          </ToolbarButton>
          <ToolbarButton icon={<ArrowSyncRegular />} onClick={loadData}>
            Refresh
          </ToolbarButton>
          <ToolbarButton icon={<SlideSettingsRegular />} disabled>
            <span className={styles.dropdownButton}>
              Manage view <ChevronDownRegular className={styles.chevronIcon} />
            </span>
          </ToolbarButton>
          <ToolbarDivider />
          <ToolbarButton icon={<ShieldPersonRegular />} disabled>
            Per-user MFA
          </ToolbarButton>
          <ToolbarDivider />
          <ToolbarButton icon={<ChatHelpRegular />} disabled>
            Got feedback?
          </ToolbarButton>
        </Toolbar>

        {/* New user flyout */}
        {showNewUserMenu && (
          <>
            <div
              className={styles.menuOverlay}
              onClick={() => setShowNewUserMenu(false)}
            />
            <div className={styles.menuPopup}>
              <button
                className={styles.menuItem}
                onClick={() => setShowNewUserMenu(false)}
              >
                <span className={styles.menuItemTitle}>Create new user</span>
                <span className={styles.menuItemDesc}>
                  Create a new internal user in your organization
                </span>
              </button>
              <button
                className={styles.menuItem}
                onClick={() => setShowNewUserMenu(false)}
              >
                <span className={styles.menuItemTitle}>Invite external user</span>
                <span className={styles.menuItemDesc}>
                  Invite an external user to collaborate with your organization
                </span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Azure AD banner */}
      <div className={styles.banner}>
        <span className={styles.bannerIcon}>ⓘ</span>
        <Link className={styles.bannerLink} href="#">
          Azure Active Directory is now Microsoft Entra ID. <OpenRegular fontSize={12} />
        </Link>
      </div>

      {/* Search and filter row */}
      <div className={styles.searchRow}>
        <Input
          className={styles.searchBox}
          contentBefore={<SearchRegular />}
          placeholder="Search"
          value={search}
          onChange={(_, d) => setSearch(d.value)}
        />
        <button className={styles.filterButton}>
          <FilterRegular fontSize={16} />
          Add filter
        </button>
      </div>

      {/* Count */}
      <Text className={styles.count}>
        {filtered.length} users found
      </Text>

      {/* Table */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.thCheckbox}>
              <Checkbox
                aria-label="Select all"
                checked={
                  filtered.length > 0 && selected.size === filtered.length
                    ? true
                    : selected.size > 0
                      ? 'mixed'
                      : false
                }
                onChange={toggleSelectAll}
              />
            </th>
            <th className={styles.th} onClick={() => handleSort('displayName')}>
              Display name{sortIndicator('displayName')}
            </th>
            <th className={styles.th} onClick={() => handleSort('userPrincipalName')}>
              User principal name{sortIndicator('userPrincipalName')}
            </th>
            <th className={styles.th} onClick={() => handleSort('userType')}>
              User type{sortIndicator('userType')}
            </th>
            <th className={styles.th}>Is Agent</th>
            <th className={styles.th}>On-premises sync enabled</th>
            <th className={styles.th}>Identities</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((user) => (
            <tr
              key={user.id}
              className={mergeClasses(
                styles.row,
                selected.has(user.id) ? styles.selectedRow : undefined,
              )}
            >
              <td className={styles.td}>
                <Checkbox
                  aria-label={`Select ${user.displayName}`}
                  checked={selected.has(user.id)}
                  onChange={() => toggleSelect(user.id)}
                />
              </td>
              <td className={styles.td}>
                <div className={styles.nameCell}>
                  <Avatar
                    name={user.displayName}
                    color={getAvatarColor(user.displayName)}
                    size={28}
                  />
                  <Link>{user.displayName}</Link>
                </div>
              </td>
              <td className={styles.td}>
                <div className={styles.upnCell}>
                  {user.userPrincipalName}
                  <DocumentCopyRegular className={styles.copyIcon} />
                </div>
              </td>
              <td className={styles.td}>{user.userType}</td>
              <td className={styles.td}>{user.isAgent ? 'Yes' : 'No'}</td>
              <td className={styles.td}>
                {user.onPremisesSyncEnabled ? 'Yes' : 'No'}
              </td>
              <td className={styles.td}>
                {user.identities ?? 'contoso.onmicrosoft.com'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
