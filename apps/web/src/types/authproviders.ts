import { IconType } from 'react-icons/lib';
import { SiDiscord, SiFacebook, SiGithub, SiGoogle } from 'react-icons/si';

export type OAuthProvider = {
  name: 'google' | 'github' | 'discord' | 'facebook';
  displayName: string;
  icon: IconType;
  url?: string;
};

export const OAuthProviders: OAuthProvider[] = [
  { name: 'google', displayName: 'Google', icon: SiGoogle },
  { name: 'github', displayName: 'GitHub', icon: SiGithub },
  { name: 'discord', displayName: 'Discord', icon: SiDiscord },
  { name: 'facebook', displayName: 'Facebook', icon: SiFacebook },
];
