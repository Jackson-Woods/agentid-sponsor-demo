import { makeStyles, tokens, Text } from '@fluentui/react-components';
import { InfoRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
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
});

interface ReEnableInfoBannerProps {
  text?: string;
}

export function ReEnableInfoBanner({
  text = 'Disabled agents can be re-enabled, but not by their sponsor. An owner or admin will need to take action.',
}: ReEnableInfoBannerProps) {
  const styles = useStyles();
  return (
    <div className={styles.infoBar} role="status">
      <InfoRegular className={styles.infoIcon} />
      <Text style={{ flex: 1 }}>{text}</Text>
    </div>
  );
}
