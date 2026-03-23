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
  PeopleRegular,
  DismissRegular,
  DeleteRegular,
  ArrowResetRegular,
  InfoRegular,
} from '@fluentui/react-icons';
import type { DummyUser, DummyGroup } from '../../models/types';
import { getAvatarColor } from '../shared/avatarUtils';
import {
  getAvailableOwnerUsers,
  getAvailableSponsors,
  searchEntities,
} from '../../services/dataService';

type FilterTab = 'all' | 'users' | 'groups';

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
  infoBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: '4px',
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    marginBottom: '12px',
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
  tabs: {
    display: 'flex',
    gap: '0',
    marginBottom: '8px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  tab: {
    padding: '6px 12px',
    fontSize: '13px',
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    color: tokens.colorNeutralForeground1,
    borderBottom: '2px solid transparent',
    ':hover': {
      color: tokens.colorBrandForeground1,
    },
  },
  tabActive: {
    color: tokens.colorBrandForeground1,
    fontWeight: 600,
    borderBottomColor: tokens.colorBrandForeground1,
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
    backgroundColor: tokens.colorWarningBackground1,
  },
  nameCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
  },
  groupAvatar: {
    borderRadius: '6px 2px 6px 2px',
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

type PickerMode = 'owner' | 'sponsor';

interface PeoplePickerDialogProps {
  isOpen: boolean;
  mode: PickerMode;
  agentId: string;
  onClose: () => void;
  onConfirm: (selected: (DummyUser | DummyGroup)[]) => void;
}

export function PeoplePickerDialog({
  isOpen,
  mode,
  agentId,
  onClose,
  onConfirm,
}: PeoplePickerDialogProps) {
  const styles = useStyles();
  const [searchTerm, setSearchTerm] = useState('');
  const [entities, setEntities] = useState<(DummyUser | DummyGroup)[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<FilterTab>('all');

  useEffect(() => {
    if (!isOpen) return;
    setSearchTerm('');
    setSelectedIds(new Set());
    setFilterTab('all');
    setLoading(true);

    const load = mode === 'owner'
      ? getAvailableOwnerUsers(agentId)
      : getAvailableSponsors(agentId);

    load.then((data) => {
      setEntities(data);
      setLoading(false);
    });
  }, [isOpen, mode, agentId]);

  const isUser = (e: DummyUser | DummyGroup): e is DummyUser =>
    e['@odata.type'] === '#microsoft.graph.user';

  const searched = useMemo(
    () => searchEntities(entities, searchTerm),
    [entities, searchTerm],
  );

  const filtered = useMemo(() => {
    let list = searched;
    if (filterTab === 'users') list = searched.filter(isUser);
    else if (filterTab === 'groups') list = searched.filter((e) => !isUser(e));
    return [...list].sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [searched, filterTab]);

  const selectedEntities = useMemo(
    () => entities.filter((e) => selectedIds.has(e.id)),
    [entities, selectedIds],
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
    onConfirm(selectedEntities);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <Text className={styles.headerTitle} block>
              {mode === 'owner' ? 'Add owner' : 'Add sponsor'}
            </Text>
            <Text className={styles.headerSubtitle} block>
              {mode === 'owner'
                ? 'Select users to add as owners of this agent'
                : 'Select users to add as sponsors of this agent'}
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
            <div className={styles.infoBanner}>
              <InfoRegular fontSize={16} />
              Try changing or adding filters if you don't see what you're looking for.
            </div>

            <Text className={styles.searchLabel}>Search</Text>
            <Input
              className={styles.searchBox}
              contentBefore={<SearchRegular />}
              placeholder="First 200 shown, search by name or email"
              value={searchTerm}
              onChange={(_, d) => setSearchTerm(d.value)}
            />
            <Text className={styles.resultCount}>
              {filtered.length} results found
            </Text>

            {/* Filter tabs */}
            <div className={styles.tabs}>
              <button
                className={mergeClasses(styles.tab, filterTab === 'all' && styles.tabActive)}
                onClick={() => setFilterTab('all')}
              >
                All
              </button>
              <button
                className={mergeClasses(styles.tab, filterTab === 'users' && styles.tabActive)}
                onClick={() => setFilterTab('users')}
              >
                Users
              </button>
              <button
                className={mergeClasses(styles.tab, filterTab === 'groups' && styles.tabActive)}
                onClick={() => setFilterTab('groups')}
              >
                Groups
              </button>
            </div>

            {/* Table */}
            <div className={styles.tableWrapper}>
              {loading ? (
                <div className={styles.empty}>Loading...</div>
              ) : filtered.length === 0 ? (
                <div className={styles.empty}>
                  {searchTerm ? 'No results found.' : 'All available entries are already assigned.'}
                </div>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th} style={{ width: '32px' }}></th>
                      <th className={styles.th}>Name</th>
                      <th className={styles.th} style={{ width: '70px' }}>Type</th>
                      <th className={styles.th}>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((entity) => {
                      const checked = selectedIds.has(entity.id);
                      const entityIsUser = isUser(entity);
                      const email = entityIsUser
                        ? entity.mail
                        : (entity as DummyGroup).mail || '';
                      return (
                        <tr
                          key={entity.id}
                          className={mergeClasses(styles.row, checked && styles.rowSelected)}
                          onClick={() => toggleItem(entity.id)}
                        >
                          <td className={styles.td} onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={checked}
                              onChange={() => toggleItem(entity.id)}
                              aria-label={`Select ${entity.displayName}`}
                            />
                          </td>
                          <td className={styles.td}>
                            <div className={styles.nameCell}>
                              {entityIsUser ? (
                                <Avatar name={entity.displayName} size={32} color={getAvatarColor(entity.displayName)} />
                              ) : (
                                <Avatar icon={<PeopleRegular />} name={entity.displayName} size={32} color={getAvatarColor(entity.displayName)} className={styles.groupAvatar} />
                              )}
                              <Text>{entity.displayName}</Text>
                            </div>
                          </td>
                          <td className={styles.td}>
                            {entityIsUser ? 'User' : 'Group'}
                          </td>
                          <td className={styles.td}>
                            <span className={styles.detailsCell}>{email}</span>
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
              {selectedEntities.map((entity) => {
                const entityIsUser = isUser(entity);
                const email = entityIsUser
                  ? entity.mail
                  : (entity as DummyGroup).mail || '';
                return (
                  <div key={entity.id} className={styles.selectedItem}>
                    {entityIsUser ? (
                      <Avatar name={entity.displayName} size={36} color={getAvatarColor(entity.displayName)} />
                    ) : (
                      <Avatar icon={<PeopleRegular />} name={entity.displayName} size={36} color={getAvatarColor(entity.displayName)} className={styles.groupAvatar} />
                    )}
                    <div className={styles.selectedItemInfo}>
                      <Text className={styles.selectedItemName} block>
                        {entity.displayName}
                      </Text>
                      {email && (
                        <Text className={styles.selectedItemEmail} block>
                          {email}
                        </Text>
                      )}
                    </div>
                    <Button
                      appearance="subtle"
                      icon={<DeleteRegular />}
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(entity.id);
                      }}
                      aria-label={`Remove ${entity.displayName}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <Button
            appearance="primary"
            onClick={handleConfirm}
            disabled={selectedIds.size === 0}
          >
            Select
          </Button>
        </div>
      </div>
    </div>
  );
}
