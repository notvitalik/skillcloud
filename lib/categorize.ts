import type { SkillItem } from './types';

const categoryMap: Record<string, string> = {
  python: 'Languages',
  javascript: 'Languages',
  typescript: 'Languages',
  java: 'Languages',
  'c#': 'Languages',
  csharp: 'Languages',
  sql: 'Databases',
  'sql server': 'Databases',
  postgres: 'Databases',
  postgresql: 'Databases',
  mysql: 'Databases',
  mongodb: 'Databases',
  aws: 'Cloud',
  azure: 'Cloud',
  gcp: 'Cloud',
  kubernetes: 'Cloud',
  docker: 'Cloud',
  apis: 'APIs',
  rest: 'APIs',
  graphql: 'APIs',
  jquery: 'Tools',
  react: 'Tools',
  nextjs: 'Tools'
};

export function categorizeSkills(skills: SkillItem[]): SkillItem[] {
  return skills.map((item) => {
    const key = item.skill.toLowerCase();
    const category = categoryMap[key] ?? 'Other';
    return { ...item, category };
  });
}
