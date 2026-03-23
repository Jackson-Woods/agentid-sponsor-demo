import type {
  AgentIdentity,
  AgentBlueprint,
  DummyUser,
  DummyGroup,
  SignedInUser,
  OwnerSponsorEntry,
} from '../models/types';
import { AgentIdentityStatus } from '../models/types';

// ─── Signed-in user (appearance only) ───

export const signedInUser: SignedInUser = {
  displayName: 'Megan Bowen',
  email: 'MeganB@contoso.com',
  initials: 'MB',
};

// ─── Agent Blueprints ───

export const agentBlueprints: AgentBlueprint[] = [
  {
    id: 'f1f194b0-4aa5-4b51-99a9-2bc61a5b7750',
    displayName: 'Customer Engagement Blueprint',
    createdDateTime: '2025-08-15T10:30:00Z',
  },
  {
    id: '645e0738-baf5-466b-b9c3-1474d72d386e',
    displayName: 'Internal Operations Blueprint',
    createdDateTime: '2025-09-02T14:00:00Z',
  },
];

// ─── Agent Identities (10) ───

export const agentIdentities: AgentIdentity[] = [
  {
    id: 'e2d0814a-ed03-4566-a805-b4088e63dddc',
    displayName: 'Customer Support Bot',
    status: AgentIdentityStatus.Active,
    createdDateTime: '2025-10-01T08:00:00Z',
    blueprintId: agentBlueprints[0].id,
    blueprintName: agentBlueprints[0].displayName,
    ownerCount: 2,
    sponsorCount: 3,
    hasAgentUser: true,
  },
  {
    id: '216b48e5-1d9e-4986-a9cd-89e79ad9935d',
    displayName: 'Expense Approval Agent',
    status: AgentIdentityStatus.Active,
    createdDateTime: '2025-10-15T11:30:00Z',
    blueprintId: agentBlueprints[1].id,
    blueprintName: agentBlueprints[1].displayName,
    ownerCount: 1,
    sponsorCount: 2,
    hasAgentUser: false,
  },
  {
    id: 'e40da8be-8591-4fe9-b009-a298b2ec46b3',
    displayName: 'IT Helpdesk Assistant',
    status: AgentIdentityStatus.Active,
    createdDateTime: '2025-11-03T09:15:00Z',
    blueprintId: agentBlueprints[1].id,
    blueprintName: agentBlueprints[1].displayName,
    ownerCount: 3,
    sponsorCount: 1,
    hasAgentUser: true,
  },
  {
    id: '728ad1ab-4c1c-4a7a-a98b-3acbe6764993',
    displayName: 'Sales Pipeline Agent',
    status: AgentIdentityStatus.Active,
    createdDateTime: '2025-11-20T16:45:00Z',
    blueprintId: agentBlueprints[0].id,
    blueprintName: agentBlueprints[0].displayName,
    ownerCount: 1,
    sponsorCount: 0,
    hasAgentUser: false,
  },
  {
    id: '4cefb244-57ca-410c-bfce-9cee3502fa2b',
    displayName: 'HR Onboarding Agent',
    status: AgentIdentityStatus.Disabled,
    createdDateTime: '2025-12-01T13:00:00Z',
    ownerCount: 0,
    sponsorCount: 0,
    hasAgentUser: false,
  },
  {
    id: '830d416f-2103-47ac-aa02-1ed4d5debbdd',
    displayName: 'Compliance Monitor Agent',
    status: AgentIdentityStatus.Active,
    createdDateTime: '2025-12-10T07:30:00Z',
    blueprintId: agentBlueprints[1].id,
    blueprintName: agentBlueprints[1].displayName,
    ownerCount: 2,
    sponsorCount: 1,
    hasAgentUser: true,
  },
  {
    id: '328ed936-3a31-4e14-b19b-350247f859ed',
    displayName: 'Code Review Agent',
    status: AgentIdentityStatus.Active,
    createdDateTime: '2026-01-05T10:00:00Z',
    ownerCount: 1,
    sponsorCount: 2,
    hasAgentUser: false,
  },
  {
    id: 'a6385857-004f-4eec-8fef-ccf4ad176fbb',
    displayName: 'Meeting Scheduler Agent',
    status: AgentIdentityStatus.Disabled,
    createdDateTime: '2026-01-18T15:20:00Z',
    blueprintId: agentBlueprints[0].id,
    blueprintName: agentBlueprints[0].displayName,
    ownerCount: 1,
    sponsorCount: 0,
    hasAgentUser: true,
  },
  {
    id: '627e1e5b-ec72-4872-99f2-a589086a9180',
    displayName: 'Document Classifier Agent',
    status: AgentIdentityStatus.Active,
    createdDateTime: '2026-02-03T12:10:00Z',
    ownerCount: 0,
    sponsorCount: 1,
    hasAgentUser: false,
  },
  {
    id: '8b38f36b-3597-4bb5-9f50-39fece820b29',
    displayName: 'Data Pipeline Orchestrator',
    status: AgentIdentityStatus.Active,
    createdDateTime: '2026-02-20T09:40:00Z',
    blueprintId: agentBlueprints[1].id,
    blueprintName: agentBlueprints[1].displayName,
    ownerCount: 2,
    sponsorCount: 1,
    hasAgentUser: true,
  },
];

// ─── Dummy Users (10) ───

export const dummyUsers: DummyUser[] = [
  {
    id: '1f3e44aa-096f-464f-8875-296a50c9404e',
    displayName: 'Alex Wilber',
    userPrincipalName: 'AlexW@contoso.com',
    mail: 'AlexW@contoso.com',
    userType: 'Member',
    '@odata.type': '#microsoft.graph.user',
  },
  {
    id: '22a7cb19-c582-478a-9cb7-fe06add90848',
    displayName: 'Adele Vance',
    userPrincipalName: 'AdeleV@contoso.com',
    mail: 'AdeleV@contoso.com',
    userType: 'Member',
    '@odata.type': '#microsoft.graph.user',
  },
  {
    id: '86e0f245-ad04-429b-a22f-3b8b1a89e603',
    displayName: 'Grady Archie',
    userPrincipalName: 'GradyA@contoso.com',
    mail: 'GradyA@contoso.com',
    userType: 'Member',
    '@odata.type': '#microsoft.graph.user',
  },
  {
    id: '250538a0-f0bb-459b-8c13-3c2af1646742',
    displayName: 'Miriam Graham',
    userPrincipalName: 'MiriamG@contoso.com',
    mail: 'MiriamG@contoso.com',
    userType: 'Member',
    '@odata.type': '#microsoft.graph.user',
  },
  {
    id: 'cd348548-700e-4fe1-8b69-255db13dd352',
    displayName: 'Nestor Wilke',
    userPrincipalName: 'NestorW@contoso.com',
    mail: 'NestorW@contoso.com',
    userType: 'Member',
    '@odata.type': '#microsoft.graph.user',
  },
  {
    id: '822a6f13-cd76-4ca9-8232-3b6b9f3ab494',
    displayName: 'Patti Fernandez',
    userPrincipalName: 'PattiF@contoso.com',
    mail: 'PattiF@contoso.com',
    userType: 'Member',
    '@odata.type': '#microsoft.graph.user',
  },
  {
    id: 'd54f7e2b-cee1-4a6a-8e88-8c75eea175fa',
    displayName: 'Johanna Lorenz',
    userPrincipalName: 'JohannaL@contoso.com',
    mail: 'JohannaL@contoso.com',
    userType: 'Member',
    '@odata.type': '#microsoft.graph.user',
  },
  {
    id: 'bf3b7fb7-ceea-4538-ba86-e64f72269862',
    displayName: 'Diego Siciliani',
    userPrincipalName: 'DiegoS@contoso.com',
    mail: 'DiegoS@contoso.com',
    userType: 'Guest',
    '@odata.type': '#microsoft.graph.user',
  },
  {
    id: 'd4e5be5c-4a75-4d33-8e85-7989da1b44b9',
    displayName: 'Lynne Robbins',
    userPrincipalName: 'LynneR@contoso.com',
    mail: 'LynneR@contoso.com',
    userType: 'Member',
    '@odata.type': '#microsoft.graph.user',
  },
  {
    id: '8d53a071-28fe-4204-b96c-c4c3e757e840',
    displayName: 'Pradeep Gupta',
    userPrincipalName: 'PradeepG@contoso.com',
    mail: 'PradeepG@contoso.com',
    userType: 'Guest',
    '@odata.type': '#microsoft.graph.user',
  },
];

// ─── Dummy Groups (~20) ───

export const dummyGroups: DummyGroup[] = [
  // Security Groups (5)
  {
    id: 'd7b95e26-59d3-4f25-9a07-4c6072edaea8',
    displayName: 'IT Infrastructure Team',
    mail: '',
    description: 'Core IT infrastructure management team',
    groupTypes: [],
    securityEnabled: true,
    mailEnabled: false,
    '@odata.type': '#microsoft.graph.group',
  },
  {
    id: '32a33403-0e55-4c56-9af6-6b5823e8be79',
    displayName: 'SOC Analysts',
    mail: '',
    description: 'Security Operations Center analysts',
    groupTypes: [],
    securityEnabled: true,
    mailEnabled: false,
    '@odata.type': '#microsoft.graph.group',
  },
  {
    id: '65a2beb5-01b5-4f44-85b6-05bc69a5f85c',
    displayName: 'Database Administrators',
    mail: '',
    description: 'DBA team for all production databases',
    groupTypes: [],
    securityEnabled: true,
    mailEnabled: false,
    '@odata.type': '#microsoft.graph.group',
  },
  {
    id: '5d0bd547-0548-45bc-852c-e2c025851de2',
    displayName: 'Network Operations',
    mail: '',
    description: 'Network infrastructure and operations team',
    groupTypes: [],
    securityEnabled: true,
    mailEnabled: false,
    '@odata.type': '#microsoft.graph.group',
  },
  {
    id: '9270c5f1-12fc-4dcf-9f90-7331420dd352',
    displayName: 'Identity & Access Management',
    mail: '',
    description: 'IAM engineering and operations',
    groupTypes: [],
    securityEnabled: true,
    mailEnabled: false,
    '@odata.type': '#microsoft.graph.group',
  },
  // Microsoft 365 / Unified Groups (5)
  {
    id: 'e4fa1985-4369-48c6-a4dd-a2cfac44b627',
    displayName: 'Social Marketing',
    mail: 'social-marketing@contoso.com',
    description: 'Social media marketing team',
    groupTypes: ['Unified'],
    securityEnabled: false,
    mailEnabled: true,
    '@odata.type': '#microsoft.graph.group',
  },
  {
    id: 'ce41870d-1400-4b52-ab43-369627ccb9d9',
    displayName: 'Product Design Team',
    mail: 'product-design@contoso.com',
    description: 'UX and product design',
    groupTypes: ['Unified'],
    securityEnabled: false,
    mailEnabled: true,
    '@odata.type': '#microsoft.graph.group',
  },
  {
    id: '1918b158-8da2-4734-80fc-7c019de372e4',
    displayName: 'APAC Regional Office',
    mail: 'apac-office@contoso.com',
    description: 'Asia-Pacific regional office staff',
    groupTypes: ['Unified'],
    securityEnabled: false,
    mailEnabled: true,
    '@odata.type': '#microsoft.graph.group',
  },
  {
    id: '0e8f86bd-9c5e-468d-93bf-239c572f2da5',
    displayName: 'EMEA Regional Office',
    mail: 'emea-office@contoso.com',
    description: 'Europe, Middle East & Africa regional office',
    groupTypes: ['Unified'],
    securityEnabled: false,
    mailEnabled: true,
    '@odata.type': '#microsoft.graph.group',
  },
  {
    id: 'c1fb2631-917e-4052-88c3-8864972e8ef3',
    displayName: 'Customer Success',
    mail: 'customer-success@contoso.com',
    description: 'Customer success and retention team',
    groupTypes: ['Unified'],
    securityEnabled: false,
    mailEnabled: true,
    '@odata.type': '#microsoft.graph.group',
  },
  // Dynamic Security Groups (4)
  {
    id: '13541ee3-ad39-470e-8e12-afeba0fd2ad1',
    displayName: 'All Full-Time Employees',
    mail: '',
    description: 'Dynamic group of all FTEs',
    groupTypes: ['DynamicMembership'],
    securityEnabled: true,
    mailEnabled: false,
    membershipRule: "user.employeeType -eq \"FTE\"",
    membershipRuleProcessingState: 'On',
    '@odata.type': '#microsoft.graph.group',
  },
  {
    id: 'a0702828-f60e-4cae-a056-97cf392a64a1',
    displayName: 'US-Based Employees',
    mail: '',
    description: 'All employees located in the United States',
    groupTypes: ['DynamicMembership'],
    securityEnabled: true,
    mailEnabled: false,
    membershipRule: "user.country -eq \"United States\"",
    membershipRuleProcessingState: 'On',
    '@odata.type': '#microsoft.graph.group',
  },
  {
    id: '6011b8c8-5dbf-4993-9c9d-d1e3e891a86f',
    displayName: 'Engineering Department',
    mail: '',
    description: 'All members of the Engineering department',
    groupTypes: ['DynamicMembership'],
    securityEnabled: true,
    mailEnabled: false,
    membershipRule: "user.department -eq \"Engineering\"",
    membershipRuleProcessingState: 'On',
    '@odata.type': '#microsoft.graph.group',
  },
  {
    id: '5efe21d8-2591-4dd2-9fe0-b01d8c61e6d7',
    displayName: 'Contractors - Active',
    mail: '',
    description: 'Active contractor accounts',
    groupTypes: ['DynamicMembership'],
    securityEnabled: true,
    mailEnabled: false,
    membershipRule: "user.employeeType -eq \"Contractor\" -and user.accountEnabled -eq true",
    membershipRuleProcessingState: 'On',
    '@odata.type': '#microsoft.graph.group',
  },
  // Role-Assignable Security Groups (3)
  {
    id: '630603de-6ff5-4452-9f6e-5dae85f15419',
    displayName: 'Global Admins - Tier 1',
    mail: '',
    description: 'First-tier global administrator group',
    groupTypes: [],
    securityEnabled: true,
    mailEnabled: false,
    isAssignableToRole: true,
    '@odata.type': '#microsoft.graph.group',
  },
  {
    id: '3d8ae1bc-4f06-4ae1-90be-c12b46466e3c',
    displayName: 'Application Administrators',
    mail: '',
    description: 'Application administrator role group',
    groupTypes: [],
    securityEnabled: true,
    mailEnabled: false,
    isAssignableToRole: true,
    '@odata.type': '#microsoft.graph.group',
  },
  {
    id: '7d1deeb5-4919-4254-8076-3194877ba97e',
    displayName: 'Security Readers',
    mail: '',
    description: 'Security reader role group',
    groupTypes: [],
    securityEnabled: true,
    mailEnabled: false,
    isAssignableToRole: true,
    '@odata.type': '#microsoft.graph.group',
  },
  // Mail-Enabled Security Groups (2)
  {
    id: '5770fc4e-44e9-45ed-b96c-86ea6cdfb49b',
    displayName: 'Finance Approvers',
    mail: 'finance-approvers@contoso.com',
    description: 'Finance approval chain members',
    groupTypes: [],
    securityEnabled: true,
    mailEnabled: true,
    '@odata.type': '#microsoft.graph.group',
  },
  {
    id: '5aca4cfd-7ab5-4c73-9474-2048104e54cb',
    displayName: 'Legal Review Board',
    mail: 'legal-review@contoso.com',
    description: 'Legal review and compliance board',
    groupTypes: [],
    securityEnabled: true,
    mailEnabled: true,
    '@odata.type': '#microsoft.graph.group',
  },
  // Dynamic Microsoft 365 Group (1)
  {
    id: 'e1800c53-6ff5-4007-90e9-fad9ead3fbdf',
    displayName: 'All Marketing Staff',
    mail: 'all-marketing@contoso.com',
    description: 'Dynamic group of all Marketing department staff',
    groupTypes: ['Unified', 'DynamicMembership'],
    securityEnabled: false,
    mailEnabled: true,
    membershipRule: "user.department -eq \"Marketing\"",
    membershipRuleProcessingState: 'On',
    '@odata.type': '#microsoft.graph.group',
  },
];

// ─── Pre-assigned Owners and Sponsors per Agent ───
// All sponsors are individual users (never groups).

export interface AgentOwnerSponsorSeed {
  agentId: string;
  owners: string[]; // user IDs
  sponsors: string[]; // user IDs
}

export const agentOwnersSponsorsSeed: AgentOwnerSponsorSeed[] = [
  {
    agentId: agentIdentities[0].id, // Customer Support Bot
    owners: [dummyUsers[0].id, dummyUsers[1].id], // Alex, Adele
    sponsors: [dummyUsers[2].id, dummyUsers[3].id, dummyUsers[4].id], // Grady, Miriam, Nestor
  },
  {
    agentId: agentIdentities[1].id, // Expense Approval Agent
    owners: [dummyUsers[5].id], // Patti
    sponsors: [dummyUsers[6].id, dummyUsers[7].id], // Johanna, Diego
  },
  {
    agentId: agentIdentities[2].id, // IT Helpdesk Assistant
    owners: [dummyUsers[0].id, dummyUsers[2].id, dummyUsers[8].id], // Alex, Grady, Lynne
    sponsors: [dummyUsers[9].id], // Pradeep
  },
  {
    agentId: agentIdentities[3].id, // Sales Pipeline Agent
    owners: [dummyUsers[1].id], // Adele
    sponsors: [],
  },
  {
    agentId: agentIdentities[4].id, // HR Onboarding Agent
    owners: [],
    sponsors: [],
  },
  {
    agentId: agentIdentities[5].id, // Compliance Monitor Agent
    owners: [dummyUsers[3].id, dummyUsers[6].id], // Miriam, Johanna
    sponsors: [dummyUsers[0].id], // Alex
  },
  {
    agentId: agentIdentities[6].id, // Code Review Agent
    owners: [dummyUsers[8].id], // Lynne
    sponsors: [dummyUsers[4].id, dummyUsers[5].id], // Nestor, Patti
  },
  {
    agentId: agentIdentities[7].id, // Meeting Scheduler Agent
    owners: [dummyUsers[9].id], // Pradeep
    sponsors: [],
  },
  {
    agentId: agentIdentities[8].id, // Document Classifier Agent
    owners: [],
    sponsors: [dummyUsers[7].id], // Diego
  },
  {
    agentId: agentIdentities[9].id, // Data Pipeline Orchestrator
    owners: [dummyUsers[2].id, dummyUsers[4].id], // Grady, Nestor
    sponsors: [dummyUsers[1].id], // Adele
  },
];
