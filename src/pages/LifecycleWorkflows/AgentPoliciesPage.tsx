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
import { getAgentIdPolicy } from '../../services/dataService';

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
    color: tokens.colorNeutralForeground2,
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

const POLICIES = [
  {
    priority: 1,
    name: 'Privileged agent attestation',
    description: 'Require periodic attestation and recent activity for selected agents.',
    rules: '2 active',
    scope: '3 group(s)',
    created: '2026-03-14',
    modified: '2026-04-20',
  },
  {
    priority: 2,
    name: 'Inactive agents (default)',
    description: 'Disable agent identities inactive for 90 days.',
    rules: '1 active',
    scope: 'All agents',
    created: '2026-03-01',
    modified: '2026-04-12',
  },
];

interface AgentPoliciesTableProps {
  onInactivePolicyClick?: () => void;
}

export function AgentPoliciesTable({ onInactivePolicyClick }: AgentPoliciesTableProps) {
  const styles = useStyles();
  const { experienceTier } = useAppSettings();
  const [inactivePolicyEnabled, setInactivePolicyEnabled] = useState(true);
  const isPremium = experienceTier === 'premium';
  const visiblePolicies = isPremium
    ? POLICIES
    : POLICIES.filter((policy) => policy.name === 'Inactive agents (default)');

  useEffect(() => {
    let ignore = false;
    getAgentIdPolicy().then((policy) => {
      if (!ignore) setInactivePolicyEnabled(policy.enabled);
    });
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className={styles.premiumContent}>
      <div className={styles.toolbar}>
        <Input
          className={styles.search}
          contentBefore={<SearchRegular />}
          placeholder="Search policies..."
        />
        {isPremium && (
          <Button appearance="primary" icon={<AddRegular />}>
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
              <tr className={styles.row} key={policy.priority}>
                <td className={styles.cell}>
                  <div className={styles.priorityCell}>
                    <span>{index + 1}</span>
                    {isPremium && (
                      <span className={styles.priorityArrows} aria-hidden="true">
                        <ArrowUpRegular fontSize={16} />
                        <ArrowDownRegular fontSize={16} />
                      </span>
                    )}
                  </div>
                </td>
                <td className={styles.cell}>
                  <button
                    className={styles.policyName}
                    type="button"
                    onClick={
                      policy.name === 'Inactive agents (default)'
                        ? onInactivePolicyClick
                        : undefined
                    }
                  >
                    {policy.name}
                  </button>
                  <Text className={styles.policyDescription}>{policy.description}</Text>
                </td>
                <td className={styles.cell}>
                  <span
                    className={`${styles.status} ${
                      policy.name === 'Inactive agents (default)' && !inactivePolicyEnabled
                        ? styles.statusDisabled
                        : ''
                    }`}
                  >
                    {policy.name === 'Inactive agents (default)' && !inactivePolicyEnabled
                      ? 'Disabled'
                      : 'Enabled'}
                  </span>
                </td>
                <td className={styles.cell}>{policy.rules}</td>
                <td className={styles.cell}>{policy.scope}</td>
                <td className={`${styles.cell} ${styles.date}`}>{policy.created}</td>
                <td className={`${styles.cell} ${styles.date}`}>{policy.modified}</td>
                <td className={styles.cell}>
                  <Button
                    appearance="subtle"
                    className={styles.deleteButton}
                    icon={<DeleteRegular />}
                    aria-label={`Delete ${policy.name}`}
                    disabled={policy.name === 'Inactive agents (default)'}
                  />
                </td>
              </tr>
            ))}
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
        <AgentPoliciesTable />
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