export interface NavigationItem {
  title: string;
  url: string;
  icon: any;
  color: string;
}

export interface UserData {
  name: string;
  email: string;
  avatar: string;
  initials: string;
}

export interface StatsCardData {
  title: string;
  value: string | number;
  subtitle: string;
  icon: any;
  iconColor?: string;
  subtitleColor?: string;
  valuePrefix?: string;
  valueSuffix?: string;
}