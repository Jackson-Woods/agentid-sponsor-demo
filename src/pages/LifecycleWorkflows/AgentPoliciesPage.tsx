import { useEffect, useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbButton,
  BreadcrumbDivider,
  BreadcrumbItem,
  Button,
  Input,
  makeStyles,
  Text,
  tokens,
} from '@fluentui/react-components';
import {
  AddRegular,
  ArrowDownRegular,
  ArrowUpRegular,
  DeleteRegular,
  LockClosedRegular,
  SearchRegular,
} from '@fluentui/react-icons';
import { useNavigate } from 'react-router-dom';
import { useAppSettings } from '../../AppSettingsContext';
import type { AgentIdLifecyclePolicy, AgentLifecyclePolicy } from '../../models/types';
import {
  getAgentIdPolicy,
  getAgentLifecyclePolicies,
  moveAgentLifecyclePolicy,
} from '../../services/dataService';

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
  },
  headingBand: {
    paddingBottom: '16px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  title: {
    display: 'block',
    marginTop: '14px',
    fontSize: '24px',
    lineHeight: '32px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  subtitle: {
    display: 'block',
    marginTop: '2px',
    fontSize: '13px',
    color: tokens.colorNeutralForeground2,
  },
  premiumContent: {
    paddingTop: '24px',
  },
  toolbar: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 384px) auto',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    marginBottom: '16px',
  },
  search: {
    width: '100%',
  },
  tableFrame: {
    overflowX: 'auto',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: '8px',
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow2,
  },
  table: {
    width: '100%',
    minWidth: '900px',
    borderCollapse: 'collapse',
    tableLayout: 'fixed',
  },
  tableHeader: {
    height: '48px',
    color: tokens.colorNeutralForeground2,
    fontSize: '13px',
    fontWeight: 600,
    textAlign: 'left',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  headerCell: {
    padding: '0 12px',
  },
  row: {
    height: '72px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    ':last-child': {
      borderBottom: 'none',
    },
  },
  cell: {
    padding: '10px 12px',
    fontSize: '13px',
    color: tokens.colorNeutralForeground1,
    verticalAlign: 'middle',
  },
  priorityCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  priorityArrows: {
    display: 'flex',
    flexDirection: 'column',
  },
  priorityButton: {
    minWidth: '20px',
    width: '20px',
    height: '18px',
    padding: 0,
  },
  policyName: {
    display: 'block',
    border: 'none',
    background: 'transparent',
    padding: 0,
    color: tokens.colorBrandForegroundLink,
    fontSize: '14px',
    cursor: 'pointer',
    textAlign: 'left',
  },
  policyDescription: {
    display: 'block',
    marginTop: '2px',
    color: tokens.colorNeutralForeground3,
    fontSize: '12px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  status: {
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: '22px',
    padding: '0 12px',
    borderRadius: '12px',
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    fontSize: '12px',
    fontWeight: 600,
  },
  statusDisabled: {
    backgroundColor: tokens.colorNeutralBackground5,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    color: '#000000',
  },
  date: {
    color: tokens.colorNeutralForeground3,
    whiteSpace: 'nowrap',
  },
  deleteButton: {
    minWidth: '32px',
    color: tokens.colorNeutralForeground3,
  },
  footnote: {
    display: 'block',
    marginTop: '16px',
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
  },
  licenseNotice: {
    maxWidth: '720px',
    marginTop: '24px',
    padding: '24px',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: '8px',
    backgroundColor: tokens.colorNeutralBackground1,
  },
  noticeHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  lockBox: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorBrandForeground1,
  },
  noticeTitle: {
    fontSize: '18px',
    fontWeight: 600,
  },
  noticeBody: {
    marginTop: '16px',
    fontSize: '14px',
    lineHeight: '20px',
    color: tokens.colorNeutralForeground1,
  },
  capabilitiesTitle: {
    display: 'block',
    marginTop: '18px',
    fontSize: '14px',
    fontWeight: 600,
  },
  capabilities: {
    marginTop: '8px',
    marginBottom: 0,
    paddingLeft: '22px',
    color: tokens.colorNeutralForeground1,
    fontSize: '14px',
    lineHeight: '24px',
  },
  noticeActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '24px',
  },
});

interface AgentPoliciesTableProps {
  onNewPolicyClick?: () => void;
  onInactivePolicyClick?: () => void;
}

function formatDate(value: string): string {
  return value.slice(0, 10);
}

function formatScope(policy: AgentLifecyclePolicy): string {
  if (policy.scope === 'All') return 'All agents';
  const prefix = policy.scope === 'Exclude' ? 'Exclude' : 'Include';
  return `${prefix} ${policy.selectedAgentIds.length}`;
}

export function AgentPoliciesTable({
  onNewPolicyClick,
  onInactivePolicyClick,
}: AgentPoliciesTableProps) {
  const styles = useStyles();
  const { experienceTier } = useAppSettings();
  const [customPolicies, setCustomPolicies] = useState<AgentLifecyclePolicy[]>([]);
  const [inactivePolicy, setInactivePolicy] = useState<AgentIdLifecyclePolicy | null>(null);
  const isPremium = experienceTier === 'premium';

  useEffect(() => {
    let ignore = false;
    Promise.all([getAgentLifecyclePolicies(), getAgentIdPolicy()]).then(([policies, defaultPolicy]) => {
      if (!ignore) {
        setCustomPolicies(policies);
        setInactivePolicy(defaultPolicy);
      }
    });
    return () => {
      ignore = true;
    };
  }, []);

  const handleMove = async (policyId: string, direction: 'up' | 'down') => {
    setCustomPolicies(await moveAgentLifecyclePolicy(policyId, direction));
  };

  const visiblePolicies = isPremium ? customPolicies : [];

  return (
    <div className={styles.premiumContent}>
      <div className={styles.toolbar}>
        <Input
          className={styles.search}
          contentBefore={<SearchRegular />}
          placeholder="Search policies..."
        />
        {isPremium && (
          <Button appearance="primary" icon={<AddRegular />} onClick={onNewPolicyClick}>
            New policy
          </Button>
        )}
      </div>

      <div className={styles.tableFrame}>
        <table className={styles.table} aria-label="Agent lifecycle policies">
          <colgroup>
            <col style={{ width: '96px' }} />
            <col style={{ width: '36%' }} />
            <col style={{ width: '102px' }} />
            <col style={{ width: '82px' }} />
            <col style={{ width: '98px' }} />
            <col style={{ width: '108px' }} />
            <col style={{ width: '116px' }} />
            <col style={{ width: '48px' }} />
          </colgroup>
          <thead>
            <tr className={styles.tableHeader}>
              <th className={styles.headerCell}>Priority</th>
              <th className={styles.headerCell}>Name</th>
              <th className={styles.headerCell}>Status</th>
              <th className={styles.headerCell}>Rules</th>
              <th className={styles.headerCell}>Scope</th>
              <th className={styles.headerCell}>Created</th>
              <th className={styles.headerCell}>Modified</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {visiblePolicies.map((policy, index) => (
              <tr className={styles.row} key={policy.id}>
                <td className={styles.cell}>
                  <div className={styles.priorityCell}>
                    <span>{index + 1}</span>
                    <span className={styles.priorityArrows}>
                      <Button
                        appearance="subtle"
                        className={styles.priorityButton}
                        icon={<ArrowUpRegular fontSize={16} />}
                        aria-label={`Move ${policy.name} up`}
                        disabled={index === 0}
                        onClick={() => handleMove(policy.id, 'up')}
                      />
                      <Button
                        appearance="subtle"
                        className={styles.priorityButton}
                        icon={<ArrowDownRegular fontSize={16} />}
                        aria-label={`Move ${policy.name} down`}
                        disabled={index === customPolicies.length - 1}
                        onClick={() => handleMove(policy.id, 'down')}
                      />
                      </span>
                  </div>
                </td>
                <td className={styles.cell}>
                  <span className={styles.policyName}>
                    {policy.name}
                  </span>
                  <Text className={styles.policyDescription}>{policy.description}</Text>
                </td>
                <td className={styles.cell}>
                  <span className={`${styles.status} ${!policy.enabled ? styles.statusDisabled : ''}`}>
                    {policy.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </td>
                <td className={styles.cell}>1 active</td>
                <td className={styles.cell}>{formatScope(policy)}</td>
                <td className={`${styles.cell} ${styles.date}`}>{formatDate(policy.createdDateTime)}</td>
                <td className={`${styles.cell} ${styles.date}`}>{formatDate(policy.lastModifiedDateTime)}</td>
                <td className={styles.cell}>
                  <Button
                    appearance="subtle"
                    className={styles.deleteButton}
                    icon={<DeleteRegular />}
                    aria-label={`Delete ${policy.name}`}
                  />
                </td>
              </tr>
            ))}
            {inactivePolicy && (
              <tr className={styles.row} key="inactive-agents-default">
                <td className={styles.cell}>
                  <div className={styles.priorityCell}>
                    <span>{visiblePolicies.length + 1}</span>
                    {isPremium && (
                      <span className={styles.priorityArrows}>
                        <Button
                          appearance="subtle"
                          className={styles.priorityButton}
                          icon={<ArrowUpRegular fontSize={16} />}
                          aria-label="Move Inactive agents (default) up"
                          disabled
                        />
                        <Button
                          appearance="subtle"
                          className={styles.priorityButton}
                          icon={<ArrowDownRegular fontSize={16} />}
                          aria-label="Move Inactive agents (default) down"
                          disabled
                        />
                      </span>
                    )}
                  </div>
                </td>
                <td className={styles.cell}>
                  <button className={styles.policyName} type="button" onClick={onInactivePolicyClick}>
                    Inactive agents (default)
                  </button>
                  <Text className={styles.policyDescription}>
                    Disable agent identities inactive for 90 days.
                  </Text>
                </td>
                <td className={styles.cell}>
                  <span className={`${styles.status} ${!inactivePolicy.enabled ? styles.statusDisabled : ''}`}>
                    {inactivePolicy.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </td>
                <td className={styles.cell}>1 active</td>
                <td className={styles.cell}>All agents</td>
                <td className={`${styles.cell} ${styles.date}`}>{formatDate(inactivePolicy.createdDateTime)}</td>
                <td className={`${styles.cell} ${styles.date}`}>{formatDate(inactivePolicy.lastModifiedDateTime)}</td>
                <td className={styles.cell}>
                  <Button
                    appearance="subtle"
                    className={styles.deleteButton}
                    icon={<DeleteRegular />}
                    aria-label="Delete Inactive agents (default)"
                    disabled
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Text className={styles.footnote}>
        Policies are evaluated in priority order. Higher priority policies take precedence.
      </Text>
    </div>
  );
}

export function AgentIdPolicyPage() {
  const styles = useStyles();
  const navigate = useNavigate();
  const { experienceTier } = useAppSettings();
  const isPremium = experienceTier === 'premium';

  return (
    <div className={styles.page}>
      <div className={styles.headingBand}>
        <Breadcrumb size="small">
          <BreadcrumbItem>
            <BreadcrumbButton onClick={() => navigate('/lifecycle-workflows')}>
              Lifecycle workflows
            </BreadcrumbButton>
          </BreadcrumbItem>
          <BreadcrumbDivider />
          <BreadcrumbItem>
            <BreadcrumbButton onClick={() => navigate('/lifecycle-workflows/agent-id-policy')}>
              Policies
            </BreadcrumbButton>
          </BreadcrumbItem>
          <BreadcrumbDivider />
          <BreadcrumbItem>
            <BreadcrumbButton current>Agent lifecycle policies</BreadcrumbButton>
          </BreadcrumbItem>
        </Breadcrumb>
        <Text className={styles.title}>Agent Lifecycle Policies</Text>
        <Text className={styles.subtitle}>
          Create and manage lifecycle policies for agent user accounts.
        </Text>
      </div>

      {isPremium ? (
        <AgentPoliciesTable
          onNewPolicyClick={() => navigate('/lifecycle-workflows/agent-id-policy/new')}
          onInactivePolicyClick={() =>
            navigate('/lifecycle-workflows/agent-id-policy/inactive')
          }
        />
      ) : (
        <div className={styles.licenseNotice} role="status">
          <div className={styles.noticeHeader}>
            <span className={styles.lockBox}>
              <LockClosedRegular fontSize={22} />
            </span>
            <Text className={styles.noticeTitle}>Premium license required</Text>
          </div>
          <div className={styles.noticeBody}>
            This experience requires a premium license. Upgrade to premium to configure and manage
            agent lifecycle policies.
          </div>
          <Text className={styles.capabilitiesTitle}>Premium capabilities include</Text>
          <ul className={styles.capabilities}>
            <li>Policy configuration and scoped targeting</li>
            <li>Advanced lifecycle rules and actions</li>
            <li>Priority and workflow policy management</li>
          </ul>
          <div className={styles.noticeActions}>
            <Button appearance="primary">Get premium license</Button>
            <Button appearance="secondary">Learn more</Button>
          </div>
        </div>
      )}
    </div>
  );
}