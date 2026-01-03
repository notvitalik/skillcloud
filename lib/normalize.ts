const aliasMap: Record<string, string> = {
  'ms-sql': 'SQL Server',
  'sql server': 'SQL Server',
  'mssql': 'SQL Server',
  '.net': '.NET',
  'c sharp': 'C#'
};

function titleCase(text: string) {
  return text
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

export type NormalizeOptions = {
  normalizeCase: boolean;
  trimWhitespace: boolean;
  mergeAliases: boolean;
};

export function normalizeSkill(skill: string, options: NormalizeOptions): string {
  let normalized = options.trimWhitespace ? skill.trim().replace(/\s+/g, ' ') : skill;

  if (options.normalizeCase) {
    normalized = titleCase(normalized);
  }

  if (options.mergeAliases) {
    const key = normalized.toLowerCase();
    if (aliasMap[key]) {
      normalized = aliasMap[key];
    }
  }

  return normalized;
}
