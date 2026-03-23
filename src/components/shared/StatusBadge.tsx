import { Badge } from '@fluentui/react-components';
import { AgentIdentityStatus } from '../../models/types';
import {
  CheckmarkCircleFilled,
  DismissCircleFilled,
} from '@fluentui/react-icons';

interface StatusBadgeProps {
  status: AgentIdentityStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (status === AgentIdentityStatus.Active) {
    return (
      <Badge
        appearance="filled"
        color="success"
        icon={<CheckmarkCircleFilled />}
      >
        Active
      </Badge>
    );
  }
  return (
    <Badge
      appearance="filled"
      color="danger"
      icon={<DismissCircleFilled />}
    >
      Disabled
    </Badge>
  );
}
