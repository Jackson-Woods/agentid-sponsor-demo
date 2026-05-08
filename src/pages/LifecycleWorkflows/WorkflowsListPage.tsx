import { useEffect, useState } from 'react';
import {
  makeStyles,
  tokens,
  Text,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  Input,
  Button,
  Checkbox,
  Spinner,
  Link,
} from '@fluentui/react-components';
import {
  AddRegular,
  PlayCircleRegular,
  CheckmarkRegular,
  DismissRegular,
  ArrowSyncRegular,
  DeleteRegular,
  ColumnTripleRegular,
  ChatHelpRegular,
  SearchRegular,
  FilterRegular,
} from '@fluentui/react-icons';
import { LifecyclePageHeader } from './LifecyclePageHeader';
import { getLifecycleWorkflows } from '../../services/dataService';
import type { LifecycleWorkflow } from '../../models/types';

const useStyles = makeStyles({
  toolbar: {
    paddingLeft: 0,
    flexWrap: 'wrap',
  },
  controlsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '4px',
  },
  searchBox: {
    width: '320px',
  },
  count: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground2,
    marginTop: '8px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '4px',
    fontSize: '13px',
  },
  th: {
    textAlign: 'left',
    padding: '8px 10px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    fontWeight: 600,
    color: tokens.colorNeutralForeground2,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  td: {
    padding: '10px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke3}`,
    verticalAlign: 'middle',
  },
  nameLink: {
    color: tokens.colorBrandForeground1,
    cursor: 'pointer',
  },
  statusDot: {
    display: 'inline-block',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    padding: '40px',
  },
});

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const datePart = d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  const timePart = d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  return `${datePart}, ${timePart}`;
}

export function WorkflowsListPage() {
  const styles = useStyles();
  const [workflows, setWorkflows] = useState<LifecycleWorkflow[] | null>(null);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const loadData = async () => {
    const w = await getLifecycleWorkflows();
    setWorkflows(w);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = (workflows ?? []).filter((w) =>
    w.displayName.toLowerCase().includes(search.toLowerCase()),
  );

  const allSelected =
    filtered.length > 0 && filtered.every((w) => selected.has(w.id));
  const someSelected = filtered.some((w) => selected.has(w.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((w) => w.id)));
    }
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const hasSelection = selected.size > 0;

  const toolbar = (
    <Toolbar className={styles.toolbar}>
      <ToolbarButton icon={<AddRegular style={{ color: tokens.colorBrandForeground1 }} />}>
        Create workflow
      </ToolbarButton>
      <ToolbarButton icon={<PlayCircleRegular />} disabled={!hasSelection}>
        Run on demand
      </ToolbarButton>
      <ToolbarButton icon={<CheckmarkRegular />} disabled={!hasSelection}>
        Enable schedule
      </ToolbarButton>
      <ToolbarButton icon={<DismissRegular />} disabled={!hasSelection}>
        Disable schedule
      </ToolbarButton>
      <ToolbarButton icon={<ArrowSyncRegular />} onClick={loadData}>
        Refresh
      </ToolbarButton>
      <ToolbarButton icon={<DeleteRegular />} disabled={!hasSelection}>
        Delete
      </ToolbarButton>
      <ToolbarButton icon={<ColumnTripleRegular />}>Columns</ToolbarButton>
      <ToolbarDivider />
      <ToolbarButton icon={<ChatHelpRegular />}>Got feedback?</ToolbarButton>
    </Toolbar>
  );

  return (
    <LifecyclePageHeader
      pageLabel="Workflows"
      iconKind="workflows"
      bannerVariant="future"
      toolbar={toolbar}
    >
      <div className={styles.controlsRow}>
        <Input
          className={styles.searchBox}
          contentBefore={<SearchRegular />}
          placeholder="Search by name"
          size="small"
          value={search}
          onChange={(_, d) => setSearch(d.value)}
        />
        <Button icon={<FilterRegular />} size="small" appearance="subtle">
          Add filter
        </Button>
      </div>

      {workflows === null ? (
        <div className={styles.loading}>
          <Spinner />
        </div>
      ) : (
        <>
          <Text className={styles.count}>
            Showing {filtered.length} out of {workflows.length}
          </Text>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th} style={{ width: '32px' }}>
                  <Checkbox
                    checked={allSelected ? true : someSelected ? 'mixed' : false}
                    onChange={toggleAll}
                  />
                </th>
                <th className={styles.th}>Name ↑</th>
                <th className={styles.th}>Description</th>
                <th className={styles.th}>Created date</th>
                <th className={styles.th}>Modified date</th>
                <th className={styles.th} style={{ width: '32px' }}>
                  <span className={styles.statusDot} style={{ background: '#d13438' }} />
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((wf) => (
                <tr key={wf.id}>
                  <td className={styles.td}>
                    <Checkbox
                      checked={selected.has(wf.id)}
                      onChange={() => toggleOne(wf.id)}
                    />
                  </td>
                  <td className={styles.td}>
                    <Link className={styles.nameLink}>{wf.displayName}</Link>
                  </td>
                  <td className={styles.td}>{wf.description}</td>
                  <td className={styles.td}>{formatDateTime(wf.createdDateTime)}</td>
                  <td className={styles.td}>{formatDateTime(wf.lastModifiedDateTime)}</td>
                  <td className={styles.td}>
                    <span
                      className={styles.statusDot}
                      style={{
                        background: wf.scheduleEnabled ? '#107c10' : '#d13438',
                      }}
                      title={wf.scheduleEnabled ? 'Schedule enabled' : 'Schedule disabled'}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </LifecyclePageHeader>
  );
}
