import { useLocation, useNavigate } from 'react-router-dom';
import { makeStyles, tokens, Text } from '@fluentui/react-components';
import {
  InfoRegular,
  TaskListLtrRegular,
  DeleteRegular,
  SettingsRegular,
  AppsRegular,
  BookRegular,
  WrenchRegular,
  HeadsetRegular,
} from '@fluentui/react-icons';
import { useAppSettings } from '../../AppSettingsContext';

const useStyles = makeStyles({
  sidebar: {
    width: '220px',
    flexShrink: 0,
    backgroundColor: tokens.colorNeutralBackground1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
  },
  groupTitle: {
    padding: '12px 16px 4px',
    fontSize: '13px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    border: 'none',
    background: 'none',
    color: tokens.colorNeutralForeground1,
    fontSize: '13px',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  menuItemDisabled: {
    cursor: 'default',
    ':hover': {
      backgroundColor: 'transparent',
    },
  },
  menuIcon: {
    color: tokens.colorBrandForeground1,
  },
  active: {
    backgroundColor: tokens.colorNeutralBackground1Selected,
    borderLeft: `3px solid ${tokens.colorBrandForeground1}`,
    fontWeight: 600,
  },
});

export function LifecycleWorkflowsSideMenu() {
  const styles = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const { showDefaultDisableUx, defaultDisableVariant } = useAppSettings();
  const showParallelDefaultDisable = showDefaultDisableUx && defaultDisableVariant === 1;

  const path = location.pathname;
  const isOverview = path === '/lifecycle-workflows';
  const isWorkflows = path === '/lifecycle-workflows/workflows';
  const isAgentIdPolicy = path === '/lifecycle-workflows/agent-id-policy';
  const isDefaultDisable = path === '/lifecycle-workflows/default-disable';
  const isCustomExtensions = path === '/lifecycle-workflows/custom-extensions';
  const isSettings = path === '/lifecycle-workflows/settings';

  return (
    <nav className={styles.sidebar} aria-label="Lifecycle workflows menu">
      <button
        className={`${styles.menuItem} ${isOverview ? styles.active : ''}`}
        onClick={() => navigate('/lifecycle-workflows')}
      >
        <InfoRegular className={styles.menuIcon} fontSize={16} />
        Overview
      </button>

      <Text className={styles.groupTitle}>Workflows</Text>
      <button
        className={`${styles.menuItem} ${isWorkflows ? styles.active : ''}`}
        onClick={() => navigate('/lifecycle-workflows/workflows')}
      >
        <TaskListLtrRegular className={styles.menuIcon} fontSize={16} />
        Workflows
      </button>
      <button className={`${styles.menuItem} ${styles.menuItemDisabled}`} type="button">
        <DeleteRegular className={styles.menuIcon} fontSize={16} />
        Deleted workflows
      </button>

      <Text className={styles.groupTitle}>Lifecycle Policies</Text>
      <button
        className={`${styles.menuItem} ${isAgentIdPolicy ? styles.active : ''}`}
        onClick={() => navigate('/lifecycle-workflows/agent-id-policy')}
      >
        <SettingsRegular className={styles.menuIcon} fontSize={16} />
        Agent ID (Preview)
      </button>
      {showParallelDefaultDisable && (
        <button
          className={`${styles.menuItem} ${isDefaultDisable ? styles.active : ''}`}
          onClick={() => navigate('/lifecycle-workflows/default-disable')}
        >
          <SettingsRegular className={styles.menuIcon} fontSize={16} />
          Default Disable (Preview)
        </button>
      )}

      <Text className={styles.groupTitle}>Manage</Text>
      <button
        className={`${styles.menuItem} ${isCustomExtensions ? styles.active : ''}`}
        onClick={() => navigate('/lifecycle-workflows/custom-extensions')}
      >
        <AppsRegular className={styles.menuIcon} fontSize={16} />
        Custom extensions
      </button>
      <button
        className={`${styles.menuItem} ${isSettings ? styles.active : ''}`}
        onClick={() => navigate('/lifecycle-workflows/settings')}
      >
        <SettingsRegular className={styles.menuIcon} fontSize={16} />
        Workflow settings
      </button>

      <Text className={styles.groupTitle}>Activity</Text>
      <button className={`${styles.menuItem} ${styles.menuItemDisabled}`} type="button">
        <BookRegular className={styles.menuIcon} fontSize={16} />
        Audit logs
      </button>

      <Text className={styles.groupTitle}>Troubleshooting + Support</Text>
      <button className={`${styles.menuItem} ${styles.menuItemDisabled}`} type="button">
        <WrenchRegular className={styles.menuIcon} fontSize={16} />
        Troubleshoot
      </button>
      <button className={`${styles.menuItem} ${styles.menuItemDisabled}`} type="button">
        <HeadsetRegular className={styles.menuIcon} fontSize={16} />
        New support request
      </button>
    </nav>
  );
}
