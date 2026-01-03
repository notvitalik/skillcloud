'use client';

import { useMemo } from 'react';
import type { SkillItem } from '../lib/types';

export type ResumeModeProps = {
  skills: SkillItem[];
  format: 'bullets' | 'comma';
  onFormatChange: (format: 'bullets' | 'comma') => void;
};

export function ResumeMode({ skills, format, onFormatChange }: ResumeModeProps) {
  const sorted = useMemo(
    () => [...skills].sort((a, b) => b.years - a.years || a.skill.localeCompare(b.skill)),
    [skills]
  );

  const listText = sorted.map((item) => `${item.skill} — ${item.years} years`).join(', ');

  const copyList = async () => {
    await navigator.clipboard.writeText(listText);
  };

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Resume Mode</h3>
        <div className="flex items-center gap-2 text-sm">
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="resume-format"
              checked={format === 'bullets'}
              onChange={() => onFormatChange('bullets')}
            />
            Bullets
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="resume-format"
              checked={format === 'comma'}
              onChange={() => onFormatChange('comma')}
            />
            Comma
          </label>
        </div>
      </div>
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
        {format === 'bullets' ? (
          <ul className="list-disc space-y-1 pl-5">
            {sorted.map((item) => (
              <li key={item.skill}>
                {item.skill} — {item.years} year{item.years === 1 ? '' : 's'}
              </li>
            ))}
          </ul>
        ) : (
          <p>{listText}</p>
        )}
      </div>
      <button
        type="button"
        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        onClick={copyList}
      >
        Copy list
      </button>
    </div>
  );
}
