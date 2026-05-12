import { makeStyles, Text, Radio, RadioGroup } from '@fluentui/react-components';

const useStyles = makeStyles({
  sectionTitle: {
    fontSize: '14px',
    fontWeight: 600,
    marginTop: '20px',
    display: 'block',
  },
  description: {
    fontSize: '13px',
    marginTop: '2px',
    marginBottom: '8px',
    display: 'block',
  },
});

const OPTIONS: { value: number; label: string }[] = [
  { value: 14, label: '14 days' },
  { value: 30, label: '30 days' },
  { value: 60, label: '60 days' },
  { value: 90, label: '90 days' },
];

interface InactivityWindowPickerProps {
  days: number;
  disabled?: boolean;
  onChange: (days: number) => void;
  title?: string;
  description?: string;
}

export function InactivityWindowPicker({
  days,
  disabled,
  onChange,
  title = 'Inactivity window',
  description = 'Disable inactive agent identities after this period of inactivity.',
}: InactivityWindowPickerProps) {
  const styles = useStyles();
  return (
    <>
      <Text className={styles.sectionTitle}>{title}</Text>
      <Text className={styles.description}>{description}</Text>
      <RadioGroup
        layout="horizontal"
        value={String(days)}
        disabled={disabled}
        onChange={(_, d) => {
          const n = parseInt(d.value, 10);
          if (!isNaN(n)) onChange(n);
        }}
      >
        {OPTIONS.map((opt) => (
          <Radio key={opt.value} value={String(opt.value)} label={opt.label} />
        ))}
      </RadioGroup>
    </>
  );
}
