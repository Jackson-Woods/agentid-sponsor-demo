import { useEffect, useState } from 'react';
import {
  makeStyles,
  tokens,
  Text,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  Input,
  Spinner,
} from '@fluentui/react-components';
import {
  AddRegular,
  ColumnTripleRegular,
  ArrowSyncRegular,
  ChatHelpRegular,
  SearchRegular,
} from '@fluentui/react-icons';
import { LifecyclePageHeader } from './LifecyclePageHeader';
import { getCustomExtensions } from '../../services/dataService';
import type { CustomExtension } from '../../models/types';

const useStyles = makeStyles({
  toolbar: {
    paddingLeft: 0,
  },
  searchRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '4px',
  },
  searchBox: {
    width: '320px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '8px',
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
  },
  emptyRow: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground2,
    padding: '12px 10px',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    padding: '40px',
  },
});

export function CustomExtensionsPage() {
  const styles = useStyles();
  const [extensions, setExtensions] = useState<CustomExtension[] | null>(null);
  const [search, setSearch] = useState('');

  const loadData = async () => {
    const e = await getCustomExtensions();
    setExtensions(e);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = (extensions ?? []).filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()),
  );

  const toolbar = (
    <Toolbar className={styles.toolbar}>
      <ToolbarButton icon={<AddRegular style={{ color: tokens.colorBrandForeground1 }} />}>
        Add a custom extension
      </ToolbarButton>
      <ToolbarButton icon={<ColumnTripleRegular />}>Column</ToolbarButton>
      <ToolbarButton icon={<ArrowSyncRegular />} onClick={loadData}>
        Refresh
      </ToolbarButton>
      <ToolbarDivider />
      <ToolbarButton icon={<ChatHelpRegular />}>Got feedback?</ToolbarButton>
    </Toolbar>
  );

  return (
    <LifecyclePageHeader
      pageLabel="Custom extensions"
      iconKind="extensions"
      bannerVariant="present"
      toolbar={toolbar}
    >
      <div className={styles.searchRow}>
        <Input
          className={styles.searchBox}
          contentBefore={<SearchRegular />}
          placeholder="Search by custom extension name"
          size="small"
          value={search}
          onChange={(_, d) => setSearch(d.value)}
        />
      </div>

      {extensions === null ? (
        <div className={styles.loading}>
          <Spinner />
        </div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Name</th>
              <th className={styles.th}>Logic app</th>
              <th className={styles.th}>Token Security</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={3} className={styles.td}>
                  <Text className={styles.emptyRow}>No Custom Extensions</Text>
                </td>
              </tr>
            ) : (
              filtered.map((ext) => (
                <tr key={ext.id}>
                  <td className={styles.td}>{ext.name}</td>
                  <td className={styles.td}>{ext.logicAppName}</td>
                  <td className={styles.td}>{ext.tokenSecurity}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </LifecyclePageHeader>
  );
}
