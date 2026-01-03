import { toPng } from 'html-to-image';

export async function exportPng(node: HTMLElement | null, filename = 'skill-cloud.png', scale = 1) {
  if (!node) return;
  const dataUrl = await toPng(node, {
    pixelRatio: scale,
    cacheBust: true
  });
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}
