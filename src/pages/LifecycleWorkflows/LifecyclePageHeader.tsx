import {
  makeStyles,
  tokens,
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbDivider,
  Button,
  Link,
} from '@fluentui/react-components';
import {
  ArrowSyncCircleRegular,
  SettingsRegular,
  AppsListDetailRegular,
  TaskListLtrRegular,
  DismissRegular,
  CheckmarkCircleFilled,
} from '@fluentui/react-icons';
import { useNavigate } from 'react-router-dom';
import type { ReactNode, ComponentType } from 'react';

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
  closeBtn: {
    minWidth: 'auto',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  iconBox: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
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
  banner: {
    backgroundColor: '#f3eef9',
    border: `1px solid #e3d6ee`,
    borderRadius: '4px',
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    fontSize: '13px',
  },
  bannerIcon: {
    color: '#5c2d91',
    fontSize: '16px',
    flexShrink: 0,
    marginTop: '1px',
  },
  bannerText: {
    flex: 1,
    color: tokens.colorNeutralForeground1,
    lineHeight: '18px',
  },
  bannerDismiss: {
    minWidth: 'auto',
  },
});

const PAGE_ICONS: Record<
  string,
  ComponentType<{ fontSize?: number; style?: React.CSSProperties }>
> = {
  overview: ArrowSyncCircleRegular,
  workflows: TaskListLtrRegular,
  settings: SettingsRegular,
  extensions: AppsListDetailRegular,
  policy: SettingsRegular,
};

export type LifecycleBannerVariant = 'future' | 'present' | 'none';

export interface LifecyclePageHeaderProps {
  pageLabel: string;
  iconKind: keyof typeof PAGE_ICONS;
  bannerVariant?: LifecycleBannerVariant;
  /** When true, breadcrumb shows only Home (matches Overview screenshot). */
  rootBreadcrumb?: boolean;
  toolbar?: ReactNode;
  children?: ReactNode;
}

export function LifecyclePageHeader({
  pageLabel,
  iconKind,
  bannerVariant = 'future',
  rootBreadcrumb = false,
  toolbar,
  children,
}: LifecyclePageHeaderProps) {
  const styles = useStyles();
  const navigate = useNavigate();
  const Icon = PAGE_ICONS[iconKind];

  return (
    <div className={styles.page}>
      <Breadcrumb size="small">
        <BreadcrumbItem>
          <BreadcrumbButton onClick={() => navigate('/home')}>Home</BreadcrumbButton>
        </BreadcrumbItem>
        {!rootBreadcrumb && (
          <>
            <BreadcrumbDivider />
            <BreadcrumbItem>
              <BreadcrumbButton current onClick={() => navigate('/lifecycle-workflows')}>
                Lifecycle workflows
              </BreadcrumbButton>
            </BreadcrumbItem>
          </>
        )}
      </Breadcrumb>

      <div className={styles.topRow}>
        <div className={styles.titleRow}>
          <div className={styles.iconBox}>
            <Icon fontSize={28} style={{ color: tokens.colorBrandForeground1 }} />
          </div>
          <div className={styles.titleStack}>
            <Text className={styles.title}>
              <span className={styles.titleStrong}>Lifecycle workflows</span> | {pageLabel}
            </Text>
            <Text className={styles.subtitle}>Identity Governance</Text>
          </div>
        </div>
        <Button
          appearance="subtle"
          icon={<DismissRegular />}
          aria-label="Close"
          className={styles.closeBtn}
          onClick={() => navigate('/home')}
        />
      </div>

      {toolbar}

      {bannerVariant !== 'none' && (
        <div className={styles.banner} role="status">
          <CheckmarkCircleFilled className={styles.bannerIcon} />
          <Text className={styles.bannerText}>
            {bannerVariant === 'future' ? (
              <>
                Beginning January 15, 2026, a linked Azure subscription is required to use Entra ID
                Governance features for guest users. Billing is based on unique guest users included in
                Entra ID Governance features during the month.{' '}
                <Link href="#" inline>
                  Learn more
                </Link>
              </>
            ) : (
              <>
                A linked Azure subscription is required to use Entra ID Governance features for guest
                users. Billing is based on unique guest users included in Entra ID Governance features
                during the month. Link an Azure subscription to continue using Entra ID Governance
                features for guests.{' '}
                <Link href="#" inline>
                  Learn more
                </Link>
              </>
            )}
          </Text>
          <Button
            appearance="subtle"
            size="small"
            icon={<DismissRegular />}
            className={styles.bannerDismiss}
            aria-label="Dismiss"
          />
        </div>
      )}

      {children}
    </div>
  );
}
