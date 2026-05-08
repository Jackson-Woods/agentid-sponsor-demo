import { useEffect, useState } from 'react';
import {
  makeStyles,
  tokens,
  Text,
  Toolbar,
  ToolbarButton,
  Slider,
  Input,
  Dropdown,
  Option,
  Radio,
  RadioGroup,
  Button,
  Link,
  Spinner,
  Tooltip,
} from '@fluentui/react-components';
import { ChatHelpRegular, InfoRegular } from '@fluentui/react-icons';
import { LifecyclePageHeader } from './LifecyclePageHeader';
import {
  getWorkflowSettings,
  updateWorkflowSettings,
} from '../../services/dataService';
import type { WorkflowSettings } from '../../models/types';

const useStyles = makeStyles({
  toolbar: {
    paddingLeft: 0,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '760px',
    marginTop: '8px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 600,
    display: 'block',
  },
  sectionDescription: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground2,
    marginTop: '2px',
  },
  fieldRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '12px',
  },
  fieldLabel: {
    fontSize: '13px',
    minWidth: '180px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  },
  infoIcon: {
    color: tokens.colorNeutralForeground3,
    cursor: 'help',
  },
  sliderWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
    maxWidth: '500px',
  },
  hoursInput: {
    width: '60px',
  },
  emailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  emailPrefix: {
    fontSize: '13px',
  },
  domainDropdown: {
    minWidth: '180px',
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

const EMAIL_DOMAINS = ['microsoft.com', 'contoso.com'];

export function WorkflowSettingsPage() {
  const styles = useStyles();
  const [settings, setSettings] = useState<WorkflowSettings | null>(null);
  const [draft, setDraft] = useState<WorkflowSettings | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const s = await getWorkflowSettings();
    setSettings(s);
    setDraft(s);
  };

  useEffect(() => {
    load();
  }, []);

  const isDirty =
    settings !== null &&
    draft !== null &&
    (settings.workflowScheduleHours !== draft.workflowScheduleHours ||
      settings.emailDomain !== draft.emailDomain ||
      settings.useCompanyBrandingLogo !== draft.useCompanyBrandingLogo);

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    const updated = await updateWorkflowSettings(draft);
    setSettings(updated);
    setDraft(updated);
    setSaving(false);
  };

  const handleDiscard = () => {
    setDraft(settings);
  };

  const toolbar = (
    <Toolbar className={styles.toolbar}>
      <ToolbarButton icon={<ChatHelpRegular />}>Got feedback?</ToolbarButton>
    </Toolbar>
  );

  return (
    <LifecyclePageHeader
      pageLabel="Workflow settings"
      iconKind="settings"
      bannerVariant="none"
      toolbar={toolbar}
    >
      {draft === null ? (
        <div className={styles.loading}>
          <Spinner />
        </div>
      ) : (
        <div className={styles.content}>
          <div>
            <Text className={styles.sectionTitle}>Customize workflow schedule</Text>
            <Text className={styles.sectionDescription}>
              Configure the schedule for execution of all the workflows in your tenant.
            </Text>
            <Text className={styles.sectionDescription}>
              <Link href="#" inline>
                Learn more
              </Link>
            </Text>
            <div className={styles.fieldRow}>
              <Text className={styles.fieldLabel}>
                Workflow schedule
                <Tooltip
                  content="Defines the frequency of workflow execution. Value must be between 1 and 24."
                  relationship="description"
                  withArrow
                >
                  <InfoRegular className={styles.infoIcon} fontSize={14} />
                </Tooltip>
              </Text>
              <div className={styles.sliderWrap}>
                <Slider
                  min={1}
                  max={24}
                  value={draft.workflowScheduleHours}
                  onChange={(_, d) =>
                    setDraft({ ...draft, workflowScheduleHours: d.value })
                  }
                  style={{ flex: 1 }}
                />
                <Input
                  className={styles.hoursInput}
                  type="number"
                  min={1}
                  max={24}
                  value={String(draft.workflowScheduleHours)}
                  onChange={(_, d) => {
                    const n = parseInt(d.value, 10);
                    if (!isNaN(n) && n >= 1 && n <= 24) {
                      setDraft({ ...draft, workflowScheduleHours: n });
                    }
                  }}
                />
                <Text style={{ fontSize: '13px' }}>hours</Text>
              </div>
            </div>
          </div>

          <div>
            <Text className={styles.sectionTitle}>Email settings</Text>
            <div className={styles.fieldRow}>
              <Text className={styles.fieldLabel}>
                Email domain
                <Tooltip
                  content="Email domain displayed for all workflow related email notifications."
                  relationship="description"
                  withArrow
                >
                  <InfoRegular className={styles.infoIcon} fontSize={14} />
                </Tooltip>
              </Text>
              <div className={styles.emailRow}>
                <Text className={styles.emailPrefix}>lifecycleworkflows-noreply @</Text>
                <Dropdown
                  className={styles.domainDropdown}
                  value={draft.emailDomain}
                  selectedOptions={[draft.emailDomain]}
                  onOptionSelect={(_, d) =>
                    d.optionValue && setDraft({ ...draft, emailDomain: d.optionValue })
                  }
                >
                  {EMAIL_DOMAINS.map((dom) => (
                    <Option key={dom} value={dom}>
                      {dom}
                    </Option>
                  ))}
                </Dropdown>
              </div>
            </div>
            <div className={styles.fieldRow}>
              <Text className={styles.fieldLabel}>
                Use company branding banner logo
                <Tooltip
                  content="Customizing company branding is not enabled in this demo."
                  relationship="description"
                  withArrow
                >
                  <InfoRegular className={styles.infoIcon} fontSize={14} />
                </Tooltip>
              </Text>
              <RadioGroup
                layout="horizontal"
                value={draft.useCompanyBrandingLogo ? 'yes' : 'no'}
                onChange={(_, d) =>
                  setDraft({ ...draft, useCompanyBrandingLogo: d.value === 'yes' })
                }
              >
                <Radio value="yes" label="Yes" />
                <Radio value="no" label="No" />
              </RadioGroup>
            </div>
          </div>

          <div className={styles.buttonRow}>
            <Button appearance="primary" disabled={!isDirty || saving} onClick={handleSave}>
              Save
            </Button>
            <Button disabled={!isDirty || saving} onClick={handleDiscard}>
              Discard
            </Button>
          </div>
        </div>
      )}
    </LifecyclePageHeader>
  );
}
