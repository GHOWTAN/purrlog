import React from 'react';
import { 
  Droplets, 
  Utensils, 
  Moon, 
  Gamepad2, 
  Pill, 
  Scissors, 
  Trash2 
} from 'lucide-react';
import { ActivityConfig, CatProfile } from './types';

// Custom SVG for Poop since Lucide might not have a perfect one, 
// or we simulate it with a specific icon. 
// Using Trash2 as a placeholder for waste, or a custom path if desired. 
// For fun, let's use a cloud-like shape or standard icon.
// Actually, let's stick to standard Lucide icons for consistency.
// 'Aperture' looks a bit like a stylized poop/swirl if rotated, but let's use 'Disc' or similar.
// Better yet, let's just use an Emoji in the UI for the specific icon if needed, 
// but here we use Lucide components. 
// I will use 'CloudRain' for pee and a generic 'Circle' or 'Hexagon' for poop if specific icon missing.
// Wait, Lucide has specific icons. Let's use generic abstract ones that look good.

export const ACTIVITIES: ActivityConfig[] = [
  {
    id: 'pee',
    label: 'Pee',
    icon: <Droplets size={24} />,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100'
  },
  {
    id: 'poop',
    label: 'Poop',
    icon: <div className="font-bold text-xl">💩</div>, // Emoji is sometimes clearer for this specific act
    color: 'text-amber-700',
    bgColor: 'bg-amber-100'
  },
  {
    id: 'food',
    label: 'Food',
    icon: <Utensils size={24} />,
    color: 'text-orange-500',
    bgColor: 'bg-orange-100'
  },
  {
    id: 'water',
    label: 'Water',
    icon: <Droplets size={24} className="text-cyan-500" />,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-100'
  },
  {
    id: 'play',
    label: 'Play',
    icon: <Gamepad2 size={24} />,
    color: 'text-purple-500',
    bgColor: 'bg-purple-100'
  },
  {
    id: 'sleep',
    label: 'Sleep',
    icon: <Moon size={24} />,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-100'
  },
  {
    id: 'meds',
    label: 'Meds',
    icon: <Pill size={24} />,
    color: 'text-red-500',
    bgColor: 'bg-red-100'
  },
  {
    id: 'groom',
    label: 'Groom',
    icon: <Scissors size={24} />,
    color: 'text-pink-500',
    bgColor: 'bg-pink-100'
  }
];

export const DEFAULT_CATS: CatProfile[] = [
  {
    id: 'cat_1',
    name: 'Luna',
    avatar: 'https://picsum.photos/id/40/200/200', // Using picsum as requested, though specifically a cat would be better.
    colorTheme: 'from-purple-400 to-indigo-500'
  },
  {
    id: 'cat_2',
    name: 'Oliver',
    avatar: 'https://picsum.photos/id/219/200/200', // Tiger looking
    colorTheme: 'from-orange-400 to-amber-500'
  }
];

export const STORAGE_KEYS = {
  CATS: 'purrlog_cats',
  LOGS: 'purrlog_logs',
  ACTIVE_CAT: 'purrlog_active_cat'
};
