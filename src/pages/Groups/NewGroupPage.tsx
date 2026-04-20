import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  makeStyles,
  tokens,
  Text,
  Input,
  Textarea,
  Button,
  Dropdown,
  Option,
  Switch,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbDivider,
  Link,
} from '@fluentui/react-components';
import { addGroup } from '../../services/dataService';
import type { DummyGroup, DummyUser } from '../../models/types';
import { UserPickerDialog } from '../../components/PeoplePicker/UserPickerDialog';
import { useAppSettings } from '../../AppSettingsContext';

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '640px',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
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
  formCard: {
    padding: '24px',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: '8px',
    backgroundColor: tokens.colorNeutralBackground1,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  required: {
    color: tokens.colorPaletteRedForeground1,
  },
  hint: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
  },
  switchRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  linkRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
});

type GroupTypeOption = 'Security' | 'Microsoft 365';
type MembershipOption = 'Assigned' | 'Dynamic User' | 'Dynamic Device';

export function NewGroupPage() {
  const styles = useStyles();
  const navigate = useNavigate();

  const { limitGroupSponsors } = useAppSettings();
  const [groupType, setGroupType] = useState<GroupTypeOption>('Security');
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [roleAssignable, setRoleAssignable] = useState(false);
  const [supportNesting, setSupportNesting] = useState(false);
  const [membershipType, setMembershipType] = useState<MembershipOption>('Assigned');
  const [saving, setSaving] = useState(false);
  const [selectedOwners, setSelectedOwners] = useState<DummyUser[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<DummyUser[]>([]);
  const [pickerMode, setPickerMode] = useState<'owners' | 'members' | null>(null);

  const canCreate = groupName.trim().length > 0;

  const handleCreate = async () => {
    if (!canCreate) return;
    setSaving(true);

    const isUnified = groupType === 'Microsoft 365';
    const isDynamic = membershipType === 'Dynamic User' || membershipType === 'Dynamic Device';

    const group: DummyGroup = {
      id: crypto.randomUUID(),
      displayName: groupName.trim(),
      mail: `${groupName.trim().toLowerCase().replace(/\s+/g, '-')}@contoso.com`,
      description: groupDescription.trim() || undefined,
      groupTypes: [
        ...(isUnified ? ['Unified'] : []),
        ...(isDynamic ? ['DynamicMembership'] : []),
      ],
      securityEnabled: !isUnified,
      mailEnabled: isUnified,
      isAssignableToRole: roleAssignable && !isUnified ? true : undefined,
      disableNesting: limitGroupSponsors ? !supportNesting : undefined,
      membershipRuleProcessingState: isDynamic ? 'On' : undefined,
      '@odata.type': '#microsoft.graph.group',
    };

    await addGroup(group);
    setSaving(false);
    navigate('/groups/all');
  };

  return (
    <div className={styles.page}>
      <div>
        <Breadcrumb size="small">
          <BreadcrumbItem>
            <BreadcrumbButton onClick={() => navigate('/home')}>Home</BreadcrumbButton>
          </BreadcrumbItem>
          <BreadcrumbDivider />
          <BreadcrumbItem>
            <BreadcrumbButton onClick={() => navigate('/groups')}>Groups</BreadcrumbButton>
          </BreadcrumbItem>
          <BreadcrumbDivider />
          <BreadcrumbItem>
            <BreadcrumbButton current>New group</BreadcrumbButton>
          </BreadcrumbItem>
        </Breadcrumb>
        <div className={styles.titleRow}>
          <Text className={styles.title}>New group</Text>
        </div>
        <Text className={styles.subtitle} block>
          Create a new group to manage access for a set of users
        </Text>
      </div>

      <div className={styles.formCard}>
        {/* Group type */}
        <div className={styles.field}>
          <Text className={styles.label}>
            Group type <span className={styles.required}>*</span>
          </Text>
          <Dropdown
            value={groupType}
            selectedOptions={[groupType]}
            onOptionSelect={(_, d) => setGroupType(d.optionValue as GroupTypeOption)}
          >
            <Option value="Security">Security</Option>
            <Option value="Microsoft 365">Microsoft 365</Option>
          </Dropdown>
        </div>

        {/* Group name */}
        <div className={styles.field}>
          <Text className={styles.label}>
            Group name <span className={styles.required}>*</span>
          </Text>
          <Input
            value={groupName}
            onChange={(_, d) => setGroupName(d.value)}
            placeholder="Enter a group name"
          />
        </div>

        {/* Group description */}
        <div className={styles.field}>
          <Text className={styles.label}>Group description</Text>
          <Textarea
            value={groupDescription}
            onChange={(_, d) => setGroupDescription(d.value)}
            placeholder="Enter a description for this group"
            rows={3}
          />
        </div>

        {/* Entra roles */}
        {groupType === 'Security' && (
          <div className={styles.field}>
            <div className={styles.switchRow}>
              <div>
                <Text className={styles.label} block>
                  Microsoft Entra roles can be assigned to the group
                </Text>
                <Text className={styles.hint}>
                  Turn on if you want to use this group to assign Entra roles to members.
                  This setting can't be changed after creation.
                </Text>
              </div>
              <Switch
                checked={roleAssignable}
                onChange={(_, d) => setRoleAssignable(d.checked)}
              />
            </div>
          </div>
        )}

        {/* Support nesting — only when limitGroupSponsors is enabled */}
        {limitGroupSponsors && (
          <div className={styles.field}>
            <div className={styles.switchRow}>
              <div>
                <Text className={styles.label} block>
                  Support adding child groups as members
                </Text>
                <Text className={styles.hint}>
                  Turn on if you want to allow other groups to be members of this group.
                  Some features and experiences don't support nested groups.
                  This setting can't be changed after creation.
                </Text>
              </div>
              <Switch
                checked={supportNesting}
                onChange={(_, d) => setSupportNesting(d.checked)}
              />
            </div>
          </div>
        )}

        {/* Membership type */}
        <div className={styles.field}>
          <Text className={styles.label}>
            Membership type <span className={styles.required}>*</span>
          </Text>
          <Dropdown
            value={membershipType}
            selectedOptions={[membershipType]}
            onOptionSelect={(_, d) => setMembershipType(d.optionValue as MembershipOption)}
          >
            <Option value="Assigned">Assigned</Option>
            <Option value="Dynamic User">Dynamic User</Option>
            <Option value="Dynamic Device">Dynamic Device</Option>
          </Dropdown>
          <Text className={styles.hint}>
            {membershipType === 'Assigned'
              ? "You'll add members manually to this group."
              : 'Members are added and removed automatically based on rules.'}
          </Text>
        </div>

        {/* Owners */}
        <div className={styles.field}>
          <Text className={styles.label}>Owners</Text>
          <div className={styles.linkRow}>
            <Link onClick={() => setPickerMode('owners')}>
              {selectedOwners.length === 0
                ? 'No owners selected'
                : `${selectedOwners.length} owner${selectedOwners.length !== 1 ? 's' : ''} selected`}
            </Link>
          </div>
        </div>

        {/* Members */}
        <div className={styles.field}>
          <Text className={styles.label}>Members</Text>
          <div className={styles.linkRow}>
            <Link onClick={() => setPickerMode('members')}>
              {selectedMembers.length === 0
                ? 'No members selected'
                : `${selectedMembers.length} member${selectedMembers.length !== 1 ? 's' : ''} selected`}
            </Link>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <Button
          appearance="primary"
          disabled={!canCreate || saving}
          onClick={handleCreate}
        >
          {saving ? 'Creating...' : 'Create'}
        </Button>
        <Button appearance="outline" onClick={() => navigate('/groups/all')}>
          Cancel
        </Button>
      </div>

      <UserPickerDialog
        isOpen={pickerMode !== null}
        title={pickerMode === 'owners' ? 'Add owners' : 'Add members'}
        subtitle={
          pickerMode === 'owners'
            ? 'Select users to add as owners of this group'
            : 'Select users to add as members of this group'
        }
        initialSelected={pickerMode === 'owners' ? selectedOwners : selectedMembers}
        onClose={() => setPickerMode(null)}
        onConfirm={(selected) => {
          if (pickerMode === 'owners') setSelectedOwners(selected);
          else setSelectedMembers(selected);
          setPickerMode(null);
        }}
      />
    </div>
  );
}
