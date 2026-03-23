import { Badge, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  owner: {
    backgroundColor: tokens.colorNeutralForeground3,
    color: tokens.colorNeutralForegroundInverted,
  },
  sponsor: {
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1
  },
});

interface TypeBadgeProps {
  type: 'Owner' | 'Sponsor';
}

export function TypeBadge({ type }: TypeBadgeProps) {
  const styles = useStyles();
  return (
    <Badge
      appearance="filled"
      shape="circular"
      className={type === 'Owner' ? styles.owner : styles.sponsor}
    >
      {type === 'Owner' ? 'Full owner' : type}
    </Badge>
  );
}
