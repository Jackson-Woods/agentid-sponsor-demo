import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  makeStyles,
  tokens,
  Text,
  Card,
  Button,
  Spinner,
  Avatar,
  Link,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbDivider,
} from '@fluentui/react-components';
import { InfoRegular } from '@fluentui/react-icons';
import { getAgentIdentities, getBlueprints, getBlueprintAgentCounts } from '../../services/dataService';
import { getAvatarColor } from '../../components/shared/avatarUtils';
import { useAppSettings } from '../../AppSettingsContext';
import type { AgentIdentity, AgentBlueprint } from '../../models/types';

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
    fontSize: '20px',
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

  // Hero card
  heroCard: {
    padding: '24px 28px',
  },
  heroTitle: {
    fontSize: '16px',
    fontWeight: 600,
    marginBottom: '8px',
  },
  heroCount: {
    fontSize: '36px',
    fontWeight: 700,
    color: tokens.colorNeutralForeground1,
  },
  heroBarRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '8px 0',
  },
  heroDescription: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground2,
    marginBottom: '16px',
    maxWidth: '600px',
  },

  // Stats grid
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  statCard: {
    padding: '20px',
  },
  statTitle: {
    fontSize: '14px',
    fontWeight: 600,
  },
  statSubtitle: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    marginBottom: '8px',
  },
  statCountRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  statCount: {
    fontSize: '28px',
    fontWeight: 700,
    color: tokens.colorNeutralForeground1,
  },
  statBadge: {
    fontSize: '12px',
    color: '#4caf50',
    backgroundColor: '#e8f5e9',
    padding: '2px 8px',
    borderRadius: '10px',
  },

  // Donut chart card
  donutCard: {
    padding: '24px',
  },
  donutCardTitle: {
    fontSize: '16px',
    fontWeight: 600,
    marginBottom: '4px',
  },
  donutCardSubtitle: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground3,
    marginBottom: '16px',
  },
  donutLayout: {
    display: 'flex',
    alignItems: 'center',
    gap: '40px',
  },
  donutSvgWrap: {
    flexShrink: 0,
    position: 'relative',
    width: '160px',
    height: '160px',
  },
  donutCenter: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    fontWeight: 700,
  },
  donutLegend: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px 40px',
    flex: 1,
  },
  legendItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  legendBar: {
    width: '3px',
    height: '100%',
    borderRadius: '2px',
    flexShrink: 0,
  },
  legendLabel: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground2,
  },
  legendValue: {
    fontSize: '20px',
    fontWeight: 600,
  },
  legendLink: {
    fontSize: '12px',
  },

  // Blueprints card
  blueprintsCard: {
    padding: '24px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  bpLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  bpTitle: {
    fontSize: '16px',
    fontWeight: 600,
  },
  bpSubtitle: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground3,
  },
  bpLabel: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground2,
    marginTop: '8px',
  },
  bpCountRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  bpCount: {
    fontSize: '28px',
    fontWeight: 700,
  },
  bpRight: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  bpRightTitle: {
    fontSize: '14px',
    fontWeight: 600,
  },
  bpRightSubtitle: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    marginBottom: '4px',
  },
  bpListItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '6px 0',
  },
  bpListName: {
    flex: 1,
    fontSize: '13px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  bpListCount: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    flexShrink: 0,
  },
});

// Donut chart colors
const DONUT_COLORS = {
  noUser: '#0078d4',       // blue
  withUser: '#8661c5',     // purple
  servicePrincipal: '#498205', // green
  noIdentity: '#d13438',   // red
};

function DonutChart({ total, segments }: { total: number; segments: { value: number; color: string }[] }) {
  const radius = 60;
  const cx = 80;
  const cy = 80;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const arcs = segments
    .filter((s) => s.value > 0)
    .map((s) => {
      const fraction = s.value / total;
      const dash = fraction * circumference;
      const gap = circumference - dash;
      const arc = { dash, gap, offset, color: s.color };
      offset += dash;
      return arc;
    });

  return (
    <svg width={160} height={160} viewBox="0 0 160 160">
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke={tokens.colorNeutralBackground4} strokeWidth={strokeWidth} />
      {arcs.map((arc, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={arc.color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${arc.dash} ${arc.gap}`}
          strokeDashoffset={-arc.offset}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      ))}
    </svg>
  );
}

export function AgentIdOverviewPage() {
  const styles = useStyles();
  const navigate = useNavigate();
  const { isDark } = useAppSettings();
  const [agents, setAgents] = useState<AgentIdentity[]>([]);
  const [blueprints, setBlueprints] = useState<AgentBlueprint[]>([]);
  const [bpCounts, setBpCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAgentIdentities(), getBlueprints(), getBlueprintAgentCounts()]).then(
      ([a, b, c]) => {
        setAgents(a);
        setBlueprints(b);
        setBpCounts(c);
        setLoading(false);
      },
    );
  }, []);

  const stats = useMemo(() => {
    const totalAgents = agents.length + 3;
    const recentlyCreated = agents.length;
    const unmanaged = agents.filter((a) => a.ownerCount === 0 && a.sponsorCount === 0).length;
    const active = agents.filter((a) => a.status === 'Active').length;
    const noIdentities = 3;
    const withNoUser = 6;
    const withUser = agents.length - withNoUser;
    const servicePrincipals = 0;
    return { totalAgents, recentlyCreated, unmanaged, active, noIdentities, withNoUser, withUser, servicePrincipals };
  }, [agents]);

  if (loading) {
    return (
      <div className={styles.center}>
        <Spinner label="Loading overview..." />
      </div>
    );
  }

  const donutSegments = [
    { value: stats.withNoUser, color: DONUT_COLORS.noUser },
    { value: stats.withUser, color: DONUT_COLORS.withUser },
    { value: stats.servicePrincipals, color: DONUT_COLORS.servicePrincipal },
    { value: stats.noIdentities, color: DONUT_COLORS.noIdentity },
  ];

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
          <InfoRegular fontSize={28} style={{ color: tokens.colorBrandForeground1 }} />
          <Text className={styles.title}>Agent ID | Overview</Text>
        </div>
        <Text className={styles.subtitle} block>
          Manage and monitor agent identities
        </Text>
      </div>

      {/* Hero: Agents in your tenant */}
      <Card className={styles.heroCard} style={{ background: isDark ? '#1a2744' : 'linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 50%, #dce8fc 100%)' }}>
        <Text className={styles.heroTitle} block>
          Agents in your tenant
        </Text>
        <Text className={styles.heroCount}>{stats.totalAgents}</Text>
        <div className={styles.heroBarRow}>
          <svg width="100" height="32" viewBox="0 0 100 32">
            <polyline
              points="0,28 20,24 40,20 60,14 80,8 100,4"
              fill="none"
              stroke="#4caf50"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <Text className={styles.heroDescription} block>
          Gain full visibility into all agent identities in your tenant, apply governance policies,
          and secure them by default with Entra's integrated registry and lifecycle controls.
        </Text>
        <Button appearance="outline" onClick={() => navigate('/agents')} style={{ alignSelf: 'flex-start', backgroundColor: isDark ? '#2b3a55' : '#ffffff' }}>
          View all agent identities
        </Button>
      </Card>

      {/* Stats grid */}
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <Text className={styles.statTitle} block>Recently created</Text>
          <Text className={styles.statSubtitle} block>Created in last 30 days</Text>
          <div className={styles.statCountRow}>
            <Text className={styles.statCount}>{stats.recentlyCreated}</Text>
            <span className={styles.statBadge}>↑ 56%</span>
          </div>
        </Card>

        <Card className={styles.statCard}>
          <Text className={styles.statTitle} block>Unmanaged</Text>
          <Text className={styles.statSubtitle} block>No owners or sponsors</Text>
          <Text className={styles.statCount}>{stats.unmanaged}</Text>
        </Card>

        <Card className={styles.statCard}>
          <Text className={styles.statTitle} block>Active</Text>
          <Text className={styles.statSubtitle} block>Enabled for access</Text>
          <Text className={styles.statCount}>{stats.active}</Text>
        </Card>

        <Card className={styles.statCard}>
          <Text className={styles.statTitle} block>No identities</Text>
          <Text className={styles.statSubtitle} block>Agents without identities</Text>
          <Text className={styles.statCount}>{stats.noIdentities}</Text>
        </Card>
      </div>

      {/* Types of agents */}
      <Card className={styles.donutCard}>
        <Text className={styles.donutCardTitle} block>Types of agents</Text>
        <Text className={styles.donutCardSubtitle} block>
          Breakdown of different types of agent identities in the tenant
        </Text>
        <div className={styles.donutLayout}>
          <div className={styles.donutSvgWrap}>
            <DonutChart total={stats.totalAgents} segments={donutSegments} />
            <div className={styles.donutCenter}>{stats.totalAgents}</div>
          </div>
          <div className={styles.donutLegend}>
            <div className={styles.legendItem}>
              <Text className={styles.legendLabel}>Agent identities (with no user)</Text>
              <Text className={styles.legendValue} style={{ color: DONUT_COLORS.noUser }}>
                {stats.withNoUser}
              </Text>
              <Link className={styles.legendLink} onClick={() => navigate('/agents')}>
                View agent identities
              </Link>
            </div>
            <div className={styles.legendItem}>
              <Text className={styles.legendLabel}>Agent identities (with user)</Text>
              <Text className={styles.legendValue} style={{ color: DONUT_COLORS.withUser }}>
                {stats.withUser}
              </Text>
              <Link className={styles.legendLink}>View agent users</Link>
            </div>
            <div className={styles.legendItem}>
              <Text className={styles.legendLabel}>Agents with service principals</Text>
              <Text className={styles.legendValue} style={{ color: DONUT_COLORS.servicePrincipal }}>
                {stats.servicePrincipals}
              </Text>
            </div>
            <div className={styles.legendItem}>
              <Text className={styles.legendLabel}>Agents with no identities</Text>
              <Text className={styles.legendValue} style={{ color: DONUT_COLORS.noIdentity }}>
                {stats.noIdentities}
              </Text>
            </div>
          </div>
        </div>
      </Card>

      {/* Agent blueprints */}
      <Card className={styles.blueprintsCard}>
        <div className={styles.bpLeft}>
          <Text className={styles.bpTitle}>Agent blueprints</Text>
          <Text className={styles.bpSubtitle}>
            Blueprints are parent templates that power agent identities in your tenant.
          </Text>
          <Text className={styles.bpLabel}>Agent blueprints</Text>
          <div className={styles.bpCountRow}>
            <Text className={styles.bpCount}>{blueprints.length}</Text>
            <svg width="80" height="28" viewBox="0 0 80 28">
              <polyline
                points="0,24 16,20 32,16 48,10 64,6 80,2"
                fill="none"
                stroke="#4caf50"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <Button appearance="outline" style={{ alignSelf: 'flex-start', marginTop: '8px' }}>
            View all
          </Button>
        </div>
        <div className={styles.bpRight}>
          <Text className={styles.bpRightTitle}>Recently created blueprints</Text>
          <Text className={styles.bpRightSubtitle}>
            The newest agent blueprints created in your tenant.
          </Text>
          {blueprints.map((bp) => (
            <div key={bp.id} className={styles.bpListItem}>
              <Avatar
                name={bp.displayName}
                size={28}
                shape="square"
                color={getAvatarColor(bp.displayName)}
              />
              <Text className={styles.bpListName}>{bp.displayName}</Text>
              <Text className={styles.bpListCount}>{bpCounts[bp.id] ?? 0} agent{(bpCounts[bp.id] ?? 0) !== 1 ? 's' : ''}</Text>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
