import {
  makeStyles,
  tokens,
  Text,
  Switch,
  Dropdown,
  Option,
  Button,
} from '@fluentui/react-components';
import {
  AddRegular,
  DeleteRegular,
  InfoRegular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  sectionTitle: {
    fontSize: '14px',
    fontWeight: 600,
    marginTop: '20px',
    display: 'block',
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
  enableRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '12px',
  },
  notificationRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '8px',
  },
  notificationLabel: {
    fontSize: '13px',
    minWidth: '160px',
  },
  daysDropdown: {
    minWidth: '90px',
  },
  addNotificationRow: {
    marginTop: '12px',
  },
});

const DAYS_OPTIONS = ['1', '7', '15', '30', '60', '90'];
const SECOND_DAYS_OPTIONS = ['15', '7', '5', '1'];
const THIRD_DAYS_OPTIONS = ['7', '5', '1'];
const ORDINAL_LABELS = ['First', 'Second', 'Third'];
const POSITION_OPTIONS = [DAYS_OPTIONS, SECOND_DAYS_OPTIONS, THIRD_DAYS_OPTIONS];

interface NotificationScheduleEditorProps {
  customize: boolean;
  firstDays: number;
  secondDays?: number;
  thirdDays?: number;
  disabled?: boolean;
  onChangeCustomize: (v: boolean) => void;
  onChangeDays: (next: { first: number; second?: number; third?: number }) => void;
  /** Optional override for the default info banner. */
  infoText?: string;
  /** Optional override for the section title (defaults to "Notification schedule"). */
  title?: string;
  /** Whether to show the section title heading. Defaults to true. */
  showTitle?: boolean;
  /** Optional trailing info banner (e.g. Exchange license note). */
  trailingInfoText?: string;
}

export function NotificationScheduleEditor({
  customize,
  firstDays,
  secondDays,
  thirdDays,
  disabled,
  onChangeCustomize,
  onChangeDays,
  infoText = 'By default, Email notifications will be sent automatically 30, 15, and 1 day prior to agent identity is disabled.',
  title = 'Notification schedule',
  showTitle = true,
  trailingInfoText,
}: NotificationScheduleEditorProps) {
  const styles = useStyles();

  const days = [firstDays, secondDays, thirdDays].filter(
    (d): d is number => d !== undefined,
  );

  const writeDays = (newDays: number[]) => {
    onChangeDays({
      first: newDays[0] ?? firstDays,
      second: newDays[1],
      third: newDays[2],
    });
  };

  const removeAt = (idx: number) => writeDays(days.filter((_, i) => i !== idx));
  const addNotification = () => {
    if (days.length >= 3) return;
    writeDays([...days, 1]);
  };

  return (
    <>
      {showTitle && <Text className={styles.sectionTitle}>{title}</Text>}
      <div className={styles.infoBar} role="status">
        <InfoRegular className={styles.infoIcon} />
        <Text style={{ flex: 1 }}>{infoText}</Text>
      </div>

      <div className={styles.enableRow}>
        <Switch
          checked={customize}
          disabled={disabled}
          onChange={(_, d) => onChangeCustomize(d.checked)}
          label="Customize Notification schedule"
        />
      </div>

      {customize && (
        <>
          {days.map((value, idx) => {
            const options = POSITION_OPTIONS[idx] ?? DAYS_OPTIONS;
            return (
              <div key={idx} className={styles.notificationRow}>
                <Text className={styles.notificationLabel}>
                  {ORDINAL_LABELS[idx]} notification:
                </Text>
                <Dropdown
                  className={styles.daysDropdown}
                  value={String(value)}
                  selectedOptions={[String(value)]}
                  disabled={disabled}
                  onOptionSelect={(_, d) => {
                    if (!d.optionValue) return;
                    const next = [...days];
                    next[idx] = parseInt(d.optionValue, 10);
                    writeDays(next);
                  }}
                >
                  {options.map((opt) => (
                    <Option key={opt} value={opt}>
                      {opt}
                    </Option>
                  ))}
                </Dropdown>
                <Text style={{ fontSize: '13px' }}>Days before</Text>
                {idx > 0 && (
                  <Button
                    appearance="subtle"
                    disabled={disabled}
                    icon={<DeleteRegular style={{ color: tokens.colorBrandForeground1 }} />}
                    aria-label={`Remove ${ORDINAL_LABELS[idx].toLowerCase()} notification`}
                    onClick={() => removeAt(idx)}
                  />
                )}
              </div>
            );
          })}

          {days.length < 3 && (
            <div className={styles.addNotificationRow}>
              <Button
                disabled={disabled}
                icon={<AddRegular style={{ color: tokens.colorBrandForeground1 }} />}
                onClick={addNotification}
              >
                Add notification
              </Button>
            </div>
          )}
        </>
      )}

      {trailingInfoText && (
        <div className={styles.infoBar} role="status">
          <InfoRegular className={styles.infoIcon} />
          <Text style={{ flex: 1 }}>{trailingInfoText}</Text>
        </div>
      )}
    </>
  );
}
