import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  makeStyles,
  tokens,
  Text,
  Card,
  CardHeader,
  Avatar,
  AvatarGroup,
  AvatarGroupItem,
  AvatarGroupPopover,
  Badge,
  Button,
  Link,
  Spinner,
  Divider,
  Tooltip,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbDivider,
  MessageBar,
  MessageBarBody,
} from '@fluentui/react-components';
import {
  CheckmarkCircleFilled,
  DismissCircleFilled,
  HomeRegular,
  ProhibitedRegular,
  ArrowSyncRegular,
  CheckmarkRegular,
  ErrorCircleFilled,
} from '@fluentui/react-icons';
import { CopyButton } from '../../components/shared/CopyButton';
import { getAvatarColor } from '../../components/shared/avatarUtils';
import {
  getAgentById,
  getOwners,
  getSponsors,
  toggleAgentStatus,
} from '../../services/dataService';
import type { AgentIdentity, OwnerSponsorEntry } from '../../models/types';

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    position: 'relative',
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
  grid: {
    display: 'grid',
    gridTemplateColumns: '3fr 2fr',
    gap: '16px',
    alignItems: 'start',
    '@media (max-width: 900px)': {
      gridTemplateColumns: '1fr',
    },
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  card: {
    padding: '16px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '4px',
  },
  cardName: {
    fontSize: '16px',
    fontWeight: 600,
  },
  cardDescription: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground3,
    marginBottom: '12px',
  },
  propTable: {
    display: 'grid',
    gridTemplateColumns: 'auto 8px 1fr',
    gap: '8px 0',
    alignItems: 'center',
    fontSize: '13px',
  },
  propLabel: {
    color: tokens.colorNeutralForeground1,
    whiteSpace: 'nowrap',
    paddingRight: '4px',
  },
  propSeparator: {
    color: tokens.colorNeutralForeground3,
    textAlign: 'center',
  },
  propValue: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    paddingLeft: '4px',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    padding: '60px',
  },
  statusRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  accessMetrics: {
    display: 'flex',
    gap: '24px',
    marginTop: '12px',
  },
  accessMetric: {
    display: 'flex',
    flexDirection: 'column',
    borderLeft: `3px solid ${tokens.colorBrandForeground1}`,
    paddingLeft: '12px',
    flex: 1,
  },
  accessMetricLabel: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
  },
  accessMetricNumber: {
    fontSize: '24px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  monoText: {
    fontFamily: 'monospace',
    fontSize: '12px',
  },
  policyRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
  },
  confirmationBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: '16px 20px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    zIndex: 10,
    boxShadow: tokens.shadow4,
  },
  confirmationTitle: {
    fontSize: '16px',
    fontWeight: 600,
    marginBottom: '4px',
  },
  confirmationText: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground1,
    marginBottom: '12px',
  },
  confirmationActions: {
    display: 'flex',
    gap: '8px',
  },
  disabledBanner: {
    marginBottom: '4px',
  },
});

export function AgentOverviewPage() {
  const styles = useStyles();
  const { objectId } = useParams<{ objectId: string }>();
  const navigate = useNavigate();
  const [agent, setAgent] = useState<AgentIdentity | null>(null);
  const [owners, setOwners] = useState<OwnerSponsorEntry[]>([]);
  const [sponsors, setSponsors] = useState<OwnerSponsorEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const loadData = useCallback(() => {
    if (!objectId) return;
    setLoading(true);
    Promise.all([
      getAgentById(objectId),
      getOwners(objectId),
      getSponsors(objectId),
    ]).then(([a, o, s]) => {
      setAgent(a ?? null);
      setOwners(o);
      setSponsors(s);
      setLoading(false);
    });
  }, [objectId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleStatus = useCallback(async () => {
    if (!objectId) return;
    const updated = await toggleAgentStatus(objectId);
    if (updated) setAgent({ ...updated });
    setShowConfirmation(false);
  }, [objectId]);

  if (loading) {
    return (
      <div className={styles.center}>
        <Spinner label="Loading agent details..." />
      </div>
    );
  }

  if (!agent) {
    return <Text>Agent not found.</Text>;
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
            <BreadcrumbButton onClick={() => navigate('/agents')}>Agent ID | All agent identities</BreadcrumbButton>
          </BreadcrumbItem>
        </Breadcrumb>
        <div className={styles.titleRow}>
          <HomeRegular fontSize={28} style={{ color: tokens.colorBrandForeground1 }} />
          <Text className={styles.title}>{agent.displayName} | Overview</Text>
        </div>
        <Text className={styles.subtitle} block>
          Manage agent access and settings
        </Text>
      </div>

      <Toolbar>
        {agent.status === 'Active' ? (
          <ToolbarButton icon={<ProhibitedRegular />} onClick={() => setShowConfirmation(true)}>
            Disable
          </ToolbarButton>
        ) : (
          <ToolbarButton icon={<CheckmarkRegular />} onClick={() => setShowConfirmation(true)}>
            Enable
          </ToolbarButton>
        )}
        <ToolbarButton icon={<ArrowSyncRegular />} onClick={loadData}>
          Refresh
        </ToolbarButton>
      </Toolbar>

      {showConfirmation && (
        <div className={styles.confirmationBanner}>
          <Text className={styles.confirmationTitle} block>
            {agent.status === 'Active' ? 'Disable' : 'Enable'} {agent.displayName}
          </Text>
          <Text className={styles.confirmationText} block>
            {agent.status === 'Active'
              ? 'Disabling this agent identity will block users from being able to access this agent identity, and will prevent this agent from being issued tokens.'
              : 'Enabling this agent identity will allow users to access this agent identity, and will allow this agent to be issued tokens.'}
          </Text>
          <div className={styles.confirmationActions}>
            <Button
              appearance="primary"
              onClick={handleToggleStatus}
            >
              {agent.status === 'Active' ? 'Disable' : 'Enable'}
            </Button>
            <Button appearance="outline" onClick={() => setShowConfirmation(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {agent.status === 'Disabled' && (
        <MessageBar intent="error" className={styles.disabledBanner}>
          <MessageBarBody>
            This agent identity is disabled, which blocks access and token issuance.
          </MessageBarBody>
        </MessageBar>
      )}

      <div className={styles.grid}>
        {/* Properties Card */}
        <Card className={styles.card}>
          <div className={styles.cardHeader}>
            <Avatar name={agent.displayName} size={40} color={getAvatarColor(agent.displayName)} shape="square" />
            <div>
              <Text className={styles.cardName}>{agent.displayName}</Text>
              <div>
                <Badge appearance="outline" color="informative" shape="rounded">
                  Agent identity
                </Badge>
              </div>
            </div>
          </div>
          <Text className={styles.cardDescription}>No description provided.</Text>

          <div className={styles.propTable}>
            <Text className={styles.propLabel}>Status</Text>
            <Text className={styles.propSeparator}>:</Text>
            <div className={styles.propValue}>
              <div className={styles.statusRow}>
                {agent.status === 'Active' ? (
                  <CheckmarkCircleFilled color={tokens.colorPaletteGreenForeground1} />
                ) : (
                  <DismissCircleFilled color={tokens.colorPaletteRedForeground1} />
                )}
                <Text>{agent.status}</Text>
              </div>
            </div>

            <Text className={styles.propLabel}>Sponsors</Text>
            <Text className={styles.propSeparator}>:</Text>
            <div className={styles.propValue}>
              {sponsors.length > 0 ? (
                <AvatarGroup size={24}>
                  {sponsors.slice(0, 3).map((s) => (
                    <Tooltip key={s.id} content={s.name} relationship="label">
                      <AvatarGroupItem name={s.name} color={getAvatarColor(s.name)} />
                    </Tooltip>
                  ))}
                  {sponsors.length > 3 && (
                    <AvatarGroupPopover>
                      {sponsors.slice(3).map((s) => (
                        <AvatarGroupItem key={s.id} name={s.name} color={getAvatarColor(s.name)} />
                      ))}
                    </AvatarGroupPopover>
                  )}
                </AvatarGroup>
              ) : (
                <Text style={{ fontSize: '13px', color: tokens.colorNeutralForeground3 }}>
                  None assigned
                </Text>
              )}
            </div>

            <Text className={styles.propLabel}>Owners</Text>
            <Text className={styles.propSeparator}>:</Text>
            <div className={styles.propValue}>
              {owners.length > 0 ? (
                <AvatarGroup size={24}>
                  {owners.slice(0, 3).map((o) => (
                    <Tooltip key={o.id} content={o.name} relationship="label">
                      <AvatarGroupItem name={o.name} color={getAvatarColor(o.name)} />
                    </Tooltip>
                  ))}
                  {owners.length > 3 && (
                    <AvatarGroupPopover>
                      {owners.slice(3).map((o) => (
                        <AvatarGroupItem key={o.id} name={o.name} color={getAvatarColor(o.name)} />
                      ))}
                    </AvatarGroupPopover>
                  )}
                </AvatarGroup>
              ) : (
                <Text style={{ fontSize: '13px', color: tokens.colorNeutralForeground3 }}>
                  None assigned
                </Text>
              )}
            </div>

            {agent.blueprintId && (
              <>
                <Text className={styles.propLabel}>Blueprint ID</Text>
                <Text className={styles.propSeparator}>:</Text>
                <div className={styles.propValue}>
                  <Text className={styles.monoText}>{agent.blueprintId}</Text>
                  <CopyButton value={agent.blueprintId} />
                </div>
              </>
            )}

            <Text className={styles.propLabel}>Object ID</Text>
            <Text className={styles.propSeparator}>:</Text>
            <div className={styles.propValue}>
              <Text className={styles.monoText}>{agent.id}</Text>
              <CopyButton value={agent.id} />
            </div>

            {agent.blueprintName && (
              <>
                <Text className={styles.propLabel}>Agent blueprint</Text>
                <Text className={styles.propSeparator}>:</Text>
                <div className={styles.propValue}>
                  <Link>{agent.blueprintName}</Link>
                </div>
              </>
            )}

            <Text className={styles.propLabel}>Created on</Text>
            <Text className={styles.propSeparator}>:</Text>
            <div className={styles.propValue}>
              <Text>
                {new Date(agent.createdDateTime).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                })}
              </Text>
            </div>
          </div>
        </Card>

        {/* Right column */}
        <div className={styles.rightColumn}>
          {/* Agent identity's access */}
          <Card className={styles.card}>
            <CardHeader
              header={<Text className={styles.cardName}>Agent identity's access</Text>}
              action={
                <Button appearance="outline" size="small" disabled>
                  View
                </Button>
              }
            />
            <Text className={styles.cardDescription}>
              View the permissions and Entra roles this agent identity have been granted.
            </Text>
            <div className={styles.accessMetrics}>
              <div className={styles.accessMetric}>
                <Text className={styles.accessMetricLabel}>Permissions</Text>
                <Text className={styles.accessMetricNumber}>0</Text>
              </div>
              <div className={styles.accessMetric}>
                <Text className={styles.accessMetricLabel}>Entra roles</Text>
                <Text className={styles.accessMetricNumber}>0</Text>
              </div>
            </div>
          </Card>

          {/* Policies & ID Governance */}
          <Card className={styles.card}>
            <CardHeader
              header={<Text className={styles.cardName}>Policies &amp; ID Governance</Text>}
            />
            <Text className={styles.cardDescription}>
              Useful links to policies and ID Governance features for this agent identity
            </Text>
            <div className={styles.policyRow}>
              <Text>CA policies</Text>
              <Link>View</Link>
            </div>
            <Divider />
            <div className={styles.policyRow}>
              <Text>Access packages</Text>
              <Link>View</Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
