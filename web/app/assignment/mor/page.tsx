'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MorTemplate } from '@/lib/pdf-templates';
import { decodeMorData, type MorData } from '@/lib/mor';
import { Button } from '@/components/ui/button';
import { Download, ChevronLeft } from 'lucide-react';
import { FullPageLoader } from '@/components/ui/loader';

function MorPreview() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<MorData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const b64 = searchParams.get('data');

    if (!b64) {
      setData(null);
      setError('Missing MOR data. Reopen the document from the assignment page.');
      return;
    }

    try {
      const decoded = decodeMorData(b64);
      setData(decoded);
      setError(null);
    } catch (err) {
      console.error('Failed to parse MOR data', err);
      setData(null);
      setError('This MOR document payload is invalid or incomplete.');
    }
  }, [searchParams]);

  const generatePdfAndOpen = async () => {
    const element = document.getElementById('mor-print-content');
    if (!element) return;

    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5] as [number, number, number, number],
        filename: `MOR-${data?.date || 'Asset'}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'in' as const, format: 'letter' as const, orientation: 'portrait' as const },
      };

      const worker = html2pdf().set(opt).from(element).toPdf().outputPdf('blob');
      worker.then((blob: Blob) => {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      });
    } catch (err) {
      console.error('Failed to generate PDF', err);
    }
  };

  if (!data && !error) {
    return <FullPageLoader label="Loading document..." />;
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 dark:bg-zinc-950">
      <div className="mx-auto mb-6 flex max-w-200 items-center justify-between px-4 sm:px-0 print:hidden">
        <Button
          variant="ghost"
          onClick={() => window.close()}
          className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
        >
          <ChevronLeft className="h-4 w-4 mr-2" /> Close Tab
        </Button>
        <Button
          onClick={generatePdfAndOpen}
          className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 shadow-md"
          disabled={!data}
        >
          <Download className="h-4 w-4 mr-2" /> Download PDF
        </Button>
      </div>

      {error ? (
        <div className="mx-4 rounded-3xl border border-amber-200 bg-white px-6 py-10 text-center shadow-xl ring-1 ring-slate-200 sm:mx-auto max-w-200 dark:border-amber-500/20 dark:bg-zinc-900 dark:ring-white/10">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Unable to render MOR
          </h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{error}</p>
        </div>
      ) : null}

      {data ? (
        <div className="mx-4 bg-white shadow-xl ring-1 ring-slate-200 sm:mx-auto max-w-200 dark:ring-white/10 isolate">
          <MorTemplate morData={data} />
        </div>
      ) : null}
    </div>
  );
}

export default function MorPage() {
  return (
    <Suspense fallback={<FullPageLoader label="Loading document..." />}>
      <MorPreview />
    </Suspense>
  );
}
