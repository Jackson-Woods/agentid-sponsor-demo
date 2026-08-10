import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbButton,
  BreadcrumbDivider,
  BreadcrumbItem,
  Button,
  Link,
  makeStyles,
  Spinner,
  Switch,
  Text,
  tokens,
} from '@fluentui/react-components';
import {
  ArrowSyncRegular,
  DismissRegular,
  InfoRegular,
  SettingsRegular,
} from '@fluentui/react-icons';
import { useAppSettings } from '../../AppSettingsContext';
import { AgentPickerDialog } from '../../components/PeoplePicker/AgentPickerDialog';
import type { AgentIdLifecyclePolicy } from '../../models/types';
import { getAgentIdPolicy, updateAgentIdPolicy } from '../../services/dataService';
import { PolicyScopePicker } from '../LifecycleWorkflows/policyParts/PolicyScopePicker';

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  topRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  titleStack: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '20px',
    fontWeight: 400,
    color: tokens.colorNeutralForeground1,
    lineHeight: '24px',
  },
  titleStrong: {
    fontWeight: 600,
  },
  subtitle: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
  },
  closeButton: {
    minWidth: 'auto',
  },
  card: {
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: '4px',
    padding: '24px 28px',
    maxWidth: '760px',
    marginTop: '8px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '4px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: 600,
  },
  cardDescription: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground2,
    marginBottom: '16px',
  },
  defaultBehaviorText: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground1,
    display: 'block',
    marginBottom: '4px',
  },
  enableRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '12px',
  },
  infoBar: {
    backgroundColor: tokens.colorNeutralBackground3,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: '4px',
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    fontSize: '13px',
    color: tokens.colorNeutralForeground1,
    marginTop: '8px',
    marginBottom: '8px',
  },
  infoIcon: {
    color: tokens.colorBrandForeground1,
    fontSize: '16px',
    flexShrink: 0,
    marginTop: '1px',
  },
  buttonRow: {
    display: 'flex',
    gap: '8px',
    marginTop: '24px',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    padding: '40px',
  },
});

export function AgentLifecyclePolicyPage() {
  const styles = useStyles();
  const navigate = useNavigate();
  const { showDefaultDisableUx } = useAppSettings();
  const [policy, setPolicy] = useState<AgentIdLifecyclePolicy | null>(null);
  const [draft, setDraft] = useState<AgentIdLifecyclePolicy | null>(null);
  const [saving, setSaving] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const load = async () => {
    const nextPolicy = await getAgentIdPolicy();
    setPolicy(nextPolicy);
    setDraft(nextPolicy);
  };

  useEffect(() => {
    load();
  }, []);

  if (!showDefaultDisableUx) {
    return <Navigate to="/" replace />;
  }

  const isDirty =
    policy !== null &&
    draft !== null &&
    JSON.stringify(policy) !== JSON.stringify(draft);

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    const updated = await updateAgentIdPolicy(draft);
    setPolicy(updated);
    setDraft(updated);
    setSaving(false);
  };

  return (
    <div className={styles.page}>
      <Breadcrumb size="small">
        <BreadcrumbItem>
          <BreadcrumbButton onClick={() => navigate('/home')}>Home</BreadcrumbButton>
        </BreadcrumbItem>
        <BreadcrumbDivider />
        <BreadcrumbItem>
          <BreadcrumbButton current onClick={() => navigate('/')}>
            Agents
          </BreadcrumbButton>
        </BreadcrumbItem>
      </Breadcrumb>

      <div className={styles.topRow}>
        <div className={styles.titleRow}>
          <SettingsRegular fontSize={28} style={{ color: tokens.colorBrandForeground1 }} />
          <div className={styles.titleStack}>
            <Text className={styles.title}>
              <span className={styles.titleStrong}>Agents</span> | Agent lifecycle (Preview)
            </Text>
            <Text className={styles.subtitle}>Identity Governance</Text>
          </div>
        </div>
        <Button
          appearance="subtle"
          icon={<DismissRegular />}
          aria-label="Close"
          className={styles.closeButton}
          onClick={() => navigate('/')}
        />
      </div>

      {draft === null ? (
        <div className={styles.loading}>
          <Spinner />
        </div>
      ) : (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Text className={styles.cardTitle}>Inactive agent policy</Text>
            <Button
              appearance="subtle"
              icon={<ArrowSyncRegular />}
              aria-label="Refresh"
              onClick={load}
            />
          </div>
          <Text className={styles.cardDescription}>
            Configure whether inactive agents are automatically disabled for your organization.{' '}
            <Link href="#" inline>
              Learn more
            </Link>
          </Text>

          <Text className={styles.defaultBehaviorText}>
            By default, agent identities are disabled after 90 days of inactivity and deleted after
            180 days of inactivity.
          </Text>

          <div className={styles.enableRow}>
            <Switch
              checked={draft.enabled}
              onChange={(_, data) => setDraft({ ...draft, enabled: data.checked })}
              label="Automatically disable inactive agent identities"
            />
          </div>

          <div className={styles.infoBar} role="status">
            <InfoRegular className={styles.infoIcon} />
            <Text style={{ flex: 1 }}>
              Email notifications will be sent 30 days prior to the agent identity being disabled.
              Responsible party must have an Exchange license to receive notification emails.
            </Text>
          </div>

          <PolicyScopePicker
            scope={draft.scope}
            selectedAgentIds={draft.selectedAgentIds}
            disabled={!draft.enabled}
            availableScopes={['All', 'Exclude']}
            onChangeScope={(scope) => setDraft({ ...draft, scope })}
            onOpenPicker={() => setPickerOpen(true)}
          />

          <div className={styles.infoBar} role="status">
            <InfoRegular className={styles.infoIcon} />
            <Text style={{ flex: 1 }}>
              Customers with an A365 or E7 license can use Lifecycle Policies in Entra Identity Governance to manage agent lifecycles with additional options.{' '}
              <Link
                href="#/lifecycle-workflows/agent-id-policy"
                inline
                onClick={(event) => {
                  event.preventDefault();
                  navigate('/lifecycle-workflows/agent-id-policy');
                }}
              >
                Use lifecycle policies to craft custom policies
              </Link>
            </Text>
          </div>

          <div className={styles.buttonRow}>
            <Button appearance="primary" disabled={!isDirty || saving} onClick={handleSave}>
              Save
            </Button>
            <Button disabled={!isDirty || saving} onClick={() => setDraft(policy)}>
              Discard
            </Button>
          </div>
        </div>
      )}

      <AgentPickerDialog
        isOpen={pickerOpen}
        initialSelectedIds={draft?.selectedAgentIds ?? []}
        onClose={() => setPickerOpen(false)}
        onConfirm={(ids) => {
          if (draft) {
            setDraft({ ...draft, selectedAgentIds: ids });
          }
          setPickerOpen(false);
        }}
      />
    </div>
  );
}