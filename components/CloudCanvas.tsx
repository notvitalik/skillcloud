'use client';

import { motion, useReducedMotion } from 'framer-motion';
import cloud, { type Word } from 'd3-cloud';
import { useEffect, useMemo, useRef, useState } from 'react';
import { rng } from '../lib/rng';
import { computeWeight } from '../lib/weighting';
import type { SkillItem, CloudSettings } from '../lib/types';
import { themes } from '../lib/themes';

export type CloudCanvasProps = {
  skills: SkillItem[];
  settings: CloudSettings;
  containerRef: React.RefObject<HTMLDivElement>;
  svgRef: React.RefObject<SVGSVGElement>;
};

type CloudWord = Word & {
  text: string;
  years: number;
  fill: string;
  opacity: number;
};

const DEFAULT_SIZE = { width: 800, height: 480 };

export function CloudCanvas({ skills, settings, containerRef, svgRef }: CloudCanvasProps) {
  const prefersReducedMotion = useReducedMotion();
  const [dimensions, setDimensions] = useState(DEFAULT_SIZE);
  const [words, setWords] = useState<CloudWord[]>([]);
  const layoutRef = useRef<ReturnType<typeof cloud> | null>(null);

  const maxYears = useMemo(() => Math.max(0, ...skills.map((s) => s.years)), [skills]);
  const theme = themes[settings.theme];

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      const box = entry.contentRect;
      setDimensions({
        width: Math.max(box.width, 320),
        height: Math.max(box.height, 320)
      });
    });
    resizeObserver.observe(node);
    return () => resizeObserver.disconnect();
  }, [containerRef]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || skills.length === 0) {
      setWords([]);
      return;
    }

    const random = rng(settings.seed);
    const wordsInput: CloudWord[] = skills.map((item) => {
      const { size, opacity } = computeWeight({ years: item.years, maxYears });
      const fill = theme.accent;
      const baseWord: CloudWord = {
        text: item.skill,
        years: item.years,
        size,
        opacity,
        padding: 3,
        fill,
        rotate: (random() - 0.5) * 16,
        x: undefined,
        y: undefined
      };

      if (settings.clusteringEnabled) {
        const regions = [
          { x: [0.2, 0.4], y: [0.2, 0.4] },
          { x: [0.6, 0.8], y: [0.2, 0.4] },
          { x: [0.2, 0.4], y: [0.6, 0.8] },
          { x: [0.6, 0.8], y: [0.6, 0.8] }
        ];
        const categoryIndex = item.category ? Math.abs(item.category.charCodeAt(0)) % regions.length : 0;
        const region = regions[categoryIndex];
        const [rx, ry] = [
          node.clientWidth * (region.x[0] + (region.x[1] - region.x[0]) * random()),
          node.clientHeight * (region.y[0] + (region.y[1] - region.y[0]) * random())
        ];
        baseWord.x = rx - node.clientWidth / 2;
        baseWord.y = ry - node.clientHeight / 2;
      }

      return baseWord;
    });

    layoutRef.current?.stop();
    const layout = cloud()
      .size([dimensions.width, dimensions.height])
      .words(wordsInput as unknown as Word[])
      .padding(5)
      .rotate(() => (random() - 0.5) * 20)
      .font('Inter')
      .fontSize((d: Word) => (d as CloudWord).size)
      .random(random)
      .on('end', (calculated) => setWords(calculated as CloudWord[]));

    layoutRef.current = layout;
    layout.start();

    return () => layout.stop();
  }, [containerRef, dimensions.height, dimensions.width, maxYears, settings, skills, theme.accent]);

  const motionDisabled = prefersReducedMotion || !settings.motionEnabled;

  return (
    <div
      ref={containerRef}
      className="relative h-full min-h-[400px] w-full rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="absolute inset-4">
        {skills.length === 0 && (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            Add at least one valid skill to generate a cloud.
          </div>
        )}
        {skills.length > 0 && (
          <svg
            ref={svgRef}
            role="img"
            aria-label="Skill cloud"
            width="100%"
            height="100%"
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          >
            <g transform={`translate(${dimensions.width / 2},${dimensions.height / 2})`}>
              {words.map((word) => (
                <motion.text
                  key={`${word.text}-${word.x}-${word.y}`}
                  textAnchor="middle"
                  fontSize={word.size}
                  fontFamily="Inter, sans-serif"
                  fill={word.fill}
                  opacity={word.opacity}
                  transform={`translate(${word.x},${word.y}) rotate(${word.rotate ?? 0})`}
                  tabIndex={0}
                  className={`cursor-default select-none outline-none ${
                    motionDisabled ? '' : 'transition-transform duration-200 ease-out'
                  } ${motionDisabled ? '' : 'hover:scale-105'}`}
                  animate={motionDisabled ? undefined : { opacity: 1, scale: 1 }}
                  initial={motionDisabled ? undefined : { opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                  <title>
                    {word.text} — {word.years} years
                  </title>
                  {word.text}
                </motion.text>
              ))}
            </g>
          </svg>
        )}
      </div>
    </div>
  );
}
