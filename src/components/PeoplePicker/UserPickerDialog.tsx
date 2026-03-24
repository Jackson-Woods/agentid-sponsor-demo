import { useState, useEffect, useMemo } from 'react';
import {
  Button,
  Input,
  Text,
  Checkbox,
  Avatar,
  makeStyles,
  tokens,
  mergeClasses,
} from '@fluentui/react-components';
import {
  SearchRegular,
  DismissRegular,
  DeleteRegular,
  ArrowResetRegular,
} from '@fluentui/react-icons';
import type { DummyUser } from '../../models/types';
import { getAvatarColor } from '../shared/avatarUtils';
import { getUsers } from '../../services/dataService';

const useStyles = makeStyles({
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  panel: {
    width: '900px',
    maxWidth: '95vw',
    height: '100%',
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow64,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '20px 24px 12px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  headerTitle: {
    fontSize: '20px',
    fontWeight: 600,
  },
  headerSubtitle: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground3,
    marginTop: '4px',
  },
  closeButton: {
    marginTop: '-4px',
  },
  body: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  leftPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '16px 20px',
    overflow: 'hidden',
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  searchLabel: {
    fontSize: '13px',
    fontWeight: 600,
    marginBottom: '4px',
  },
  searchBox: {
    width: '100%',
    marginBottom: '4px',
  },
  resultCount: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    marginBottom: '8px',
  },
  tableWrapper: {
    flex: 1,
    overflow: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '6px 10px',
    fontSize: '12px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground3,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    position: 'sticky',
    top: 0,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  td: {
    padding: '6px 10px',
    fontSize: '13px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    verticalAlign: 'middle',
  },
  row: {
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  rowSelected: {
    backgroundColor: tokens.colorStatusWarningBackground1,
  },
  nameCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
  },
  detailsCell: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '250px',
  },
  rightPanel: {
    width: '280px',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
    overflow: 'hidden',
  },
  selectedHeader: {
    fontSize: '14px',
    fontWeight: 600,
    marginBottom: '4px',
  },
  resetButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 0',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '12px',
    color: tokens.colorBrandForeground1,
    marginBottom: '8px',
  },
  selectedList: {
    flex: 1,
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  selectedItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px',
    borderRadius: '4px',
    backgroundColor: tokens.colorNeutralBackground3,
  },
  selectedItemInfo: {
    flex: 1,
    minWidth: 0,
  },
  selectedItemName: {
    fontSize: '13px',
    fontWeight: 600,
  },
  selectedItemEmail: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  footer: {
    padding: '12px 20px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  empty: {
    padding: '24px',
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
  },
});

interface UserPickerDialogProps {
  isOpen: boolean;
  title: string;
  subtitle: string;
  initialSelected: DummyUser[];
  onClose: () => void;
  onConfirm: (selected: DummyUser[]) => void;
}

export function UserPickerDialog({
  isOpen,
  title,
  subtitle,
  initialSelected,
  onClose,
  onConfirm,
}: UserPickerDialogProps) {
  const styles = useStyles();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<DummyUser[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    setSearchTerm('');
    setSelectedIds(new Set(initialSelected.map((u) => u.id)));
    setLoading(true);

    getUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, [isOpen]);

  const filtered = useMemo(() => {
    let list = users;
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      list = list.filter(
        (u) =>
          u.displayName.toLowerCase().includes(lower) ||
          u.mail.toLowerCase().includes(lower),
      );
    }
    return [...list].sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [users, searchTerm]);

  const selectedUsers = useMemo(
    () => users.filter((u) => selectedIds.has(u.id)),
    [users, selectedIds],
  );

  const toggleItem = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const removeItem = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleConfirm = () => {
    onConfirm(selectedUsers);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <Text className={styles.headerTitle} block>
              {title}
            </Text>
            <Text className={styles.headerSubtitle} block>
              {subtitle}
            </Text>
          </div>
          <Button
            className={styles.closeButton}
            appearance="subtle"
            icon={<DismissRegular />}
            onClick={onClose}
            aria-label="Close"
          />
        </div>

        {/* Body */}
        <div className={styles.body}>
          {/* Left: search + table */}
          <div className={styles.leftPanel}>
            <Text className={styles.searchLabel}>Search</Text>
            <Input
              className={styles.searchBox}
              contentBefore={<SearchRegular />}
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(_, d) => setSearchTerm(d.value)}
            />
            <Text className={styles.resultCount}>
              {filtered.length} results found
            </Text>

            {/* Table */}
            <div className={styles.tableWrapper}>
              {loading ? (
                <div className={styles.empty}>Loading...</div>
              ) : filtered.length === 0 ? (
                <div className={styles.empty}>
                  {searchTerm ? 'No results found.' : 'No users available.'}
                </div>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th} style={{ width: '32px' }}></th>
                      <th className={styles.th}>Name</th>
                      <th className={styles.th}>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((user) => {
                      const checked = selectedIds.has(user.id);
                      return (
                        <tr
                          key={user.id}
                          className={mergeClasses(styles.row, checked && styles.rowSelected)}
                          onClick={() => toggleItem(user.id)}
                        >
                          <td className={styles.td} onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={checked}
                              onChange={() => toggleItem(user.id)}
                              aria-label={`Select ${user.displayName}`}
                            />
                          </td>
                          <td className={styles.td}>
                            <div className={styles.nameCell}>
                              <Avatar
                                name={user.displayName}
                                size={32}
                                color={getAvatarColor(user.displayName)}
                              />
                              <Text>{user.displayName}</Text>
                            </div>
                          </td>
                          <td className={styles.td}>
                            <span className={styles.detailsCell}>{user.mail}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Right: selected items */}
          <div className={styles.rightPanel}>
            <Text className={styles.selectedHeader}>
              Selected ({selectedIds.size})
            </Text>
            {selectedIds.size > 0 && (
              <button
                className={styles.resetButton}
                onClick={() => setSelectedIds(new Set())}
              >
                <ArrowResetRegular fontSize={14} />
                Reset
              </button>
            )}
            <div className={styles.selectedList}>
              {selectedUsers.map((user) => (
                <div key={user.id} className={styles.selectedItem}>
                  <Avatar
                    name={user.displayName}
                    size={36}
                    color={getAvatarColor(user.displayName)}
                  />
                  <div className={styles.selectedItemInfo}>
                    <Text className={styles.selectedItemName} block>
                      {user.displayName}
                    </Text>
                    <Text className={styles.selectedItemEmail} block>
                      {user.mail}
                    </Text>
                  </div>
                  <Button
                    appearance="subtle"
                    icon={<DeleteRegular />}
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(user.id);
                    }}
                    aria-label={`Remove ${user.displayName}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <Button appearance="primary" onClick={handleConfirm}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
