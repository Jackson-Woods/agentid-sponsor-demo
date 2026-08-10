import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Button,
  Field,
  Input,
  makeStyles,
  Switch,
  Text,
  tokens,
} from '@fluentui/react-components';
import { useAppSettings } from '../../AppSettingsContext';
import { AgentPickerDialog } from '../../components/PeoplePicker/AgentPickerDialog';
import type { LifecyclePolicyScope } from '../../models/types';
import { createAgentLifecyclePolicy } from '../../services/dataService';
import { PolicyScopePicker } from './policyParts/PolicyScopePicker';

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  title: {
    fontSize: '24px',
    lineHeight: '32px',
    fontWeight: 600,
  },
  subtitle: {
    color: tokens.colorNeutralForeground2,
    fontSize: '13px',
  },
  form: {
    width: 'min(680px, 100%)',
    padding: '24px 28px',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: '4px',
    backgroundColor: tokens.colorNeutralBackground1,
  },
  nameField: {
    maxWidth: '440px',
  },
  enabledRow: {
    marginTop: '20px',
  },
  actions: {
    display: 'flex',
    gap: '8px',
    marginTop: '28px',
  },
});

interface NewAgentPolicyPageProps {
  returnPath: string;
  requireAgentsFeature?: boolean;
}

export function NewAgentPolicyPage({
  returnPath,
  requireAgentsFeature = false,
}: NewAgentPolicyPageProps) {
  const styles = useStyles();
  const navigate = useNavigate();
  const { experienceTier, showDefaultDisableUx } = useAppSettings();
  const [name, setName] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [scope, setScope] = useState<LifecyclePolicyScope>('All');
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  if (experienceTier !== 'premium') {
    return <Navigate to={returnPath} replace />;
  }

  if (requireAgentsFeature && !showDefaultDisableUx) {
    return <Navigate to="/" replace />;
  }

  const requiresSelection = scope !== 'All';
  const canSave = name.trim().length > 0 && (!requiresSelection || selectedAgentIds.length > 0);

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    await createAgentLifecyclePolicy({
      name: name.trim(),
      enabled,
      scope,
      selectedAgentIds: scope === 'All' ? [] : selectedAgentIds,
    });
    navigate(returnPath);
  };

  return (
    <div className={styles.page}>
      <div>
        <Text className={styles.title} block>New agent lifecycle policy</Text>
        <Text className={styles.subtitle} block>
          Configure the policy state and the agent identities it applies to.
        </Text>
      </div>

      <div className={styles.form}>
        <Field className={styles.nameField} label="Policy name" required>
          <Input
            value={name}
            onChange={(_, data) => setName(data.value)}
            placeholder="Enter a policy name"
          />
        </Field>

        <div className={styles.enabledRow}>
          <Switch
            checked={enabled}
            onChange={(_, data) => setEnabled(data.checked)}
            label={enabled ? 'Enabled' : 'Disabled'}
          />
        </div>

        <PolicyScopePicker
          scope={scope}
          selectedAgentIds={selectedAgentIds}
          onChangeScope={setScope}
          onOpenPicker={() => setPickerOpen(true)}
          availableScopes={['All', 'Exclude', 'Specific']}
        />

        <div className={styles.actions}>
          <Button appearance="primary" disabled={!canSave || saving} onClick={handleSave}>
            Save
          </Button>
          <Button disabled={saving} onClick={() => navigate(returnPath)}>
            Cancel
          </Button>
        </div>
      </div>

      <AgentPickerDialog
        isOpen={pickerOpen}
        initialSelectedIds={selectedAgentIds}
        onClose={() => setPickerOpen(false)}
        onConfirm={(ids) => {
          setSelectedAgentIds(ids);
          setPickerOpen(false);
        }}
      />
    </div>
  );
}