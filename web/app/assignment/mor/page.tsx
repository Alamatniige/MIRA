'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MorTemplate } from '@/lib/pdf-templates';
import { Button } from '@/components/ui/button';
import { Download, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { FullPageLoader } from '@/components/ui/loader';

function MorPreview() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const b64 = searchParams.get('data');
    if (b64) {
      try {
        const decoded = JSON.parse(atob(decodeURIComponent(b64)));
        setData(decoded);
      } catch (err) {
        console.error('Failed to parse MOR data', err);
      }
    }
  }, [searchParams]);

  const generatePdfAndOpen = async () => {
    const element = document.getElementById('mor-print-hidden-content');
    if (!element) return;

    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5] as [number, number, number, number],
        filename: `MOR-${data?.date || 'Asset'}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'in' as const, format: 'letter' as const, orientation: 'portrait' as const }
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

  if (!data) {
    return <FullPageLoader label="Loading document..." />;
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 dark:bg-zinc-950">
      <div className="mx-auto max-w-[800px] mb-6 flex items-center justify-between px-4 sm:px-0 print:hidden">
        <Button variant="ghost" onClick={() => window.close()} className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-100">
          <ChevronLeft className="h-4 w-4 mr-2" /> Close Tab
        </Button>
        <Button 
          onClick={generatePdfAndOpen}
          className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 shadow-md"
        >
          <Download className="h-4 w-4 mr-2" /> Download PDF
        </Button>
      </div>

      <div className="mx-4 sm:mx-auto max-w-[800px] bg-white shadow-xl ring-1 ring-slate-200 dark:ring-white/10 isolate">
        <MorTemplate morData={data} />
      </div>

      {/* Hidden container for PDF generation */}
      <div id="mor-print-hidden-content" className="fixed left-[-9999px] top-0 opacity-0 pointer-events-none">
        <MorTemplate morData={data} />
      </div>
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
