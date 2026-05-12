import { makeStyles, Switch } from '@fluentui/react-components';

const useStyles = makeStyles({
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '12px',
  },
});

interface NotifyOwnersToggleProps {
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export function NotifyOwnersToggle({
  checked,
  disabled,
  onChange,
  label = 'Notify owners in addition to sponsors',
}: NotifyOwnersToggleProps) {
  const styles = useStyles();
  return (
    <div className={styles.row}>
      <Switch
        checked={checked}
        disabled={disabled}
        label={label}
        onChange={(_, d) => onChange(d.checked)}
      />
    </div>
  );
}
