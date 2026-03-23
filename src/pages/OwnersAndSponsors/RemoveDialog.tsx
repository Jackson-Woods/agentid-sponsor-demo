import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogContent,
  DialogActions,
  Button,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import type { OwnerSponsorEntry } from '../../models/types';

const useStyles = makeStyles({
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginTop: '8px',
    maxHeight: '200px',
    overflow: 'auto',
  },
  item: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground1,
    padding: '4px 0',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
});

interface RemoveDialogProps {
  isOpen: boolean;
  selectedItems: OwnerSponsorEntry[];
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function RemoveConfirmationDialog({
  isOpen,
  selectedItems,
  loading,
  onClose,
  onConfirm,
}: RemoveDialogProps) {
  const styles = useStyles();

  return (
    <Dialog open={isOpen} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Remove owners and sponsors</DialogTitle>
          <DialogContent>
            <Text>
              Are you sure you want to remove the following {selectedItems.length}{' '}
              {selectedItems.length === 1 ? 'entry' : 'entries'}?
            </Text>
            <div className={styles.list}>
              {selectedItems.map((item) => (
                <div key={item.key} className={styles.item}>
                  {item.name} ({item.type})
                </div>
              ))}
            </div>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button appearance="primary" onClick={onConfirm} disabled={loading}>
              {loading ? 'Removing...' : 'Remove'}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
