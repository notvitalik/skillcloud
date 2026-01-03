import { normalizeSkill, type NormalizeOptions } from './normalize';
import type { SkillItem } from './types';

export type ParseResult = {
  items: SkillItem[];
  errors: string[];
};

const defaultOptions: NormalizeOptions = {
  normalizeCase: true,
  trimWhitespace: true,
  mergeAliases: true
};

export function parseSkills(
  input: string,
  options: Partial<NormalizeOptions> = {}
): ParseResult {
  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const mergedOptions: NormalizeOptions = { ...defaultOptions, ...options };
  const items: SkillItem[] = [];
  const errors: string[] = [];

  lines.forEach((line, index) => {
    const parts = line.split(/[\t,:]/).map((p) => p.trim());
    if (parts.length < 2) {
      errors.push(`Line ${index + 1}: Expected \'Skill,Years\'`);
      return;
    }

    const [rawSkill, rawYears] = [parts[0], parts[1]];
    const years = Number(rawYears);

    if (!Number.isInteger(years) || years < 0) {
      errors.push(`Line ${index + 1}: Invalid years '${rawYears}'`);
      return;
    }

    const skill = normalizeSkill(rawSkill, mergedOptions);
    if (!skill) {
      errors.push(`Line ${index + 1}: Skill name missing`);
      return;
    }

    items.push({ skill, years });
  });

  return { items, errors };
}
