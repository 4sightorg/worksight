export type Section = {
  title: string;
  url: string;
  isActive?: boolean;
  icon?: string;
  adminOnly?: boolean;
  managerOnly?: boolean;
};

export type SectionGroup = {
  title: string;
  url: string;
  items: Section[];
  adminOnly?: boolean;
  managerOnly?: boolean;
};

type SectionData = {
  parts: string[];
  sections: SectionGroup[];
  defaultPart: string;
  defaultSection: string;
  defaultSectionIndex?: number;
};

export const sections: SectionData = {
  parts: ['Employee', 'Manager', 'Admin'],
  sections: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      items: [
        {
          title: 'Overview',
          url: '/dashboard',
          isActive: false,
        },
        {
          title: 'My Tasks',
          url: '/tasks',
          isActive: false,
        },
      ],
    },
    {
      title: 'Assessment',
      url: '/survey',
      items: [
        {
          title: 'Burnout Survey',
          url: '/survey',
          isActive: false,
        },
        {
          title: 'Results',
          url: '/survey/results',
          isActive: false,
        },
      ],
    },
    {
      title: 'Management',
      url: '/admin',
      managerOnly: true,
      items: [
        {
          title: 'Admin Dashboard',
          url: '/admin',
          isActive: false,
          managerOnly: true,
        },
        {
          title: 'User Management',
          url: '/admin/users',
          isActive: false,
          adminOnly: true,
        },
        {
          title: 'Survey Management',
          url: '/admin/surveys',
          isActive: false,
          managerOnly: true,
        },
        {
          title: 'Analytics',
          url: '/admin/reports',
          isActive: false,
          managerOnly: true,
        },
      ],
    },
  ],
  defaultPart: 'Employee',
  defaultSection: 'Dashboard',
  defaultSectionIndex: 0,
};
