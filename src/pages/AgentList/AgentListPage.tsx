import { useState, useEffect, useMemo } from 'react';
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
  ArrowSyncRegular,
  ProhibitedRegular,
  TableRegular,
  FilterRegular,
  GridRegular,
  ContactCardRegular,
  CheckmarkCircleFilled,
  DismissCircleFilled,
} from '@fluentui/react-icons';
import { getAgentIdentities, resetData } from '../../services/dataService';
import { getAvatarColor } from '../../components/shared/avatarUtils';
import { CopyButton } from '../../components/shared/CopyButton';
import type { AgentIdentity } from '../../models/types';

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
  statusCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  monoText: {
    fontSize: '12px',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    padding: '60px',
  },
});

type SortField = 'displayName' | 'status' | 'createdDateTime';
type SortDir = 'asc' | 'desc';

export function AgentListPage() {
  const styles = useStyles();
  const navigate = useNavigate();
  const [agents, setAgents] = useState<AgentIdentity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('displayName');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const loadData = () => {
    setLoading(true);
    getAgentIdentities().then((data) => {
      setAgents(data);
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

  const handleReset = () => {
    resetData();
    loadData();
  };

  const filtered = useMemo(() => {
    let list = agents;
    if (search) {
      const lower = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.displayName.toLowerCase().includes(lower) ||
          a.id.toLowerCase().includes(lower),
      );
    }
    const dir = sortDir === 'asc' ? 1 : -1;
    return [...list].sort((a, b) => {
      if (sortField === 'createdDateTime') {
        return (
          dir *
          (new Date(a.createdDateTime).getTime() -
            new Date(b.createdDateTime).getTime())
        );
      }
      const av = a[sortField] ?? '';
      const bv = b[sortField] ?? '';
      return dir * String(av).localeCompare(String(bv));
    });
  }, [agents, search, sortField, sortDir]);

  const sortIndicator = (field: SortField) =>
    sortField === field ? (sortDir === 'asc' ? ' ↑↓' : ' ↑↓') : ' ↑↓';

  if (loading) {
    return (
      <div className={styles.center}>
        <Spinner label="Loading agents..." />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div>
        <Breadcrumb size="small">
          <BreadcrumbItem>
            <BreadcrumbButton>Home</BreadcrumbButton>
          </BreadcrumbItem>
          <BreadcrumbDivider />
          <BreadcrumbItem>
            <BreadcrumbButton current>Agent ID</BreadcrumbButton>
          </BreadcrumbItem>
        </Breadcrumb>
        <div className={styles.titleRow}>
          <ContactCardRegular fontSize={28} style={{ color: tokens.colorBrandForeground1 }} />
          <Text className={styles.title}>Agent ID | All agent identities</Text>
        </div>
        <Text className={styles.subtitle} block>
          Manage and monitor agent identities
        </Text>
      </div>

      <Toolbar>
        <ToolbarButton icon={<ProhibitedRegular />} disabled>
          Disable
        </ToolbarButton>
        <ToolbarButton icon={<ArrowSyncRegular />} onClick={loadData}>
          Refresh
        </ToolbarButton>
        <ToolbarButton icon={<TableRegular />} disabled>
          Choose Columns
        </ToolbarButton>
        <ToolbarDivider />
        <ToolbarButton icon={<GridRegular />} disabled>
          View agent blueprints
        </ToolbarButton>
      </Toolbar>

      <div className={styles.searchRow}>
        <Input
          className={styles.searchBox}
          contentBefore={<SearchRegular />}
          placeholder="Search by agent name or object ID"
          value={search}
          onChange={(_, d) => setSearch(d.value)}
        />
        <button className={styles.filterButton}>
          <FilterRegular fontSize={16} />
          Add filters
        </button>
      </div>

      <Text className={styles.count}>
        {filtered.length} agent identities found
      </Text>

      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.thCheckbox}>
              <Checkbox aria-label="Select all" />
            </th>
            <th className={styles.th} onClick={() => handleSort('displayName')}>
              Name{sortIndicator('displayName')}
            </th>
            <th
              className={styles.th}
              onClick={() => handleSort('createdDateTime')}
            >
              Created on{sortIndicator('createdDateTime')}
            </th>
            <th className={styles.th} onClick={() => handleSort('status')}>
              Status{sortIndicator('status')}
            </th>
            <th className={styles.th}>Object ID</th>
            <th className={styles.th}>Uses agent identity</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((agent) => (
            <tr key={agent.id} className={styles.row}>
              <td className={styles.td}>
                <Checkbox aria-label={`Select ${agent.displayName}`} />
              </td>
              <td className={styles.td}>
                <div className={styles.nameCell}>
                  <Avatar
                    name={agent.displayName}
                    size={28}
                    shape="square"
                    color={getAvatarColor(agent.displayName)}
                  />
                  <Link onClick={() => navigate(`/agent/${agent.id}`)}>
                    {agent.displayName}
                  </Link>
                </div>
              </td>
              <td className={styles.td}>
                {new Date(agent.createdDateTime).toLocaleDateString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: '2-digit',
                })}
              </td>
              <td className={styles.td}>
                <div className={styles.statusCell}>
                  {agent.status === 'Active' ? (
                    <CheckmarkCircleFilled
                      color={tokens.colorPaletteGreenForeground1}
                      fontSize={16}
                    />
                  ) : (
                    <DismissCircleFilled
                      color={tokens.colorPaletteRedForeground1}
                      fontSize={16}
                    />
                  )}
                  {agent.status}
                </div>
              </td>
              <td className={styles.td}>
                <span className={styles.monoText}>{agent.id}</span>
              </td>
              <td className={styles.td}>
                {agent.hasAgentUser ? 'Yes' : 'No'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
