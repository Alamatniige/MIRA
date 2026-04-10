'use client';

import React from 'react';
import type { MorData } from '@/lib/mor';

interface MorTemplateProps {
  morData: MorData;
}

function formatDocumentDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function MorTemplate({ morData }: MorTemplateProps) {
  return (
    <>
      <div
        id="mor-print-content"
        className="bg-white w-full max-w-200 shadow-sm border border-slate-200 px-10 py-12 md:px-16 md:py-16 text-black relative print:shadow-none print:border-0 print:p-0 print:m-0 mx-auto"
        style={{
          fontFamily: '"Times New Roman", Times, serif',
          minHeight: '1050px',
        }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none grayscale print:opacity-5">
          <img src="/mira.png" alt="MIRA Logo Background" className="w-96 h-auto grayscale opacity-50" crossOrigin="anonymous" />
        </div>

        {/* Header / Letterhead */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between pb-6 mb-8 relative">
          <div className="absolute bottom-0 w-full h-1 bg-slate-900"></div>
          <div className="absolute bottom-1.5 w-full h-px bg-slate-900"></div>
          <div className="flex items-center gap-4">
            <img src="/mira.png" alt="MIRA Logo" className="h-16 w-auto object-contain" crossOrigin="anonymous" />
            <div className="flex flex-col justify-center">
              <h2 className="text-4xl font-black tracking-tight m-0 p-0 text-slate-900 font-sans leading-none">
                MIRA
              </h2>
              <p className="text-xs uppercase tracking-[0.25em] font-sans mt-2 text-slate-600 font-bold leading-none">
                Asset Management System
              </p>
            </div>
          </div>
          <div className="text-right mt-4 md:mt-0 font-sans">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
              Document Reference
            </p>
            <p className="text-sm font-bold font-mono tracking-wider text-slate-800 bg-slate-100 px-3 py-1 rounded-[4px] inline-block border border-slate-200">
              {morData.referenceNumber}
            </p>
          </div>
        </div>

        {/* Document Title */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold uppercase tracking-[0.15em] text-slate-900">
            Memorandum of Receipt
          </h1>
          <div className="w-16 h-0.5 bg-[#0F766E] mx-auto mt-4 mb-3"></div>
          <p className="text-[13px] italic text-slate-600 font-serif">For IT Asset Assignment & Accountability</p>
        </div>

        {/* Date Section */}
        <div className="flex justify-between mb-8 text-sm">
          <div>
            <span className="font-bold">Date:</span>{' '}
            {formatDocumentDate(morData.date || new Date().toISOString())}
          </div>
          <div>

          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-6 text-[15px] leading-relaxed text-slate-800 text-justify">
          <p>
            This <span className="font-bold">Memorandum of Receipt (MOR)</span> serves to officially document the transfer of custody of the IT hardware asset detailed below from the issuing administrator to the named assignee.
          </p>

          <div className="bg-slate-50/50 border border-slate-200 rounded-lg p-6 my-8 font-sans shadow-none md:shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Recipient</p>
                <p className="font-bold text-slate-900 text-[15px]">{morData.assigneeName}</p>
                <p className="text-xs text-slate-500 mt-0.5">{morData.department}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Asset Details</p>
                <div className="inline-flex font-mono text-[13px] tracking-tight bg-white border border-slate-200 px-2.5 py-1 text-slate-800 shadow-none md:shadow-[0_1px_2px_rgba(0,0,0,0.05)] font-semibold rounded-[4px]">
                  {morData.assetLabel}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Issued By</p>
                <p className="font-bold text-slate-900 text-[15px]">{morData.issuerName}</p>
                <p className="text-xs text-slate-500 mt-0.5">{morData.issuerDepartment || 'IT Department'}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Date of Issue</p>
                <p className="font-semibold text-slate-800 text-[15px]">
                  {formatDocumentDate(morData.date || new Date().toISOString())}
                </p>
              </div>
            </div>
          </div>

          {morData.notes && (
            <div className="my-6">
              <p className="font-bold mb-2 text-sm text-slate-900 uppercase tracking-wider font-sans">Additional Notes & Conditions</p>
              <div className="p-4 bg-[rgb(255,251,235)] border-l-4 border-amber-400 italic text-[14px] text-slate-700">
                &quot;{morData.notes}&quot;
              </div>
            </div>
          )}

          <p>
            I hereby acknowledge receipt of the asset(s) listed above in good working condition. By affixing my signature below, I understand and agree to the following terms:
          </p>

          <ol className="list-decimal pl-5 space-y-3 mt-4 ml-4 font-serif marker:font-bold marker:text-slate-500">
            <li><span className="font-semibold text-slate-900">Proper Care:</span> I am solely responsible for the proper care, security, and maintenance of this equipment.</li>
            <li><span className="font-semibold text-slate-900">Ownership:</span> The asset remains the exclusive property of the organization.</li>
            <li><span className="font-semibold text-slate-900">Reporting:</span> I will immediately report any loss, theft, damage, or malfunction to the IT Department.</li>
            <li><span className="font-semibold text-slate-900">Surrender:</span> I will surrender this asset in its current working condition (subject to normal wear and tear) upon separation from the company, or immediately upon request by Management.</li>
          </ol>
        </div>

        {/* Signatures */}
        <div className="mt-20 pt-8">
          <div className="grid grid-cols-2 gap-16 font-sans">
            <div>
              <p className="text-[10px] mb-12 text-slate-500 uppercase tracking-widest font-bold">
                Acknowledged & Received By
              </p>
              <div className="border-b border-slate-800 pb-1 mb-2 h-8 relative">
                {/* Signature goes here */}
              </div>
              <p className="font-black text-slate-900 uppercase tracking-wide text-sm">{morData.assigneeName}</p>
              <p className="text-[11px] text-slate-500 uppercase tracking-wider mt-0.5">{morData.department}</p>
              <div className="mt-6 flex gap-3 items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date</span>
                <div className="border-b border-slate-300 w-full max-w-[140px]"></div>
              </div>
            </div>

            <div>
              <p className="text-[10px] mb-12 text-slate-500 uppercase tracking-widest font-bold">
                Issued & Verified By
              </p>
              <div className="border-b border-slate-800 pb-1 mb-2 h-8 relative">
                {/* Signature goes here */}
              </div>
              <p className="font-black text-slate-900 uppercase tracking-wide text-sm">{morData.issuerName}</p>
              <p className="text-[11px] text-slate-500 uppercase tracking-wider mt-0.5">{morData.issuerDepartment || 'IT Department'}</p>
              <div className="mt-6 flex gap-3 items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date</span>
                <div className="border-b border-slate-300 w-full max-w-[140px]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          /* Hide everything else */
          body > *:not(.print-container),
          [data-radix-portal] > *:not(:has(.print-container)) {
            display: none !important;
          }

          /* Hide modal bits that aren't the document */
          [role='dialog'] > *:not(.print-container),
          .modal-header,
          .modal-footer {
            display: none !important;
          }

          /* Reset body for print */
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          @page {
            size: portrait;
            margin: 20mm;
          }

          /* Strip the modal container itself */
          [role='dialog'],
          [data-radix-portal] [data-state='open'] {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            position: static !important;
            width: 100% !important;
            max-width: none !important;
          }

          /* Hide the overlay backdrops */
          [data-radix-portal] > div {
            background: transparent !important;
            display: none !important;
          }
          [data-radix-portal] > div:has([role='dialog']) {
            display: block !important;
            background: transparent !important;
          }
        }
      `}</style>
    </>
  );
}
