import { useState, useRef, useEffect } from 'react';
import { makeStyles, tokens, Avatar, Button, Text, Input, Switch, Radio, RadioGroup } from '@fluentui/react-components';
import {
  SearchRegular,
  AlertRegular,
  SettingsRegular,
  QuestionCircleRegular,
  GridDotsRegular,
} from '@fluentui/react-icons';
import { signedInUser } from '../../data/seed';
import type { DefaultDisableVariant, ExperienceTier } from '../../AppSettingsContext';

const useStyles = makeStyles({
  header: {
    display: 'flex',
    alignItems: 'center',
    height: '40px',
    backgroundColor: '#1b1a19',
    color: '#ffffff',
    paddingLeft: '12px',
    paddingRight: '12px',
    flexShrink: 0,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '36px',
  },
  brandText: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#ffffff',
  },
  centerSection: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  searchBox: {
    width: '480px',
    backgroundColor: tokens.colorNeutralBackground3,
    minHeight: '32px',
    fontSize: '14px',
    color: tokens.colorNeutralForeground1,
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  userName: {
    fontSize: '12px',
    color: tokens.colorNeutralForegroundOnBrand,
    marginLeft: '4px',
  },
  iconBtn: {
    color: '#ffffff',
    minWidth: 'auto',
    padding: '4px',
  },
  proto: {
    fontSize: '10px',
    color: '#f3d77b',
    backgroundColor: '#3d3a38',
    padding: '2px 8px',
    borderRadius: '2px',
    marginLeft: '12px',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
  },
  gridIcon: {
    color: '#ffffff',
    fontSize: '20px',
    cursor: 'pointer',
  },
  settingsAnchor: {
    position: 'relative',
  },
  settingsDropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '4px',
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: '4px',
    boxShadow: tokens.shadow16,
    padding: '8px 12px',
    zIndex: 1000,
    minWidth: '260px',
  },
});

interface TopNavProps {
  isDark: boolean;
  onToggleTheme: () => void;
  limitGroupSponsors: boolean;
  onToggleLimitGroupSponsors: () => void;
  prefilterSponsors: boolean;
  onTogglePrefilterSponsors: () => void;
  showDefaultDisableUx: boolean;
  onToggleShowDefaultDisableUx: () => void;
  defaultDisableVariant: DefaultDisableVariant;
  onChangeDefaultDisableVariant: (v: DefaultDisableVariant) => void;
  experienceTier: ExperienceTier;
  onChangeExperienceTier: (v: ExperienceTier) => void;
}

export function TopNav({
  isDark,
  onToggleTheme,
  limitGroupSponsors,
  onToggleLimitGroupSponsors,
  prefilterSponsors,
  onTogglePrefilterSponsors,
  showDefaultDisableUx,
  onToggleShowDefaultDisableUx,
  defaultDisableVariant,
  onChangeDefaultDisableVariant,
  experienceTier,
  onChangeExperienceTier,
}: TopNavProps) {
  const styles = useStyles();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!settingsOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [settingsOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <GridDotsRegular className={styles.gridIcon} />
        <Text className={styles.brandText}>Microsoft Entra admin center</Text>
        <span className={styles.proto}>UX Demo</span>
      </div>
      <div className={styles.centerSection}>
        <Input
          className={styles.searchBox}
          contentBefore={<SearchRegular />}
          placeholder="Search resources, services, and docs (G+/)"
          size="small"
        />
      </div>
      <div className={styles.userSection}>
        <Button
          className={styles.iconBtn}
          appearance="subtle"
          icon={<AlertRegular />}
          title="Notifications"
        />
        <div className={styles.settingsAnchor} ref={settingsRef}>
          <Button
            className={styles.iconBtn}
            appearance="subtle"
            icon={<SettingsRegular />}
            title="Settings"
            onClick={() => setSettingsOpen((v) => !v)}
          />
          {settingsOpen && (
            <div className={styles.settingsDropdown}>
              <Text style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px', color: tokens.colorNeutralForeground1 }} block>Experience</Text>
              <RadioGroup
                value={experienceTier}
                onChange={(_, d) => {
                  if (d.value === 'free' || d.value === 'premium') {
                    onChangeExperienceTier(d.value);
                  }
                }}
              >
                <Radio value="free" label="Free" />
                <Radio value="premium" label="Premium" />
              </RadioGroup>
              <Text style={{ fontSize: '13px', fontWeight: 600, marginTop: '8px', marginBottom: '4px', color: tokens.colorNeutralForeground1 }} block>Appearance</Text>
              <Switch
                label="Dark mode"
                labelPosition="before"
                checked={isDark}
                onChange={onToggleTheme}
              />
              <Text style={{ fontSize: '13px', fontWeight: 600, marginTop: '8px', marginBottom: '4px', color: tokens.colorNeutralForeground1 }} block>Features</Text>
              <Switch
                label="Show default disable UX for agents"
                labelPosition="before"
                checked={showDefaultDisableUx}
                onChange={onToggleShowDefaultDisableUx}
              />
              {showDefaultDisableUx && (
                <div style={{ marginLeft: '12px', marginTop: '4px', marginBottom: '4px' }}>
                  <Text style={{ fontSize: '12px', color: tokens.colorNeutralForeground2, marginBottom: '2px', display: 'block' }}>
                    Default disable UI
                  </Text>
                  <RadioGroup
                    value={String(defaultDisableVariant)}
                    onChange={(_, d) => {
                      const n = parseInt(d.value, 10);
                      if (n === 1 || n === 2 || n === 3) {
                        onChangeDefaultDisableVariant(n);
                      }
                    }}
                  >
                    <Radio value="1" label="Parallel page" />
                    <Radio value="2" label="Integrated mode picker" />
                    <Radio value="3" label="Two sections" />
                  </RadioGroup>
                </div>
              )}
              <Switch
                label="Limit group sponsors"
                labelPosition="before"
                checked={limitGroupSponsors}
                onChange={onToggleLimitGroupSponsors}
              />
              <Switch
                label="Prefilter sponsors"
                labelPosition="before"
                checked={prefilterSponsors}
                disabled={!limitGroupSponsors}
                onChange={onTogglePrefilterSponsors}
              />
            </div>
          )}
        </div>
        <Button
          className={styles.iconBtn}
          appearance="subtle"
          icon={<QuestionCircleRegular />}
          title="Help"
        />
        <Text className={styles.userName}>{signedInUser.displayName}</Text>
        <Avatar
          name={signedInUser.displayName}
          initials={signedInUser.initials}
          size={24}
          color="brand"
        />
      </div>
    </header>
  );
}
