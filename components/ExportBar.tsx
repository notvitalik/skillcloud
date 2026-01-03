'use client';

import { useState } from 'react';
import { exportSvg } from '../lib/exportSvg';
import { exportPng } from '../lib/exportPng';

export type ExportBarProps = {
  svgRef: React.RefObject<SVGSVGElement>;
  exportRef: React.RefObject<HTMLElement>;
  sharePayload: Record<string, unknown>;
  onLoadFromJson?: (payload: unknown) => void;
};

export function ExportBar({ svgRef, exportRef, sharePayload, onLoadFromJson }: ExportBarProps) {
  const [loadValue, setLoadValue] = useState('');
  const [copied, setCopied] = useState(false);

  const copyShareJson = async () => {
    const serialized = JSON.stringify(sharePayload, null, 2);
    await navigator.clipboard.writeText(serialized);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const loadFromJson = () => {
    if (!onLoadFromJson) return;
    try {
      const parsed = JSON.parse(loadValue);
      onLoadFromJson(parsed);
    } catch (error) {
      console.error('Invalid JSON payload', error);
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-end">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50"
          onClick={() => exportSvg(svgRef.current)}
          aria-label="Export SVG"
        >
          Export SVG
        </button>
        <button
          type="button"
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50"
          onClick={() => exportPng(exportRef.current, 'skill-cloud.png', 2)}
          aria-label="Export PNG"
        >
          Export PNG
        </button>
        <button
          type="button"
          className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
          onClick={copyShareJson}
          aria-label="Copy share JSON"
        >
          {copied ? 'Copied!' : 'Copy Share JSON'}
        </button>
      </div>
      {onLoadFromJson && (
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <textarea
            className="min-h-[60px] w-full flex-1 rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs"
            placeholder="Paste JSON to restore"
            value={loadValue}
            onChange={(e) => setLoadValue(e.target.value)}
          />
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50"
            onClick={loadFromJson}
          >
            Load JSON
          </button>
        </div>
      )}
    </div>
  );
}
