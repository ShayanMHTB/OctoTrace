import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

/** Background color to flatten transparency against (resolved theme bg). */
function bgColor(): string {
  if (typeof window === 'undefined') return '#ffffff';
  return getComputedStyle(document.body).backgroundColor || '#ffffff';
}

function triggerDownload(dataUrl: string, filename: string): void {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

async function snapshot(node: HTMLElement): Promise<string> {
  return toPng(node, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: bgColor(),
  });
}

/** Render a DOM node to a PNG and download it. */
export async function downloadPng(
  node: HTMLElement,
  filename: string,
): Promise<void> {
  triggerDownload(await snapshot(node), `${filename}.png`);
}

/** Render a DOM node to a single-page PDF (page sized to the image). */
export async function downloadPdf(
  node: HTMLElement,
  filename: string,
): Promise<void> {
  const dataUrl = await snapshot(node);
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = dataUrl;
  });

  const pdf = new jsPDF({
    orientation: img.width >= img.height ? 'landscape' : 'portrait',
    unit: 'px',
    format: [img.width, img.height],
  });
  pdf.addImage(dataUrl, 'PNG', 0, 0, img.width, img.height);
  pdf.save(`${filename}.pdf`);
}
