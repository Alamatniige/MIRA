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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none grayscale print:opacity-[0.05]">
          <div className="flex items-center gap-2 justify-center text-7xl font-bold tracking-tighter">
            <span className="bg-black text-white px-2 py-1">MI</span>RA
          </div>
        </div>

        {/* Header / Letterhead */}
        <div className="border-b-2 border-black pb-4 mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tighter m-0 p-0 flex items-center gap-1.5 font-sans">
              <span className="bg-black text-white px-1.5 py-0.5 text-xl">MI</span>RA
            </h2>
            <p className="text-[10px] uppercase tracking-widest font-sans mt-0.5 text-gray-600 font-bold">
              Asset Management System
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-sans font-bold">
              Document Ref
            </p>
            <p className="text-sm font-bold font-mono">{morData.referenceNumber}</p>
          </div>
        </div>

        {/* Document Title */}
        <div className="text-center mb-10">
          <h1 className="text-xl font-bold uppercase underline underline-offset-4 decoration-2">
            Memorandum of Receipt
          </h1>
          <p className="mt-2 text-sm italic">For IT Asset Assignment & Accountability</p>
        </div>

        {/* Date Section */}
        <div className="flex justify-between mb-8 text-sm">
          <div>
            <span className="font-bold">Date:</span>{' '}
            {formatDocumentDate(morData.date || new Date().toISOString())}
          </div>
          <div>
            <span className="font-bold">Status:</span>
            <span className="ml-2 uppercase border border-black px-2 py-0.5 text-[10px] font-bold tracking-wider font-sans">
              {morData.status || 'Pending'}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-6 text-[15px] leading-relaxed">
          <p>
            This Memorandum of Receipt (MOR) serves to officially document the transfer of custody
            of the IT hardware asset detailed below from the issuing administrator to the named
            assignee.
          </p>

          <div className="pl-6 border-l-2 border-black py-2 my-6">
            <div className="grid grid-cols-[120px_1fr] gap-y-3">
              <div className="font-bold text-gray-600 uppercase text-xs tracking-wider pt-0.5">
                Recipient
              </div>
              <div className="font-bold text-base">{morData.assigneeName}</div>

              <div className="font-bold text-gray-600 uppercase text-xs tracking-wider pt-0.5">
                Department
              </div>
              <div>{morData.department}</div>

              <div className="font-bold text-gray-600 uppercase text-xs tracking-wider pt-0.5">
                Asset Details
              </div>
              <div className="font-bold text-base bg-gray-100 px-2 py-1 inline-block w-fit font-sans">
                {morData.assetLabel}
              </div>

              <div className="font-bold text-gray-600 uppercase text-xs tracking-wider pt-0.5">
                Issued By
              </div>
              <div className="font-bold text-base">{morData.issuerName}</div>

              <div className="font-bold text-gray-600 uppercase text-xs tracking-wider pt-0.5">
                Issuer Unit
              </div>
              <div>{morData.issuerDepartment || 'IT Department'}</div>
            </div>
          </div>

          {morData.notes && (
            <div className="my-6">
              <p className="font-bold mb-1">Additional Notes & Conditions:</p>
              <div className="p-4 bg-gray-50 border border-gray-300 italic text-sm">
                &quot;{morData.notes}&quot;
              </div>
            </div>
          )}

          <p>
            I hereby acknowledge receipt of the asset(s) listed above in good working condition. By
            affixing my signature below, I understand and agree to the following terms:
          </p>

          <ul className="list-disc pl-8 space-y-2 mt-4 ml-4">
            <li>
              I am solely responsible for the proper care, security, and maintenance of this
              equipment.
            </li>
            <li>The asset remains the exclusive property of the organization.</li>
            <li>
              I will immediately report any loss, theft, damage, or malfunction to the IT
              Department.
            </li>
            <li>
              I will surrender this asset in its current working condition (subject to normal wear
              and tear) upon separation from the company, or immediately upon request by Management.
            </li>
          </ul>
        </div>

        {/* Signatures */}
        <div className="mt-20 pt-10 border-t border-gray-300">
          <div className="grid grid-cols-2 gap-16">
            <div>
              <p className="text-xs mb-10 text-gray-500 uppercase tracking-widest font-sans font-bold">
                Acknowledged & Received By:
              </p>
              <div className="border-b border-black pb-1 mb-2 h-10 flex items-end">
                {/* Signature goes here */}
              </div>
              <p className="font-bold text-sm">{morData.assigneeName}</p>
              <p className="text-xs text-gray-600">{morData.department}</p>
              <div className="mt-4 flex gap-2 items-center">
                <span className="text-xs">Date:</span>
                <div className="border-b border-gray-400 w-32"></div>
              </div>
            </div>

            <div>
              <p className="text-xs mb-10 text-gray-500 uppercase tracking-widest font-sans font-bold">
                Issued & Verified By:
              </p>
              <div className="border-b border-black pb-1 mb-2 h-10 flex items-end">
                {/* Signature goes here */}
              </div>
              <p className="font-bold text-sm">{morData.issuerName}</p>
              <p className="text-xs text-gray-600">{morData.issuerDepartment || 'IT Department'}</p>
              <div className="mt-4 flex gap-2 items-center">
                <span className="text-xs">Date:</span>
                <div className="border-b border-gray-400 w-32"></div>
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
