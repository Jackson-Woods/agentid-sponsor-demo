import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  makeStyles,
  tokens,
  Text,
  Card,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  Link,
  TabList,
  Tab,
  Spinner,
} from '@fluentui/react-components';
import {
  AddRegular,
  ArrowSyncRegular,
  ChatHelpRegular,
  ClockRegular,
  CheckmarkCircleRegular,
  ErrorCircleRegular,
  DeleteRegular,
  TaskListLtrRegular,
} from '@fluentui/react-icons';
import { LifecyclePageHeader } from './LifecyclePageHeader';
import {
  getLifecycleWorkflows,
  getDeletedLifecycleWorkflows,
  getWorkflowSettings,
} from '../../services/dataService';
import type { LifecycleWorkflow, WorkflowSettings } from '../../models/types';

const useStyles = makeStyles({
  toolbar: {
    paddingLeft: 0,
  },
  tabsRow: {
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 600,
    marginTop: '16px',
    display: 'block',
  },
  noDataText: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground2,
    paddingLeft: '8px',
  },
  feedGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    maxWidth: '760px',
  },
  feedCard: {
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  feedCardRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  feedCardIcon: {
    fontSize: '32px',
    flexShrink: 0,
  },
  feedCardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  feedCardTitle: {
    fontSize: '14px',
    fontWeight: 600,
  },
  feedCardValue: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground2,
  },
  feedCardLink: {
    fontSize: '13px',
    marginTop: '4px',
  },
  quickActions: {
    display: 'flex',
    gap: '24px',
    marginTop: '8px',
  },
  quickActionBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '12px 16px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: tokens.colorBrandForeground1,
    fontSize: '13px',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    padding: '40px',
  },
});

type TabValue = 'gettingStarted' | 'overview' | 'insights';

export function LifecycleWorkflowsPage() {
  const styles = useStyles();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabValue>('overview');
  const [workflows, setWorkflows] = useState<LifecycleWorkflow[] | null>(null);
  const [deleted, setDeleted] = useState<LifecycleWorkflow[] | null>(null);
  const [settings, setSettings] = useState<WorkflowSettings | null>(null);

  const loadData = async () => {
    const [w, d, s] = await Promise.all([
      getLifecycleWorkflows(),
      getDeletedLifecycleWorkflows(),
      getWorkflowSettings(),
    ]);
    setWorkflows(w);
    setDeleted(d);
    setSettings(s);
  };

  useEffect(() => {
    loadData();
  }, []);

  const enabledCount = workflows?.filter((w) => w.scheduleEnabled).length ?? 0;
  const disabledCount = workflows?.filter((w) => !w.scheduleEnabled).length ?? 0;
  const deletedCount = deleted?.length ?? 0;
  const scheduleHours = settings?.workflowScheduleHours ?? 1;
  const scheduleLabel =
    scheduleHours === 1 ? 'Every 1 hours' : `Every ${scheduleHours} hours`;

  const toolbar = (
    <Toolbar className={styles.toolbar}>
      <ToolbarButton icon={<AddRegular style={{ color: tokens.colorBrandForeground1 }} />}>
        Create workflow
      </ToolbarButton>
      <ToolbarButton icon={<ArrowSyncRegular />} onClick={loadData}>
        Refresh
      </ToolbarButton>
      <ToolbarDivider />
      <ToolbarButton icon={<ChatHelpRegular />}>Got feedback?</ToolbarButton>
    </Toolbar>
  );

  return (
    <LifecyclePageHeader
      pageLabel="Overview"
      iconKind="overview"
      rootBreadcrumb
      bannerVariant="future"
      toolbar={toolbar}
    >
      <div className={styles.tabsRow}>
        <TabList selectedValue={tab} onTabSelect={(_, d) => setTab(d.value as TabValue)}>
          <Tab value="gettingStarted">Getting Started</Tab>
          <Tab value="overview">Overview</Tab>
          <Tab value="insights">Workflow Insights</Tab>
        </TabList>
      </div>

      {tab !== 'overview' && <Text className={styles.noDataText}>Coming soon</Text>}

      {tab === 'overview' && (
        <>
          <Text className={styles.sectionTitle}>Alerts</Text>
          <Text className={styles.noDataText}>No alerts to display</Text>

          <Text className={styles.sectionTitle}>My Feed</Text>
          {workflows === null ? (
            <div className={styles.loading}>
              <Spinner />
            </div>
          ) : (
            <div className={styles.feedGrid}>
              <Card className={styles.feedCard}>
                <div className={styles.feedCardRow}>
                  <ClockRegular className={styles.feedCardIcon} style={{ color: '#0078d4' }} />
                  <div className={styles.feedCardBody}>
                    <Text className={styles.feedCardTitle}>Workflow schedule</Text>
                    <Text className={styles.feedCardValue}>{scheduleLabel}</Text>
                  </div>
                </div>
                <Link
                  className={styles.feedCardLink}
                  onClick={() => navigate('/lifecycle-workflows/settings')}
                >
                  View workflow settings
                </Link>
              </Card>

              <Card className={styles.feedCard}>
                <div className={styles.feedCardRow}>
                  <CheckmarkCircleRegular
                    className={styles.feedCardIcon}
                    style={{ color: '#107c10' }}
                  />
                  <div className={styles.feedCardBody}>
                    <Text className={styles.feedCardTitle}>Schedule enabled</Text>
                    <Text className={styles.feedCardValue}>{enabledCount}</Text>
                  </div>
                </div>
                <Link
                  className={styles.feedCardLink}
                  onClick={() => navigate('/lifecycle-workflows/workflows')}
                >
                  View workflows
                </Link>
              </Card>

              <Card className={styles.feedCard}>
                <div className={styles.feedCardRow}>
                  <ErrorCircleRegular
                    className={styles.feedCardIcon}
                    style={{ color: '#d13438' }}
                  />
                  <div className={styles.feedCardBody}>
                    <Text className={styles.feedCardTitle}>Schedule disabled</Text>
                    <Text className={styles.feedCardValue}>{disabledCount}</Text>
                  </div>
                </div>
                <Link
                  className={styles.feedCardLink}
                  onClick={() => navigate('/lifecycle-workflows/workflows')}
                >
                  View workflows
                </Link>
              </Card>

              <Card className={styles.feedCard}>
                <div className={styles.feedCardRow}>
                  <DeleteRegular
                    className={styles.feedCardIcon}
                    style={{ color: tokens.colorNeutralForeground3 }}
                  />
                  <div className={styles.feedCardBody}>
                    <Text className={styles.feedCardTitle}>Deleted workflows</Text>
                    <Text className={styles.feedCardValue}>{deletedCount}</Text>
                  </div>
                </div>
                <Link className={styles.feedCardLink}>View deleted workflows</Link>
              </Card>
            </div>
          )}

          <Text className={styles.sectionTitle}>Quick Actions</Text>
          <div className={styles.quickActions}>
            <button
              className={styles.quickActionBtn}
              onClick={() => navigate('/lifecycle-workflows/workflows')}
            >
              <TaskListLtrRegular fontSize={32} />
              View workflows
            </button>
            <button className={styles.quickActionBtn}>
              <AddRegular fontSize={32} />
              Create workflow
            </button>
          </div>
        </>
      )}
    </LifecyclePageHeader>
  );
}
