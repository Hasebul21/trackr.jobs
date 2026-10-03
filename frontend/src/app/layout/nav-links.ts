import { IconName } from '../shared/icon/icon';

export interface NavLink {
  path: string;
  label: string;
  icon: IconName;
}

export const NAV_LINKS: NavLink[] = [
  { path: '/', label: 'Jobs', icon: 'briefcase' },
  { path: '/companies', label: 'Companies', icon: 'building' },
  { path: '/job-platforms', label: 'Platforms', icon: 'globe' },
  { path: '/visa-sponsors', label: 'Visa sponsors', icon: 'plane' },
  { path: '/remote', label: 'Remote', icon: 'laptop' },
  { path: '/bookmarks', label: 'Bookmarks', icon: 'bookmark' },
  { path: '/information', label: 'Information', icon: 'user' },
  { path: '/settings', label: 'Settings', icon: 'settings' },
];
