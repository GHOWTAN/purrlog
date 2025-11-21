import { ReactNode } from 'react';

export type ActivityType = 'pee' | 'poop' | 'food' | 'water' | 'play' | 'sleep' | 'meds' | 'groom';

export interface ActivityConfig {
  id: ActivityType;
  label: string;
  icon: ReactNode;
  color: string;
  bgColor: string;
}

export interface LogEntry {
  id: string;
  catId: string;
  type: ActivityType;
  timestamp: number; // Unix timestamp
  notes?: string;
}

export interface CatProfile {
  id: string;
  name: string;
  avatar: string; // URL or Emoji
  colorTheme: string;
  birthDate?: string;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}
