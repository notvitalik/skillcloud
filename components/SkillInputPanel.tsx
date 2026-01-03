'use client';

import { useRef } from 'react';
import type { NormalizeOptions } from '../lib/normalize';
import { normalizeSkill } from '../lib/normalize';
import type { SkillItem } from '../lib/types';

export type SkillInputPanelProps = {
  inputValue: string;
  onInputChange: (value: string) => void;
  errors: string[];
  normalizeOptions: NormalizeOptions;
  onNormalizeOptionsChange: (options: NormalizeOptions) => void;
  manualSkills: SkillItem[];
  onManualSkillsChange: (items: SkillItem[]) => void;
  onLoadSample: () => void;
};

function updateManualSkill(
  items: SkillItem[],
  index: number,
  key: keyof SkillItem,
  value: string,
  options: NormalizeOptions
) {
  return items.map((item, i) =>
    i === index
      ? {
          ...item,
          [key]:
            key === 'years'
              ? Math.max(0, Math.round(Number(value))) || 0
              : normalizeSkill(value, {
                  normalizeCase: options.normalizeCase,
                  trimWhitespace: options.trimWhitespace,
                  mergeAliases: options.mergeAliases
                })
        }
      : item
  );
}

export function SkillInputPanel({
  inputValue,
  onInputChange,
  errors,
  normalizeOptions,
  onNormalizeOptionsChange,
  manualSkills,
  onManualSkillsChange,
  onLoadSample
}: SkillInputPanelProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const text = await file.text();
    const appended = inputValue ? `${inputValue}\n${text}` : text;
    onInputChange(appended);
  };

  const addManualRow = () => {
    onManualSkillsChange([...manualSkills, { skill: 'New Skill', years: 1 }]);
  };

  const removeManualRow = (index: number) => {
    onManualSkillsChange(manualSkills.filter((_, i) => i !== index));
  };

  const toggleOption = (key: keyof NormalizeOptions) => {
    onNormalizeOptionsChange({ ...normalizeOptions, [key]: !normalizeOptions[key] });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">Skills</h2>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-lg bg-blue-600 px-3 py-1 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            onClick={onLoadSample}
          >
            Load sample
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-3 py-1 text-sm font-medium hover:bg-slate-50"
            onClick={() => fileRef.current?.click()}
          >
            Upload CSV
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv,text/plain"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Paste table (Skill[TAB|,|:]Years)
        </label>
        <textarea
          className="min-h-[160px] w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={`SQL\t7\nC#\t5\nPython,4`}
        />
        {errors.length > 0 && (
          <div className="mt-2 space-y-1 text-sm text-red-600">
            {errors.map((err) => (
              <p key={err}>{err}</p>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <p className="text-sm font-medium text-slate-700">Normalization</p>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={normalizeOptions.normalizeCase}
              onChange={() => toggleOption('normalizeCase')}
            />
            Normalize case
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={normalizeOptions.trimWhitespace}
              onChange={() => toggleOption('trimWhitespace')}
            />
            Trim & collapse whitespace
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={normalizeOptions.mergeAliases}
              onChange={() => toggleOption('mergeAliases')}
            />
            Merge aliases
          </label>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-700">Manual rows</p>
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-3 py-1 text-sm font-medium hover:bg-slate-50"
            onClick={addManualRow}
          >
            + Add row
          </button>
        </div>
        <div className="space-y-2">
          {manualSkills.map((item, index) => (
            <div
              key={`${item.skill}-${index}`}
              className="flex items-center gap-2 rounded-lg border border-slate-200 p-2"
            >
              <input
                type="text"
                value={item.skill}
                onChange={(e) =>
                  onManualSkillsChange(
                    updateManualSkill(manualSkills, index, 'skill', e.target.value, normalizeOptions)
                  )
                }
                className="flex-1 rounded-md border border-slate-200 px-2 py-1 text-sm"
                placeholder="Skill"
              />
              <input
                type="number"
                min={0}
                value={item.years}
                onChange={(e) =>
                  onManualSkillsChange(
                    updateManualSkill(manualSkills, index, 'years', e.target.value, normalizeOptions)
                  )
                }
                className="w-24 rounded-md border border-slate-200 px-2 py-1 text-sm"
                placeholder="Years"
              />
              <button
                type="button"
                className="text-sm text-slate-600 hover:text-red-600"
                onClick={() => removeManualRow(index)}
                aria-label={`Remove ${item.skill}`}
              >
                ✕
              </button>
            </div>
          ))}
          {manualSkills.length === 0 && (
            <p className="text-sm text-slate-500">No manual rows yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
