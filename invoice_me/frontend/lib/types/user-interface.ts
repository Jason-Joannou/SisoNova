import { ServiceQuickStats } from "./dashboard";

export interface buttonWithIconInformation {
  buttonText: string;
  buttonIcon: any;
  buttonVariant: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
  buttonSize: "icon" | "default" | "sm" | "lg" | null | undefined;
  onClick: () => void;
  buttonColor?: string;
  buttonTextColor?: string;
  buttonHoverColor?: string;
}
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

export interface ServiceCardData {
  title: string;
  description: string;
  serviceClassColor: string;
  quickStatsColor: string;
  icon: any;
  inconColor?: string;
  subtitleColor?: string;
  buttonInformation: buttonWithIconInformation[];
  serviceStats: ServiceQuickStats[];
}
