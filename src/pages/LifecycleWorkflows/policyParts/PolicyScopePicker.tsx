import { makeStyles, tokens, Text, Radio, RadioGroup } from '@fluentui/react-components';
import { AddRegular } from '@fluentui/react-icons';
import type { LifecyclePolicyScope } from '../../../models/types';

const useStyles = makeStyles({
  sectionTitle: {
    fontSize: '14px',
    fontWeight: 600,
    marginTop: '20px',
    display: 'block',
  },
  selectAgentsLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: tokens.colorBrandForeground1,
    fontSize: '13px',
    padding: '4px 0',
    marginLeft: '24px',
    marginTop: '4px',
    ':disabled': {
      color: tokens.colorNeutralForegroundDisabled,
      cursor: 'not-allowed',
    },
  },
  selectAgentsCount: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    marginLeft: '24px',
    marginTop: '4px',
    display: 'block',
  },
});

interface PolicyScopePickerProps {
  scope: LifecyclePolicyScope;
  selectedAgentIds: string[];
  disabled?: boolean;
  onChangeScope: (scope: LifecyclePolicyScope) => void;
  onOpenPicker: () => void;
  title?: string;
  /** Which scope options to render. Defaults to all three. */
  availableScopes?: LifecyclePolicyScope[];
}

export function PolicyScopePicker({
  scope,
  selectedAgentIds,
  disabled,
  onChangeScope,
  onOpenPicker,
  title = 'Select policy scope',
  availableScopes = ['All', 'Specific', 'Exclude'],
}: PolicyScopePickerProps) {
  const styles = useStyles();
  return (
    <>
      <Text className={styles.sectionTitle}>{title}</Text>
      <RadioGroup
        value={scope}
        disabled={disabled}
        onChange={(_, d) => onChangeScope(d.value as LifecyclePolicyScope)}
      >
        {availableScopes.includes('All') && <Radio value="All" label="All agents" />}
        {availableScopes.includes('Specific') && (
          <Radio value="Specific" label="Specific agents" />
        )}
        {availableScopes.includes('Exclude') && (
          <Radio value="Exclude" label="Exclude agents" />
        )}
      </RadioGroup>
      {scope !== 'All' && (
        <>
          <button
            type="button"
            className={styles.selectAgentsLink}
            disabled={disabled}
            onClick={onOpenPicker}
          >
            <AddRegular fontSize={14} />
            Select agents
          </button>
          {selectedAgentIds.length > 0 && (
            <Text className={styles.selectAgentsCount}>
              {selectedAgentIds.length} agent
              {selectedAgentIds.length === 1 ? '' : 's'} selected
            </Text>
          )}
        </>
      )}
    </>
  );
}
