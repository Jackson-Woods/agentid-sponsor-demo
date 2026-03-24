import { useEffect } from 'react';
import { makeStyles, tokens, Text } from '@fluentui/react-components';
import { DismissRegular, ErrorCircleFilled, CheckmarkCircleFilled } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    position: 'fixed',
    top: '12px',
    right: '12px',
    zIndex: 2000,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  toast: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '12px 16px',
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: '4px',
    boxShadow: tokens.shadow16,
    minWidth: '280px',
    maxWidth: '380px',
  },
  icon: {
    color: tokens.colorPaletteRedForeground1,
    flexShrink: 0,
    marginTop: '2px',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  title: {
    fontSize: '13px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  message: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground2,
  },
  dismiss: {
    flexShrink: 0,
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    padding: '2px',
    color: tokens.colorNeutralForeground3,
    ':hover': {
      color: tokens.colorNeutralForeground1,
    },
  },
});

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  variant?: 'error' | 'success';
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  const styles = useStyles();

  if (toasts.length === 0) return null;

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: ToastMessage; onDismiss: (id: string) => void }) {
  const styles = useStyles();

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 6000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div className={styles.toast}>
      {toast.variant === 'success' ? (
        <CheckmarkCircleFilled style={{ color: tokens.colorPaletteGreenForeground1, flexShrink: 0, marginTop: 2 }} fontSize={20} />
      ) : (
        <ErrorCircleFilled className={styles.icon} fontSize={20} />
      )}
      <div className={styles.content}>
        <Text className={styles.title}>{toast.title}</Text>
        <Text className={styles.message}>{toast.message}</Text>
      </div>
      <button className={styles.dismiss} onClick={() => onDismiss(toast.id)} aria-label="Dismiss">
        <DismissRegular fontSize={16} />
      </button>
    </div>
  );
}
