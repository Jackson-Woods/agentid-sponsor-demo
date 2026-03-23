import { useState } from 'react';
import { Button, Tooltip } from '@fluentui/react-components';
import { CopyRegular, CheckmarkRegular } from '@fluentui/react-icons';

interface CopyButtonProps {
  value: string;
}

export function CopyButton({ value }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <Tooltip content={copied ? 'Copied!' : 'Copy to clipboard'} relationship="label">
      <Button
        appearance="subtle"
        size="small"
        icon={copied ? <CheckmarkRegular /> : <CopyRegular />}
        onClick={handleCopy}
        aria-label={`Copy ${value}`}
      />
    </Tooltip>
  );
}
