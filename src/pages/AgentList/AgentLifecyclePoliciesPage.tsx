import { Navigate, useNavigate } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbButton,
  BreadcrumbDivider,
  BreadcrumbItem,
  Button,
  makeStyles,
  Text,
  tokens,
} from '@fluentui/react-components';
import { DismissRegular, SettingsRegular } from '@fluentui/react-icons';
import { useAppSettings } from '../../AppSettingsContext';
import { AgentPoliciesTable } from '../LifecycleWorkflows/AgentPoliciesPage';

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
});

export function AgentLifecyclePoliciesPage() {
  const styles = useStyles();
  const navigate = useNavigate();
  const { showDefaultDisableUx } = useAppSettings();

  if (!showDefaultDisableUx) {
    return <Navigate to="/" replace />;
  }

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

      <AgentPoliciesTable
        onInactivePolicyClick={() => navigate('/agents/lifecycle-policy/inactive')}
      />
    </div>
  );
}