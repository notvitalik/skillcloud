export type SkillItem = {
  skill: string;
  years: number;
  category?: string;
};

export type CloudSettings = {
  theme: 'midnight' | 'paper' | 'neon';
  motionEnabled: boolean;
  clusteringEnabled: boolean;
  minYears: number;
  seed: number;
};

export type ParsedSkillRow = {
  raw: string;
  parsed?: SkillItem;
  error?: string;
};
