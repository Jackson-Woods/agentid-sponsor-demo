import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  makeStyles,
  tokens,
  Text,
  Card,
  Button,
  Spinner,
  Avatar,
  Link,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbDivider,
} from '@fluentui/react-components';
import {
  DeleteRegular,
  ChatHelpRegular,
  InfoRegular,
  PeopleRegular,
  PersonRegular,
  PeopleListRegular,
} from '@fluentui/react-icons';
import { getGroupById, deleteGroups } from '../../services/dataService';
import { ToastContainer } from '../../components/shared/Toast';
import type { ToastMessage } from '../../components/shared/Toast';
import { getGroupTypeLabel } from '../../models/types';
import { CopyButton } from '../../components/shared/CopyButton';
import { getAvatarColor } from '../../components/shared/avatarUtils';
import type { DummyGroup } from '../../models/types';

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  headerText: {
    display: 'flex',
    flexDirection: 'column',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
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
  tabBar: {
    display: 'flex',
    gap: '0',
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
    marginTop: '-22px',
  },
  tabActive: {
    padding: '20px 0 10px 0',
    fontSize: '14px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    borderBottom: `2px solid ${tokens.colorBrandForeground1}`,
  },

  // Basic information section
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  basicInfo: {
    display: 'flex',
    gap: '24px',
    alignItems: 'flex-start',
  },
  avatarBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '20px',
  },
  avatarInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  avatarName: {
    fontSize: '16px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  avatarDesc: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground3,
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0',
    width: '100%',
  },
  detailColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  detailRow: {
    display: 'flex',
    gap: '16px',
    alignItems: 'baseline',
  },
  detailLabel: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground3,
    minWidth: '140px',
    flexShrink: 0,
  },
  detailValue: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground1,
  },
  detailValueBlue: {
    fontSize: '13px',
    color: tokens.colorBrandForeground1,
    cursor: 'pointer',
  },

  // Feed section
  feedGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '16px',
  },
  feedCard: {
    padding: '20px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
  },
  feedCardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  feedCardTitle: {
    fontSize: '14px',
    fontWeight: 600,
  },
  feedCardCount: {
    fontSize: '20px',
    fontWeight: 700,
  },
  feedCardLink: {
    fontSize: '13px',
  },

  // Group links
  groupLinks: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
  },
  groupLinkItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
  },
  groupLinkIcon: {
    width: '28px',
    height: '28px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 700,
    color: '#ffffff',
    flexShrink: 0,
  },
  confirmBanner: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    padding: '12px 0',
    backgroundColor: tokens.colorNeutralBackground1,
    position: 'relative' as const,
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
});

/** Generate deterministic mock numbers from a group ID. */
function mockCounts(id: string) {
  // simple hash from id
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  const abs = Math.abs(h);
  const totalMembers = (abs % 12) + 1;
  const owners = ((abs >> 4) % 4) + 1;
  const groupMemberships = (abs >> 8) % 3;
  return { totalMembers, owners, groupMemberships, users: totalMembers, groups: 0, devices: 0, others: 0 };
}

function mockCreatedDate(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  const abs = Math.abs(h);
  const month = (abs % 12) + 1;
  const day = (abs % 28) + 1;
  const hour = abs % 12;
  const minute = (abs >> 4) % 60;
  const ampm = abs % 2 === 0 ? 'AM' : 'PM';
  return `${month}/${day}/2023, ${hour === 0 ? 12 : hour}:${String(minute).padStart(2, '0')} ${ampm}`;
}

function isTeamsGroup(group: DummyGroup): boolean {
  // Treat groups with "Team" in description or certain well-known M365 groups as Teams-connected
  const label = getGroupTypeLabel(group);
  if (label !== 'Microsoft 365' && label !== 'Dynamic Microsoft 365') return false;
  // Simple heuristic: first 3 M365 groups have Teams, rest don't
  const teamsGroups = ['Social Marketing', 'Product Design Team', 'APAC Regional Office'];
  return teamsGroups.includes(group.displayName);
}

function getTypeLabel(group: DummyGroup): string {
  const label = getGroupTypeLabel(group);
  if (label === 'Microsoft 365' || label === 'Dynamic Microsoft 365') return 'Microsoft 365';
  return 'Security';
}

function getMembershipType(group: DummyGroup): string {
  const label = getGroupTypeLabel(group);
  if (label.startsWith('Dynamic')) return 'Dynamic';
  return 'Assigned';
}

export function GroupDetailPage() {
  const styles = useStyles();
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [group, setGroup] = useState<DummyGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    if (!groupId) return;
    getGroupById(groupId).then((g) => {
      setGroup(g ?? null);
      setLoading(false);
    });
  }, [groupId]);

  const counts = useMemo(() => (group ? mockCounts(group.id) : null), [group]);
  const createdOn = useMemo(() => (group ? mockCreatedDate(group.id) : ''), [group]);

  const handleDeleteClick = () => setShowConfirm(true);

  const handleDeleteConfirm = async () => {
    if (!group) return;
    const name = group.displayName;
    await deleteGroups([group.id]);
    setShowConfirm(false);
    setToasts((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: 'Group successfully deleted',
        message: `${name} has been deleted. Recent changes may take some time to appear.`,
        variant: 'success' as const,
      },
    ]);
  };

  const handleDeleteCancel = () => setShowConfirm(false);

  const dismissToast = (id: string) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  if (loading) {
    return (
      <div className={styles.center}>
        <Spinner label="Loading group..." />
      </div>
    );
  }

  if (!group || !counts) {
    return (
      <div className={styles.center}>
        <Text>Group not found.</Text>
      </div>
    );
  }

  const typeLabel = getTypeLabel(group);
  const isM365 = typeLabel === 'Microsoft 365';
  const hasTeam = isTeamsGroup(group);

  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <div>
        <Breadcrumb size="small">
          <BreadcrumbItem>
            <BreadcrumbButton onClick={() => navigate('/home')}>Home</BreadcrumbButton>
          </BreadcrumbItem>
          <BreadcrumbDivider />
          <BreadcrumbItem>
            <BreadcrumbButton onClick={() => navigate('/groups/all')}>Groups | All groups</BreadcrumbButton>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Title */}
        <div className={styles.header}>
          <div className={styles.headerText}>
            <div className={styles.titleRow}>
              <InfoRegular fontSize={24} style={{ color: tokens.colorBrandForeground1 }} />
              <Text className={styles.title}>{group.displayName}</Text>
            </div>
            <Text className={styles.subtitle}>Group</Text>
          </div>
        </div>
      </div>

      {/* Command bar */}
      <Toolbar>
        <ToolbarButton icon={<DeleteRegular />} onClick={handleDeleteClick}>
          Delete
        </ToolbarButton>
        <ToolbarDivider />
        <ToolbarButton icon={<ChatHelpRegular />} disabled>
          Got feedback?
        </ToolbarButton>
      </Toolbar>

      {/* Delete confirmation banner */}
      {showConfirm && (
        <div className={styles.confirmBanner}>
          <Text className={styles.confirmText}>Delete this group?</Text>
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

      {/* Tab bar */}
      <div className={styles.tabBar}>
        <button className={styles.tabActive}>Overview</button>
      </div>

      {/* Basic information */}
      <Text className={styles.sectionTitle} block>Basic information</Text>

      <div className={styles.avatarBlock}>
        <Avatar
          name={group.displayName}
          size={72}
          shape="square"
          color={getAvatarColor(group.displayName)}
        />
        <div className={styles.avatarInfo}>
          <span className={styles.avatarName}>
            {group.displayName}
            <CopyButton value={group.displayName} />
          </span>
          {group.description && (
            <Text className={styles.avatarDesc}>{group.description}</Text>
          )}
        </div>
      </div>

      <div className={styles.detailGrid}>
        {/* Left column */}
        <div className={styles.detailColumn}>
          <div className={styles.detailRow}>
            <Text className={styles.detailLabel}>Membership type</Text>
            <Text className={styles.detailValue}>{getMembershipType(group)}</Text>
          </div>
          <div className={styles.detailRow}>
            <Text className={styles.detailLabel}>Source</Text>
            <Text className={styles.detailValue}>Cloud</Text>
          </div>
          <div className={styles.detailRow}>
            <Text className={styles.detailLabel}>Type</Text>
            <Text className={styles.detailValue}>{typeLabel}</Text>
          </div>
          <div className={styles.detailRow}>
            <Text className={styles.detailLabel}>Object ID</Text>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Text className={styles.detailValue}>{group.id}</Text>
              <CopyButton value={group.id} />
            </span>
          </div>
          <div className={styles.detailRow}>
            <Text className={styles.detailLabel}>Created on</Text>
            <Text className={styles.detailValue}>{createdOn}</Text>
          </div>
          {group.mail && (
            <div className={styles.detailRow}>
              <Text className={styles.detailLabel}>Email</Text>
              <Text className={styles.detailValue}>{group.mail}</Text>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className={styles.detailColumn}>
          <div className={styles.detailRow}>
            <Text className={styles.detailLabel}>Total direct members</Text>
            <Text className={styles.detailValueBlue}>{counts.totalMembers}</Text>
          </div>
          <div className={styles.detailRow}>
            <Text className={styles.detailLabel}>User(s)</Text>
            <Text className={styles.detailValueBlue}>{counts.users}</Text>
          </div>
          <div className={styles.detailRow}>
            <Text className={styles.detailLabel}>Group(s)</Text>
            <Text className={styles.detailValueBlue}>{counts.groups}</Text>
          </div>
          <div className={styles.detailRow}>
            <Text className={styles.detailLabel}>Device(s)</Text>
            <Text className={styles.detailValueBlue}>{counts.devices}</Text>
          </div>
          <div className={styles.detailRow}>
            <Text className={styles.detailLabel}>Other(s)</Text>
            <Text className={styles.detailValueBlue}>{counts.others}</Text>
          </div>
        </div>
      </div>

      {/* Feed */}
      <Text className={styles.sectionTitle} block>Feed</Text>
      <div className={styles.feedGrid}>
        <Card className={styles.feedCard}>
          <Avatar icon={<PeopleListRegular />} size={40} color="brand" shape="square" />
          <div className={styles.feedCardContent}>
            <Text className={styles.feedCardTitle}>Group memberships</Text>
            <Text className={styles.feedCardCount}>{counts.groupMemberships}</Text>
            <Link className={styles.feedCardLink}>View group memberships</Link>
          </div>
        </Card>

        <Card className={styles.feedCard}>
          <Avatar icon={<PersonRegular />} size={40} color="brand" shape="square" />
          <div className={styles.feedCardContent}>
            <Text className={styles.feedCardTitle}>Owners</Text>
            <Text className={styles.feedCardCount}>{counts.owners}</Text>
            <Link className={styles.feedCardLink}>View group owners</Link>
          </div>
        </Card>

        <Card className={styles.feedCard}>
          <Avatar icon={<PeopleRegular />} size={40} color="brand" shape="square" />
          <div className={styles.feedCardContent}>
            <Text className={styles.feedCardTitle}>Total members</Text>
            <Text className={styles.feedCardCount}>{counts.totalMembers}</Text>
            <Link className={styles.feedCardLink}>View group members</Link>
          </div>
        </Card>
      </div>

      {/* Group links — only for M365 groups */}
      {isM365 && (
        <>
          <Text className={styles.sectionTitle} block>Group links</Text>
          <div className={styles.groupLinks}>
            <span className={styles.groupLinkItem}>
              <span className={styles.groupLinkIcon} style={{ backgroundColor: '#0078d4' }}>O</span>
              <Link>Outlook ↗</Link>
            </span>
            <span className={styles.groupLinkItem}>
              <span className={styles.groupLinkIcon} style={{ backgroundColor: '#038387' }}>S</span>
              <Link>SharePoint ↗</Link>
            </span>
            {hasTeam && (
              <span className={styles.groupLinkItem}>
                <span className={styles.groupLinkIcon} style={{ backgroundColor: '#6264a7' }}>T</span>
                <Link>Teams ↗</Link>
              </span>
            )}
          </div>
        </>
      )}

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
