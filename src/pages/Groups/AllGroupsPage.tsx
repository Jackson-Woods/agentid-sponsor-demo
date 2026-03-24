import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  makeStyles,
  tokens,
  Text,
  Input,
  Link,
  Spinner,
  Checkbox,
  Avatar,
  Button,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbDivider,
} from '@fluentui/react-components';
import {
  SearchRegular,
  AddRegular,
  PeopleRegular,
  ArrowSyncRegular,
  ArrowDownloadRegular,
  FilterRegular,
  DeleteRegular,
  ChatHelpRegular,
  SlideSettingsRegular,
} from '@fluentui/react-icons';
import { getGroups, deleteGroups } from '../../services/dataService';
import { getAvatarColor } from '../../components/shared/avatarUtils';
import { ToastContainer } from '../../components/shared/Toast';
import type { ToastMessage } from '../../components/shared/Toast';
import type { DummyGroup } from '../../models/types';
import { getGroupTypeLabel } from '../../models/types';

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
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
  },
  row: {
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  nameCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  monoText: {
    fontSize: '12px',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    padding: '60px',
  },
  confirmBanner: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '12px 0',
    backgroundColor: tokens.colorNeutralBackground1,
    position: 'relative',
    zIndex: 10,
    marginBottom: '-60px',
  },
  confirmText: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground1,
  },
  confirmButtons: {
    display: 'flex',
    gap: '8px',
  },
  selectedRow: {
    backgroundColor: tokens.colorNeutralBackground1Selected,
  },
});

type SortField = 'displayName' | 'groupType' | 'membershipType' | 'mail';
type SortDir = 'asc' | 'desc';

function getMembershipType(group: DummyGroup): string {
  const label = getGroupTypeLabel(group);
  if (label.startsWith('Dynamic')) return 'Dynamic';
  return 'Assigned';
}

function getGroupTypeColumn(group: DummyGroup): string {
  const label = getGroupTypeLabel(group);
  if (label === 'Microsoft 365' || label === 'Dynamic Microsoft 365') return 'Microsoft 365';
  if (label === 'Mail-Enabled Security') return 'Mail enabled security';
  return 'Security';
}

export function AllGroupsPage() {
  const styles = useStyles();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<DummyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('displayName');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showConfirm, setShowConfirm] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const loadData = () => {
    setLoading(true);
    getGroups().then((data) => {
      setGroups(data);
      setLoading(false);
    });
  };

  useEffect(loadData, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

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
      setSelected(new Set(filtered.map((g) => g.id)));
    }
  };

  const handleDeleteClick = () => {
    if (selected.size > 0) setShowConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    const names = groups.filter((g) => selected.has(g.id)).map((g) => g.displayName);
    await deleteGroups([...selected]);
    setShowConfirm(false);
    setSelected(new Set());
    loadData();
    for (const name of names) {
      setToasts((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          title: 'Group successfully deleted',
          message: `${name} has been deleted. Recent changes may take some time to appear.`,
          variant: 'success' as const,
        },
      ]);
    }
  };

  const handleDeleteCancel = () => {
    setShowConfirm(false);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const filtered = useMemo(() => {
    let list = groups;
    if (search) {
      const lower = search.toLowerCase();
      list = list.filter(
        (g) =>
          g.displayName.toLowerCase().includes(lower) ||
          g.mail.toLowerCase().includes(lower) ||
          g.id.toLowerCase().includes(lower),
      );
    }
    const dir = sortDir === 'asc' ? 1 : -1;
    return [...list].sort((a, b) => {
      if (sortField === 'groupType') {
        return dir * getGroupTypeColumn(a).localeCompare(getGroupTypeColumn(b));
      }
      if (sortField === 'membershipType') {
        return dir * getMembershipType(a).localeCompare(getMembershipType(b));
      }
      if (sortField === 'mail') {
        return dir * a.mail.localeCompare(b.mail);
      }
      return dir * a.displayName.localeCompare(b.displayName);
    });
  }, [groups, search, sortField, sortDir]);

  const sortIndicator = (field: SortField) =>
    sortField === field ? (sortDir === 'asc' ? ' ↑↓' : ' ↑↓') : ' ↑↓';

  if (loading) {
    return (
      <div className={styles.center}>
        <Spinner label="Loading groups..." />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div>
        <Breadcrumb size="small">
          <BreadcrumbItem>
            <BreadcrumbButton onClick={() => navigate('/home')}>Home</BreadcrumbButton>
          </BreadcrumbItem>
          <BreadcrumbDivider />
          <BreadcrumbItem>
            <BreadcrumbButton onClick={() => navigate('/groups')}>Groups</BreadcrumbButton>
          </BreadcrumbItem>
          <BreadcrumbDivider />
          <BreadcrumbItem>
            <BreadcrumbButton current>All groups</BreadcrumbButton>
          </BreadcrumbItem>
        </Breadcrumb>
        <div className={styles.titleRow}>
          <PeopleRegular fontSize={28} style={{ color: tokens.colorBrandForeground1 }} />
          <Text className={styles.title}>Groups | All groups</Text>
        </div>
        <Text className={styles.subtitle} block>
          View and manage all groups in your organization
        </Text>
      </div>

      <Toolbar>
        <ToolbarButton icon={<AddRegular />} onClick={() => navigate('/groups/new')}>
          New group
        </ToolbarButton>
        <ToolbarButton icon={<ArrowDownloadRegular />} disabled>
          Download groups
        </ToolbarButton>
        <ToolbarButton icon={<ArrowSyncRegular />} onClick={loadData}>
          Refresh
        </ToolbarButton>
        <ToolbarButton icon={<SlideSettingsRegular />} disabled>
          Manage view
        </ToolbarButton>
        <ToolbarDivider />
        <ToolbarButton icon={<DeleteRegular />} disabled={selected.size === 0} onClick={handleDeleteClick}>
          Delete
        </ToolbarButton>
        <ToolbarDivider />
        <ToolbarButton icon={<ChatHelpRegular />} disabled>
          Got feedback?
        </ToolbarButton>
      </Toolbar>

      {showConfirm && (
        <div className={styles.confirmBanner}>
          <Text className={styles.confirmText}>Delete the selected groups?</Text>
          <div className={styles.confirmButtons}>
            <Button appearance="primary" size="small" onClick={handleDeleteConfirm}>
              OK
            </Button>
            <Button appearance="outline" size="small" onClick={handleDeleteCancel}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className={styles.searchRow}>
        <Input
          className={styles.searchBox}
          contentBefore={<SearchRegular />}
          placeholder="Search by group name, email, or object ID"
          value={search}
          onChange={(_, d) => setSearch(d.value)}
        />
        <button className={styles.filterButton}>
          <FilterRegular fontSize={16} />
          Add filters
        </button>
      </div>

      <Text className={styles.count}>
        {filtered.length} groups found
      </Text>

      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.thCheckbox}>
              <Checkbox
                aria-label="Select all"
                checked={filtered.length > 0 && selected.size === filtered.length ? true : selected.size > 0 ? 'mixed' : false}
                onChange={toggleSelectAll}
              />
            </th>
            <th className={styles.th} onClick={() => handleSort('displayName')}>
              Name{sortIndicator('displayName')}
            </th>
            <th className={styles.th}>Object ID</th>
            <th className={styles.th} onClick={() => handleSort('groupType')}>
              Group type{sortIndicator('groupType')}
            </th>
            <th className={styles.th} onClick={() => handleSort('membershipType')}>
              Membership type{sortIndicator('membershipType')}
            </th>
            <th className={styles.th} onClick={() => handleSort('mail')}>
              Email{sortIndicator('mail')}
            </th>
            <th className={styles.th}>Source</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((group) => (
            <tr key={group.id} className={`${styles.row} ${selected.has(group.id) ? styles.selectedRow : ''}`}>
              <td className={styles.td}>
                <Checkbox
                  aria-label={`Select ${group.displayName}`}
                  checked={selected.has(group.id)}
                  onChange={() => toggleSelect(group.id)}
                />
              </td>
              <td className={styles.td}>
                <div className={styles.nameCell}>
                  <Avatar
                    name={group.displayName}
                    size={28}
                    shape="square"
                    color={getAvatarColor(group.displayName)}
                  />
                  <Link onClick={() => navigate(`/groups/${group.id}`)}>
                    {group.displayName}
                  </Link>
                </div>
              </td>
              <td className={styles.td}>
                <span className={styles.monoText}>{group.id}</span>
              </td>
              <td className={styles.td}>{getGroupTypeColumn(group)}</td>
              <td className={styles.td}>{getMembershipType(group)}</td>
              <td className={styles.td}>{group.mail}</td>
              <td className={styles.td}>Cloud</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
