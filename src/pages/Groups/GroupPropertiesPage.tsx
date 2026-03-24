import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  makeStyles,
  mergeClasses,
  tokens,
  Text,
  Input,
  Textarea,
  Spinner,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  Dropdown,
  Option,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbDivider,
} from '@fluentui/react-components';
import {
  SaveRegular,
  DismissRegular,
  ChatHelpRegular,
  InfoRegular,
  SlideSettingsRegular,
} from '@fluentui/react-icons';
import { getGroupById } from '../../services/dataService';
import { getGroupTypeLabel } from '../../models/types';
import { CopyButton } from '../../components/shared/CopyButton';
import { useAppSettings } from '../../AppSettingsContext';
import type { DummyGroup } from '../../models/types';

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '700px',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
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
  center: {
    display: 'flex',
    justifyContent: 'center',
    padding: '60px',
  },
  sectionTitle: {
    fontSize: '16px',
    color: tokens.colorNeutralForeground1,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  label: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground1,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  required: {
    color: tokens.colorPaletteRedForeground1,
  },
  infoIcon: {
    color: tokens.colorNeutralForeground3,
    cursor: 'help',
  },
  readonlyField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  readonlyInput: {
    backgroundColor: tokens.colorNeutralBackground3,
  },
  objectIdRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  toggleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  toggleLabel: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground1,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  toggleButtons: {
    display: 'flex',
    gap: '0',
    marginTop: '4px',
  },
  toggleBtn: {
    padding: '4px 16px',
    fontSize: '13px',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    cursor: 'pointer',
    background: 'none',
    color: tokens.colorNeutralForeground1,
  },
  toggleBtnLeft: {
    borderRadius: '4px 0 0 4px',
  },
  toggleBtnRight: {
    borderRadius: '0 4px 4px 0',
    borderLeft: 'none',
  },
  toggleBtnActive: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    border: `1px solid ${tokens.colorBrandBackground}`,
  },
  toggleBtnInactive: {
    backgroundColor: tokens.colorNeutralBackground1,
  },
  toggleBtnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
});

function getTypeLabel(group: DummyGroup): string {
  const label = getGroupTypeLabel(group);
  if (label === 'Microsoft 365' || label === 'Dynamic Microsoft 365') return 'Microsoft 365';
  return 'Security';
}

function getMembershipType(group: DummyGroup): string {
  const label = getGroupTypeLabel(group);
  if (label.startsWith('Dynamic')) return 'Dynamic';
  return 'Assigned';
}

export function GroupPropertiesPage() {
  const styles = useStyles();
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { limitGroupSponsors } = useAppSettings();
  const [group, setGroup] = useState<DummyGroup | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!groupId) return;
    getGroupById(groupId).then((g) => {
      setGroup(g ?? null);
      setLoading(false);
    });
  }, [groupId]);

  if (loading) {
    return (
      <div className={styles.center}>
        <Spinner label="Loading properties..." />
      </div>
    );
  }

  if (!group) {
    return (
      <div className={styles.center}>
        <Text>Group not found.</Text>
      </div>
    );
  }

  const typeLabel = getTypeLabel(group);
  const isSecurityGroup = group.securityEnabled;
  const roleAssignable = !!group.isAssignableToRole;
  const nestingSupported = !group.disableNesting;

  return (
    <div className={styles.page}>
      {/* Breadcrumb + title */}
      <div className={styles.header}>
        <Breadcrumb size="small">
          <BreadcrumbItem>
            <BreadcrumbButton onClick={() => navigate('/home')}>Home</BreadcrumbButton>
          </BreadcrumbItem>
          <BreadcrumbDivider />
          <BreadcrumbItem>
            <BreadcrumbButton onClick={() => navigate('/groups/all')}>Groups | All groups</BreadcrumbButton>
          </BreadcrumbItem>
          <BreadcrumbDivider />
          <BreadcrumbItem>
            <BreadcrumbButton onClick={() => navigate(`/groups/${group.id}`)}>
              {group.displayName}
            </BreadcrumbButton>
          </BreadcrumbItem>
        </Breadcrumb>
        <div className={styles.titleRow}>
          <SlideSettingsRegular fontSize={24} style={{ color: tokens.colorBrandForeground1 }} />
          <Text className={styles.title}>{group.displayName}</Text>
        </div>
        <Text className={styles.subtitle}>Group</Text>
      </div>

      {/* Command bar */}
      <Toolbar>
        <ToolbarButton icon={<SaveRegular />} disabled>
          Save
        </ToolbarButton>
        <ToolbarButton icon={<DismissRegular />} disabled>
          Discard
        </ToolbarButton>
        <ToolbarDivider />
        <ToolbarButton icon={<ChatHelpRegular />} disabled>
          Got feedback?
        </ToolbarButton>
      </Toolbar>

      {/* Divider */}
      <div style={{ borderTop: `1px solid ${tokens.colorNeutralStroke1}`, marginTop: '-22px' }} />

      {/* General settings */}
      <Text className={styles.label} block>General settings</Text>

      {/* Group name */}
      <div className={styles.field}>
        <Text className={styles.label}>
          Group name <span className={styles.required}>*</span>
          <InfoRegular className={styles.infoIcon} fontSize={14} />
        </Text>
        <Input value={group.displayName} readOnly />
      </div>

      {/* Group description */}
      <div className={styles.field}>
        <Text className={styles.label}>
          Group description
          <InfoRegular className={styles.infoIcon} fontSize={14} />
        </Text>
        <Textarea
          value={group.description ?? ''}
          placeholder="Enter a description for the group"
          readOnly
          rows={1}
        />
      </div>

      {/* Group type */}
      <div className={styles.readonlyField}>
        <Text className={styles.label}>Group type</Text>
        <Dropdown value={typeLabel} selectedOptions={[typeLabel]} disabled className={styles.readonlyInput}>
          <Option value="Security">Security</Option>
          <Option value="Microsoft 365">Microsoft 365</Option>
        </Dropdown>
      </div>

      {/* Membership type */}
      <div className={styles.readonlyField}>
        <Text className={styles.label}>
          Membership type <span className={styles.required}>*</span>
          <InfoRegular className={styles.infoIcon} fontSize={14} />
        </Text>
        <Dropdown value={getMembershipType(group)} selectedOptions={[getMembershipType(group)]} disabled>
          <Option value="Assigned">Assigned</Option>
          <Option value="Dynamic">Dynamic</Option>
        </Dropdown>
      </div>

      {/* Object Id */}
      <div className={styles.readonlyField}>
        <Text className={styles.label}>Object Id</Text>
        <div className={styles.objectIdRow}>
          <Input value={group.id} readOnly style={{ flex: 1 }} className={styles.readonlyInput} />
          <CopyButton value={group.id} />
        </div>
      </div>

      {/* Microsoft Entra roles can be assigned to the group */}
      <div className={styles.field}>
        <Text className={styles.toggleLabel}>
          Microsoft Entra roles can be assigned to the group
          <InfoRegular className={styles.infoIcon} fontSize={14} />
        </Text>
        <div className={styles.toggleButtons}>
          <button
            className={mergeClasses(styles.toggleBtn, styles.toggleBtnLeft, roleAssignable ? styles.toggleBtnActive : styles.toggleBtnInactive, styles.toggleBtnDisabled)}
            disabled
          >
            Yes
          </button>
          <button
            className={mergeClasses(styles.toggleBtn, styles.toggleBtnRight, !roleAssignable ? styles.toggleBtnActive : styles.toggleBtnInactive, styles.toggleBtnDisabled)}
            disabled
          >
            No
          </button>
        </div>
      </div>

      {/* Supports adding child groups as members — only for security groups when limitGroupSponsors is enabled */}
      {limitGroupSponsors && isSecurityGroup && (
        <div className={styles.field}>
          <Text className={styles.toggleLabel}>
            Supports adding child groups as members
            <InfoRegular className={styles.infoIcon} fontSize={14} />
          </Text>
          <div className={styles.toggleButtons}>
            <button
              className={mergeClasses(styles.toggleBtn, styles.toggleBtnLeft, nestingSupported ? styles.toggleBtnActive : styles.toggleBtnInactive, styles.toggleBtnDisabled)}
              disabled
            >
              Yes
            </button>
            <button
              className={mergeClasses(styles.toggleBtn, styles.toggleBtnRight, !nestingSupported ? styles.toggleBtnActive : styles.toggleBtnInactive, styles.toggleBtnDisabled)}
              disabled
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
