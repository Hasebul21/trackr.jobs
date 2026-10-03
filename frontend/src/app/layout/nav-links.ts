export interface NavLink {
  path: string;
  label: string;
  // Ant Design icon name for nz-icon.
  icon: string;
}

export const NAV_LINKS: NavLink[] = [
  { path: '/', label: 'Jobs', icon: 'solution' },
  { path: '/companies', label: 'Companies', icon: 'bank' },
  { path: '/job-platforms', label: 'Platforms', icon: 'global' },
  { path: '/visa-sponsors', label: 'Visa sponsors', icon: 'send' },
  { path: '/remote', label: 'Remote', icon: 'laptop' },
  { path: '/bookmarks', label: 'Bookmarks', icon: 'book' },
  { path: '/information', label: 'Information', icon: 'user' },
  { path: '/settings', label: 'Settings', icon: 'setting' },
];
