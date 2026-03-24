import { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { makeStyles, tokens, Text } from '@fluentui/react-components';
import {
  ChevronDownRegular,
  ChevronUpRegular,
  StarFilled,
} from '@fluentui/react-icons';
import {
  standaloneTopItems,
  favoritesSection,
  navSections,
  standaloneBottomItems,
} from './frameNavConfig';
import type { NavSection, NavItem, StandaloneNavItem } from './frameNavConfig';
import { AppSettingsContext } from '../../AppSettingsContext';

const useStyles = makeStyles({
  nav: {
    width: '270px',
    flexShrink: 0,
    backgroundColor: tokens.colorNeutralBackground3,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    overflowX: 'hidden',
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    fontSize: '14px',
    paddingTop: '4px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px 10px',
    border: 'none',
    background: 'none',
    color: tokens.colorNeutralForeground1,
    fontSize: '14px',
    fontWeight: 600,
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
    },
  },
  sectionIcon: {
    fontSize: '18px',
    color: tokens.colorBrandForeground1,
  },
  chevron: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    marginLeft: 'auto',
    flexShrink: 0,
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 16px 8px 18px',
    border: 'none',
    background: 'none',
    color: tokens.colorNeutralForeground1,
    fontSize: '14px',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
    },
  },
  menuItemDisabled: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 16px 8px 18px',
    border: 'none',
    background: 'none',
    color: tokens.colorNeutralForeground1,
    fontSize: '14px',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
    },
  },
  menuItemIcon: {
    fontSize: '18px',
    flexShrink: 0,
  },
  menuItemIconBlue: {
    fontSize: '18px',
    flexShrink: 0,
    color: tokens.colorBrandForeground1,
  },
  active: {
    marginLeft: '4px',
    paddingLeft: '14px',
    paddingRight: '20px',
    fontWeight: 600,
    position: 'relative' as const,
    '::before': {
      content: '""',
      position: 'absolute' as const,
      left: '0',
      top: '10%',
      height: '80%',
      width: '5px',
      backgroundColor: tokens.colorBrandForeground1,
      borderRadius: '1px',
    },
  },
  favoriteStar: {
    marginLeft: 'auto',
    color: tokens.colorBrandForeground1,
    fontSize: '14px',
    flexShrink: 0,
  },
  divider: {
    height: '1px',
    margin: '6px 16px',
  },
  spacer: {
    flex: 1,
  },
});

export function FrameSideNav() {
  const styles = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark } = useContext(AppSettingsContext);

  const initialExpanded: Record<string, boolean> = {
    [favoritesSection.label]: favoritesSection.defaultExpanded ?? true,
  };
  for (const section of navSections) {
    initialExpanded[section.label] = section.defaultExpanded ?? false;
  }
  const [expanded, setExpanded] = useState(initialExpanded);

  const toggleSection = (label: string) => {
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (route?: string) => {
    if (!route) return false;
    return location.pathname === route;
  };

  const handleClick = (item: NavItem | StandaloneNavItem) => {
    if (item.route) {
      navigate(item.route);
    }
  };

  const renderItem = (item: NavItem, index: number, isFavoritesSection?: boolean) => {
    const Icon = item.icon;
    const active = !isFavoritesSection && isActive(item.route);
    const hasRoute = !!item.route;

    return (
      <button
        key={`${item.label}-${index}`}
        className={`${hasRoute ? styles.menuItem : styles.menuItemDisabled} ${active ? styles.active : ''}`}
        onClick={() => handleClick(item)}
        title={item.label}
      >
        <Icon fontSize={18} className={styles.menuItemIcon} />
        <Text size={300} truncate wrap={false}>{item.label}</Text>
        {item.isFavorite && <StarFilled className={styles.favoriteStar} />}
      </button>
    );
  };

  const renderSection = (section: NavSection, key: string) => {
    const isOpen = expanded[section.label] ?? false;
    const SectionIcon = section.icon;
    const isFav = section === favoritesSection;

    return (
      <div key={key}>
        <button
          className={styles.sectionHeader}
          onClick={() => toggleSection(section.label)}
          aria-expanded={isOpen}
        >
          {SectionIcon && <SectionIcon fontSize={18} className={styles.sectionIcon} />}
          <Text size={300} weight="semibold">{section.label}</Text>
          {isOpen
            ? <ChevronDownRegular className={styles.chevron} />
            : <ChevronUpRegular className={styles.chevron} />
          }
        </button>
        {isOpen && section.items.map((item, i) => renderItem(item, i, isFav))}
      </div>
    );
  };

  const renderStandaloneItem = (item: StandaloneNavItem, index: number) => {
    const Icon = item.icon;
    const active = isActive(item.route);
    const hasRoute = !!item.route;

    return (
      <button
        key={`standalone-${item.label}-${index}`}
        className={`${hasRoute ? styles.menuItem : styles.menuItemDisabled} ${active ? styles.active : ''}`}
        onClick={() => handleClick(item)}
        title={item.label}
      >
        <Icon fontSize={18} className={styles.menuItemIconBlue} />
        <Text size={300} truncate wrap={false}>{item.label}</Text>
      </button>
    );
  };

  const dividerStyle = { backgroundColor: isDark ? '#505050' : '#c4c3c9' };
  const allSections = [favoritesSection, ...navSections];

  return (
    <nav className={styles.nav} style={{ backgroundColor: isDark ? '#2d2d2d' : '#dddce2' }} aria-label="Portal navigation">
      {standaloneTopItems.map((item, i) => renderStandaloneItem(item, i))}
      {allSections.map((section, i) => (
        <div key={`section-group-${section.label}`}>
          <div className={styles.divider} style={dividerStyle} />
          {renderSection(section, `section-${section.label}`)}
        </div>
      ))}
      <div className={styles.divider} style={dividerStyle} />
      {standaloneBottomItems.map((item, i) => renderStandaloneItem(item, i))}
    </nav>
  );
}
