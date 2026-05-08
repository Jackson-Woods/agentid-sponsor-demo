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
  ArrowResetRegular,
  InfoRegular,
} from '@fluentui/react-icons';
import type { AgentIdentity } from '../../models/types';
import { getAvatarColor } from '../shared/avatarUtils';
import { getAgentIdentities } from '../../services/dataService';

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
    backgroundColor: '#eff6fc',
    border: `1px solid #cce4f7`,
    borderRadius: '4px',
    fontSize: '13px',
    color: tokens.colorNeutralForeground1,
    marginBottom: '12px',
  },
  infoIcon: {
    color: '#0078d4',
    flexShrink: 0,
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
    color: tokens.colorBrandForeground1,
    borderBottom: '2px solid',
    borderBottomColor: tokens.colorBrandForeground1,
    fontWeight: 600,
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
    gap: '12px',
  },
  agentAvatar: {
    borderRadius: '6px 2px 6px 2px',
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
    width: 'fit-content',
  },
  emptySelected: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground3,
    marginTop: '8px',
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
  selectedItemSub: {
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

interface AgentPickerDialogProps {
  isOpen: boolean;
  initialSelectedIds: string[];
  onClose: () => void;
  onConfirm: (selectedIds: string[]) => void;
}

export function AgentPickerDialog({
  isOpen,
  initialSelectedIds,
  onClose,
  onConfirm,
}: AgentPickerDialogProps) {
  const styles = useStyles();
  const [searchTerm, setSearchTerm] = useState('');
  const [agents, setAgents] = useState<AgentIdentity[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    setSearchTerm('');
    setSelectedIds(new Set(initialSelectedIds));
    setLoading(true);
    getAgentIdentities().then((data) => {
      setAgents(data);
      setLoading(false);
    });
  }, [isOpen, initialSelectedIds]);

  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const list = term
      ? agents.filter(
          (a) =>
            a.displayName.toLowerCase().includes(term) ||
            (a.blueprintName ?? '').toLowerCase().includes(term),
        )
      : agents;
    return [...list].sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [agents, searchTerm]);

  const selectedAgents = useMemo(
    () => agents.filter((a) => selectedIds.has(a.id)),
    [agents, selectedIds],
  );

  const toggleItem = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleConfirm = () => {
    onConfirm(Array.from(selectedIds));
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <Text className={styles.headerTitle} block>
            Select Agents
          </Text>
          <Button
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
              <InfoRegular fontSize={16} className={styles.infoIcon} />
              Try changing or adding filters if you don't see what you're looking for.
            </div>

            <Text className={styles.searchLabel}>Search</Text>
            <Input
              className={styles.searchBox}
              contentBefore={<SearchRegular />}
              placeholder="Search for agents"
              value={searchTerm}
              onChange={(_, d) => setSearchTerm(d.value)}
            />
            <Text className={styles.resultCount}>{filtered.length} results found</Text>

            <div className={styles.tabs}>
              <button className={styles.tab}>Agent identities</button>
            </div>

            <div className={styles.tableWrapper}>
              {loading ? (
                <div className={styles.empty}>Loading...</div>
              ) : filtered.length === 0 ? (
                <div className={styles.empty}>
                  {searchTerm ? 'No results found.' : 'No agents available.'}
                </div>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th} style={{ width: '32px' }}></th>
                      <th className={styles.th} style={{ width: '40px' }}></th>
                      <th className={styles.th}>Name</th>
                      <th className={styles.th}>Blueprint name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((agent) => {
                      const checked = selectedIds.has(agent.id);
                      return (
                        <tr
                          key={agent.id}
                          className={mergeClasses(styles.row, checked && styles.rowSelected)}
                          onClick={() => toggleItem(agent.id)}
                        >
                          <td className={styles.td} onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={checked}
                              onChange={() => toggleItem(agent.id)}
                              aria-label={`Select ${agent.displayName}`}
                            />
                          </td>
                          <td className={styles.td}>
                            <Avatar
                              name={agent.displayName}
                              size={32}
                              color={getAvatarColor(agent.displayName)}
                              className={styles.agentAvatar}
                            />
                          </td>
                          <td className={styles.td}>{agent.displayName}</td>
                          <td className={styles.td}>{agent.blueprintName ?? ''}</td>
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
              Selected Agents ({selectedIds.size})
            </Text>
            <button
              className={styles.resetButton}
              onClick={() => setSelectedIds(new Set())}
            >
              <ArrowResetRegular fontSize={14} />
              Reset
            </button>
            {selectedIds.size === 0 ? (
              <Text className={styles.emptySelected}>No agents selected</Text>
            ) : (
              <div className={styles.selectedList}>
                {selectedAgents.map((agent) => (
                  <div key={agent.id} className={styles.selectedItem}>
                    <Avatar
                      name={agent.displayName}
                      size={36}
                      color={getAvatarColor(agent.displayName)}
                      className={styles.agentAvatar}
                    />
                    <div className={styles.selectedItemInfo}>
                      <Text className={styles.selectedItemName} block>
                        {agent.displayName}
                      </Text>
                      {agent.blueprintName && (
                        <Text className={styles.selectedItemSub} block>
                          {agent.blueprintName}
                        </Text>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <Button appearance="primary" onClick={handleConfirm}>
            Select
          </Button>
        </div>
      </div>
    </div>
  );
}
