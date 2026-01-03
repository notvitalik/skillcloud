import type { CSSProperties } from 'react';

export type ThemeToken = {
  name: string;
  background: string;
  card: string;
  text: string;
  accent: string;
};

export const themes: Record<'midnight' | 'paper' | 'neon', ThemeToken> = {
  midnight: {
    name: 'Midnight',
    background: '#0b1021',
    card: '#11172d',
    text: '#e5ecff',
    accent: '#7dd3fc'
  },
  paper: {
    name: 'Paper',
    background: '#f7f4ef',
    card: '#ffffff',
    text: '#1f2937',
    accent: '#e11d48'
  },
  neon: {
    name: 'Neon',
    background: '#0b0f1a',
    card: '#111827',
    text: '#e0f2fe',
    accent: '#a855f7'
  }
};

export function themeStyles(themeKey: keyof typeof themes): CSSProperties {
  const theme = themes[themeKey];
  return {
    backgroundColor: theme.card,
    color: theme.text
  };
}
