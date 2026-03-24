import type { ComponentType } from 'react';
import {
  HomeRegular,
  HexagonSparkleRegular,
  StarFilled,
  ContactCardRegular,
  PersonRegular,
  PeopleRegular,
  InfoRegular,
  PhoneLaptopRegular,
  BuildingMultipleRegular,
  AppGenericRegular,
  ShieldPersonRegular,
  PeopleTeamRegular,
  GlobeRegular,
  ServerRegular,
  LockClosedRegular,
  KeyMultipleRegular,
  ShieldCheckmarkRegular,
  FingerprintRegular,
  PasswordRegular,
  PeopleSwapRegular,
  CertificateRegular,
  PeopleAudienceRegular,
  ArrowSyncRegular,
  PlugConnectedRegular,
  DatabaseRegular,
  RenameFilled,
  PaintBrushRegular,
  PhoneRegular,
  PulseRegular,
  DataBarVerticalRegular,
  BookRegular,
  ShieldRegular,
  CheckmarkCircleRegular,
  OrganizationRegular,
  CalendarLtrRegular,
  LightbulbRegular,
  WrenchRegular,
  HeadsetRegular,
  PeopleCommunityRegular,
  ContactCardGroupRegular,
} from '@fluentui/react-icons';

export interface NavItem {
  label: string;
  icon: ComponentType<{ fontSize?: number; className?: string }>;
  route?: string;
  isFavorite?: boolean;
}

export interface NavSection {
  label: string;
  icon?: ComponentType<{ fontSize?: number; className?: string }>;
  isCollapsible: boolean;
  defaultExpanded?: boolean;
  items: NavItem[];
}

export interface StandaloneNavItem {
  label: string;
  icon: ComponentType<{ fontSize?: number; className?: string }>;
  route?: string;
}

export const standaloneTopItems: StandaloneNavItem[] = [
  { label: 'Home', icon: HomeRegular, route: '/home' },
  { label: 'Entra agents', icon: HexagonSparkleRegular },
];

export const favoritesSection: NavSection = {
  label: 'Favorites',
  icon: StarFilled,
  isCollapsible: true,
  defaultExpanded: true,
  items: [
    { label: 'Agent ID (Preview)', icon: ContactCardRegular, route: '/', isFavorite: true },
    { label: 'Users', icon: PersonRegular, route: '/users', isFavorite: true },
    { label: 'Groups', icon: PeopleRegular, route: '/groups', isFavorite: true },
  ],
};

export const navSections: NavSection[] = [
  {
    label: 'Entra ID',
    icon: ShieldRegular,
    isCollapsible: true,
    defaultExpanded: false,
    items: [
      { label: 'Overview', icon: InfoRegular },
      { label: 'Users', icon: PersonRegular, route: '/users' },
      { label: 'Groups', icon: PeopleRegular, route: '/groups' },
      { label: 'Devices', icon: PhoneLaptopRegular },
      { label: 'Agent ID (Preview)', icon: ContactCardRegular, route: '/' },
      { label: 'Enterprise apps', icon: BuildingMultipleRegular, route: '/enterprise-apps' },
      { label: 'App registrations', icon: AppGenericRegular, route: '/app-registrations' },
      { label: 'Roles & admins', icon: ShieldPersonRegular },
      { label: 'Delegated admin partners', icon: PeopleTeamRegular },
      { label: 'Tenant governance (Preview)', icon: OrganizationRegular },
      { label: 'Domain services', icon: ServerRegular },
      { label: 'Conditional Access', icon: LockClosedRegular },
      { label: 'Multifactor authentication', icon: KeyMultipleRegular },
      { label: 'Identity Secure Score', icon: ShieldCheckmarkRegular },
      { label: 'Authentication methods', icon: FingerprintRegular },
      { label: 'Account recovery (Preview)', icon: DatabaseRegular },
      { label: 'Password reset', icon: PasswordRegular },
      { label: 'Custom security attributes', icon: LockClosedRegular },
      { label: 'Certificate authorities', icon: CertificateRegular },
      { label: 'External Identities', icon: PeopleAudienceRegular },
      { label: 'Cross-tenant synchronization', icon: PeopleSwapRegular },
      { label: 'Entra Connect', icon: PlugConnectedRegular },
      { label: 'Backup and recovery (Preview)', icon: DatabaseRegular },
      { label: 'Domain names', icon: GlobeRegular },
      { label: 'Custom branding', icon: PaintBrushRegular },
      { label: 'Mobility', icon: PhoneRegular },
      { label: 'Monitoring & health', icon: PulseRegular },
    ],
  },
  {
    label: 'ID Protection',
    icon: ShieldPersonRegular,
    isCollapsible: true,
    defaultExpanded: false,
    items: [],
  },
  {
    label: 'ID Governance',
    icon: PeopleCommunityRegular,
    isCollapsible: true,
    defaultExpanded: false,
    items: [
      { label: 'Dashboard', icon: DataBarVerticalRegular },
      { label: 'Entitlement management', icon: BookRegular, route: '/entitlement-management' },
      { label: 'Access reviews', icon: CheckmarkCircleRegular },
      { label: 'Privileged Identity Management', icon: ShieldPersonRegular, route: '/pim' },
      { label: 'Lifecycle workflows', icon: CalendarLtrRegular, route: '/lifecycle-workflows' },
    ],
  },
  {
    label: 'Verified ID',
    icon: ContactCardGroupRegular,
    isCollapsible: true,
    defaultExpanded: false,
    items: [],
  },
  {
    label: 'Global Secure Access',
    icon: GlobeRegular,
    isCollapsible: true,
    defaultExpanded: false,
    items: [],
  },
];

export const standaloneBottomItems: StandaloneNavItem[] = [
  { label: "What's new", icon: LightbulbRegular },
  { label: 'Diagnose & solve problems', icon: WrenchRegular },
  { label: 'New support request', icon: HeadsetRegular },
];
