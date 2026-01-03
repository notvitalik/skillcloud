'use client';

import { useMemo, useRef, useState } from 'react';
import { SkillInputPanel } from '../components/SkillInputPanel';
import { ControlsPanel } from '../components/ControlsPanel';
import { CloudCanvas } from '../components/CloudCanvas';
import { ExportBar } from '../components/ExportBar';
import { ResumeMode } from '../components/ResumeMode';
import { parseSkills } from '../lib/parseSkills';
import type { NormalizeOptions } from '../lib/normalize';
import type { CloudSettings, SkillItem } from '../lib/types';
import { randomSeed } from '../lib/rng';
import { categorizeSkills } from '../lib/categorize';
import { themes } from '../lib/themes';

const sampleData = `.NET,5\nC#,5\nSQL,7\nPython,4\nJavaScript,6\nAzure,3`;

export default function Page() {
  const [inputValue, setInputValue] = useState(sampleData);
  const [normalizeOptions, setNormalizeOptions] = useState<NormalizeOptions>({
    normalizeCase: true,
    trimWhitespace: true,
    mergeAliases: true
  });
  const [manualSkills, setManualSkills] = useState<SkillItem[]>([]);
  const [settings, setSettings] = useState<CloudSettings>({
    theme: 'midnight',
    motionEnabled: true,
    clusteringEnabled: false,
    minYears: 0,
    seed: randomSeed()
  });
  const [resumeMode, setResumeMode] = useState(false);
  const [resumeFormat, setResumeFormat] = useState<'bullets' | 'comma'>('bullets');
  const [mobilePanelOpen, setMobilePanelOpen] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  const parsed = useMemo(() => parseSkills(inputValue, normalizeOptions), [inputValue, normalizeOptions]);

  const combinedSkills = useMemo(() => {
    const cleanedManual = manualSkills.filter((item) => Number.isFinite(item.years) && item.years >= 0);
    return [...parsed.items, ...cleanedManual];
  }, [manualSkills, parsed.items]);

  const filteredSkills = useMemo(() => {
    const base = combinedSkills.filter((skill) => skill.years >= settings.minYears);
    return settings.clusteringEnabled ? categorizeSkills(base) : base;
  }, [combinedSkills, settings.clusteringEnabled, settings.minYears]);

  const maxYears = useMemo(() => Math.max(0, ...combinedSkills.map((s) => s.years)), [combinedSkills]);

  const sharePayload = useMemo(
    () => ({
      version: 1,
      skills: combinedSkills,
      settings: { ...settings }
    }),
    [combinedSkills, settings]
  );

  const handleGenerate = () => {
    setSettings((prev) => ({ ...prev, seed: randomSeed() }));
  };

  const handleLoadSample = () => setInputValue(sampleData);

  const handleLoadJson = (payload: unknown) => {
    if (typeof payload !== 'object' || payload === null) return;
    const data = payload as { skills?: SkillItem[]; settings?: Partial<CloudSettings> };
    if (Array.isArray(data.skills) && data.skills.length > 0) {
      const text = data.skills.map((item) => `${item.skill}\t${item.years}`).join('\n');
      setInputValue(text);
      setManualSkills([]);
    }
    if (data.settings) {
      setSettings((prev) => ({ ...prev, ...data.settings, seed: randomSeed() }));
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100"
      style={{ backgroundColor: themes[settings.theme].background, color: themes[settings.theme].text }}
    >
      <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">Responsive Web App</p>
            <h1 className="text-3xl font-bold">Skill Cloud Generator</h1>
            <p className="text-slate-500">Input skills, generate a beautiful animated word cloud, and export or share.</p>
          </div>
          <div className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white shadow-sm">
            {filteredSkills.length} skills loaded
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[360px,1fr]">
          <aside className="lg:sticky lg:top-4 lg:self-start">
            <div className="mb-3 flex items-center justify-between lg:hidden">
              <h2 className="text-lg font-semibold">Inputs</h2>
              <button
                type="button"
                className="rounded-lg border border-slate-200 px-3 py-1 text-sm font-medium hover:bg-slate-50"
                onClick={() => setMobilePanelOpen((open) => !open)}
              >
                {mobilePanelOpen ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className={`${mobilePanelOpen ? 'block' : 'hidden'} space-y-4 lg:block`}>
              <SkillInputPanel
                inputValue={inputValue}
                onInputChange={setInputValue}
                errors={parsed.errors}
                normalizeOptions={normalizeOptions}
                onNormalizeOptionsChange={setNormalizeOptions}
                manualSkills={manualSkills}
                onManualSkillsChange={setManualSkills}
                onLoadSample={handleLoadSample}
              />
              <ControlsPanel
                settings={settings}
                onSettingsChange={setSettings}
                maxYears={maxYears}
                onGenerate={handleGenerate}
                onRandomize={handleGenerate}
                resumeMode={resumeMode}
                onResumeModeChange={setResumeMode}
              />
            </div>
          </aside>

          <main className="space-y-4">
            <ExportBar svgRef={svgRef} exportRef={exportRef} sharePayload={sharePayload} onLoadFromJson={handleLoadJson} />
            <div ref={exportRef} className="space-y-3 rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-lg backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-wide text-slate-500">Skill Cloud</p>
                  <h2 className="text-xl font-semibold">Generated from {filteredSkills.length} skills</h2>
                </div>
                <div className="text-sm text-slate-500">Seed: {settings.seed}</div>
              </div>
              <CloudCanvas
                skills={filteredSkills}
                settings={settings}
                containerRef={containerRef}
                svgRef={svgRef}
              />
            </div>
            {resumeMode && (
              <ResumeMode skills={filteredSkills} format={resumeFormat} onFormatChange={setResumeFormat} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
