import { makeStyles, Text, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  root: { padding: '24px' },
  title: { display: 'block', marginBottom: '8px' },
  subtitle: { color: tokens.colorNeutralForeground3 },
});

export function AppRegistrationsPage() {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <Text className={styles.title} size={600} weight="semibold">App registrations</Text>
      <Text className={styles.subtitle} size={300}>Coming soon</Text>
    </div>
  );
}
