import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  makeStyles,
  tokens,
  Text,
  Card,
  Spinner,
  Input,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbDivider,
  Link,
} from '@fluentui/react-components';
import {
  InfoRegular,
  AddRegular,
  ArrowDownloadRegular,
  SettingsRegular,
  SearchRegular,
  PeopleAddRegular,
  ShieldPersonRegular,
} from '@fluentui/react-icons';
import { getGroupStats } from '../../services/dataService';
import type { GroupStats } from '../../services/dataService';

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  subtitle: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground3,
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    padding: '60px',
  },

  // Tabs
  tabBar: {
    display: 'flex',
    gap: '0',
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
    marginTop: '-22px',
  },
  tab: {
    padding: '20px 16px 10px 16px',
    fontSize: '14px',
    fontWeight: 400,
    color: tokens.colorNeutralForeground1,
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
  },
  tabActive: {
    padding: '20px 16px 10px 16px',
    fontSize: '14px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    borderBottom: `2px solid ${tokens.colorBrandForeground1}`,
  },

  // Search
  searchBox: {
    width: '100%',
    maxWidth: '720px',
  },

  // Section title
  sectionTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },

  // Stats grid - 2 columns, label + blue value inline
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    columnGap: '80px',
    rowGap: '12px',
  },
  statRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '16px',
  },
  statLabel: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground1,
    minWidth: '140px',
  },
  statValue: {
    fontSize: '13px',
    color: tokens.colorBrandForeground1,
    fontWeight: 600,
  },

  // Feature highlights
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  featureCard: {
    padding: '20px',
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
  },
  featureIconWrap: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  featureContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  featureTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: tokens.colorBrandForeground1,
  },
  featureDesc: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground2,
  },

  // Quick actions
  quickActionsRow: {
    display: 'flex',
    gap: '32px',
  },
  quickAction: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: '8px',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      borderRadius: '6px',
    },
  },
  quickActionLabel: {
    fontSize: '12px',
    color: tokens.colorBrandForeground1,
    textAlign: 'center',
  },
});

export function GroupsPage() {
  const styles = useStyles();
  const navigate = useNavigate();
  const [stats, setStats] = useState<GroupStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGroupStats().then((s) => {
      setStats(s);
      setLoading(false);
    });
  }, []);

  if (loading || !stats) {
    return (
      <div className={styles.center}>
        <Spinner label="Loading overview..." />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div>
        <Breadcrumb size="small">
          <BreadcrumbItem>
            <BreadcrumbButton onClick={() => navigate('/home')}>Home</BreadcrumbButton>
          </BreadcrumbItem>
          <BreadcrumbDivider />
          <BreadcrumbItem>
            <BreadcrumbButton current>Groups</BreadcrumbButton>
          </BreadcrumbItem>
        </Breadcrumb>
        <div className={styles.titleRow}>
          <InfoRegular fontSize={28} style={{ color: tokens.colorBrandForeground1 }} />
          <Text className={styles.title}>Groups | Overview</Text>
        </div>
        <Text className={styles.subtitle} block>
          contoso.com
        </Text>
      </div>

      {/* Command bar */}
      <Toolbar>
        <ToolbarButton icon={<AddRegular />} onClick={() => navigate('/groups/new')}>
          New group
        </ToolbarButton>
        <ToolbarButton icon={<ArrowDownloadRegular />} disabled>
          Download groups
        </ToolbarButton>
        <ToolbarDivider />
        <ToolbarButton icon={<SettingsRegular />} disabled>
          Preview features
        </ToolbarButton>
      </Toolbar>

      {/* Tabs */}
      <div className={styles.tabBar}>
        <button className={styles.tabActive}>Overview</button>
        <button className={styles.tab}>Tutorials</button>
      </div>

      {/* Search */}
      <Input
        className={styles.searchBox}
        contentBefore={<SearchRegular />}
        placeholder="Search your tenant"
        size="medium"
      />

      {/* Basic information */}
      <Text className={styles.sectionTitle} block>Basic information</Text>
      <div className={styles.statsGrid}>
        <div className={styles.statRow}>
          <Text className={styles.statLabel}>Total groups</Text>
          <Link onClick={() => navigate('/groups/all')}>
            <Text className={styles.statValue}>{stats.total}</Text>
          </Link>
        </div>
        <div className={styles.statRow}>
          <Text className={styles.statLabel}>Dynamic groups</Text>
          <Text className={styles.statValue}>{stats.dynamic}</Text>
        </div>
        <div className={styles.statRow}>
          <Text className={styles.statLabel}>M365 groups</Text>
          <Text className={styles.statValue}>{stats.m365}</Text>
        </div>
        <div className={styles.statRow}>
          <Text className={styles.statLabel}>Cloud groups</Text>
          <Text className={styles.statValue}>{stats.cloudGroups}</Text>
        </div>
        <div className={styles.statRow}>
          <Text className={styles.statLabel}>Security groups</Text>
          <Text className={styles.statValue}>{stats.security}</Text>
        </div>
        <div className={styles.statRow}>
          <Text className={styles.statLabel}>On-premises groups</Text>
          <Text className={styles.statValue}>{stats.onPremGroups}</Text>
        </div>
      </div>

      {/* Alerts */}
      <Text className={styles.sectionTitle} block>Alerts</Text>

      {/* Feature highlights */}
      <Text className={styles.sectionTitle} block>Feature highlights</Text>
      <div className={styles.featureGrid}>
        <Card className={styles.featureCard}>
          <div className={styles.featureIconWrap} style={{ backgroundColor: '#f3e8ff' }}>
            <ShieldPersonRegular fontSize={22} style={{ color: '#7c3aed' }} />
          </div>
          <div className={styles.featureContent}>
            <Text className={styles.featureTitle}>Access reviews</Text>
            <Text className={styles.featureDesc}>
              Make sure only the right people have continued access.
            </Text>
          </div>
        </Card>
        <Card className={styles.featureCard}>
          <div className={styles.featureIconWrap} style={{ backgroundColor: '#fef3c7' }}>
            <ShieldPersonRegular fontSize={22} style={{ color: '#d97706' }} />
          </div>
          <div className={styles.featureContent}>
            <Text className={styles.featureTitle}>Conditional Access</Text>
            <Text className={styles.featureDesc}>
              Control user access based on Conditional Access policy to bring signals together,
              to make decisions, and enforce organizational policies.
            </Text>
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <Text className={styles.sectionTitle} block>Quick actions</Text>
      <div className={styles.quickActionsRow}>
        <button className={styles.quickAction} onClick={() => navigate('/groups/new')}>
          <PeopleAddRegular fontSize={28} style={{ color: tokens.colorBrandForeground1 }} />
          <Text className={styles.quickActionLabel}>Add group</Text>
        </button>
        <button className={styles.quickAction}>
          <ArrowDownloadRegular fontSize={28} style={{ color: tokens.colorBrandForeground1 }} />
          <Text className={styles.quickActionLabel}>Download{'\n'}groups</Text>
        </button>
      </div>
    </div>
  );
}
