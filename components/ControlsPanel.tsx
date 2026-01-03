'use client';

import type { CloudSettings } from '../lib/types';

export type ControlsPanelProps = {
  settings: CloudSettings;
  onSettingsChange: (settings: CloudSettings) => void;
  maxYears: number;
  onGenerate: () => void;
  onRandomize: () => void;
  resumeMode: boolean;
  onResumeModeChange: (value: boolean) => void;
};

export function ControlsPanel({
  settings,
  onSettingsChange,
  maxYears,
  onGenerate,
  onRandomize,
  resumeMode,
  onResumeModeChange
}: ControlsPanelProps) {
  const update = (partial: Partial<CloudSettings>) => {
    onSettingsChange({ ...settings, ...partial });
  };

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-base font-semibold">Controls</h3>
      <div className="grid grid-cols-1 gap-4">
        <label className="flex flex-col gap-2 text-sm">
          Theme
          <select
            className="rounded-md border border-slate-200 px-2 py-1"
            value={settings.theme}
            onChange={(e) => update({ theme: e.target.value as CloudSettings['theme'] })}
          >
            <option value="midnight">Midnight</option>
            <option value="paper">Paper</option>
            <option value="neon">Neon</option>
          </select>
        </label>

        <div className="flex items-center justify-between text-sm">
          <span>Motion</span>
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-3 py-1 text-sm font-medium hover:bg-slate-50"
            onClick={() => update({ motionEnabled: !settings.motionEnabled })}
          >
            {settings.motionEnabled ? 'On' : 'Off'}
          </button>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span>Clustering</span>
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-3 py-1 text-sm font-medium hover:bg-slate-50"
            onClick={() => update({ clusteringEnabled: !settings.clusteringEnabled })}
          >
            {settings.clusteringEnabled ? 'On' : 'Off'}
          </button>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span>Resume mode</span>
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-3 py-1 text-sm font-medium hover:bg-slate-50"
            onClick={() => onResumeModeChange(!resumeMode)}
          >
            {resumeMode ? 'On' : 'Off'}
          </button>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center justify-between">
            <span>Min years: {settings.minYears}</span>
            <span className="text-xs text-slate-500">0 - {maxYears}</span>
          </div>
          <input
            type="range"
            min={0}
            max={Math.max(maxYears, 0)}
            value={settings.minYears}
            onChange={(e) => update({ minYears: Number(e.target.value) })}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onGenerate}
          className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          Generate
        </button>
        <button
          type="button"
          onClick={onRandomize}
          className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
        >
          Randomize
        </button>
      </div>
    </div>
  );
}
