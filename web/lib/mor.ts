'use client';

export interface MorData {
  assetLabel: string;
  assigneeName: string;
  department: string;
  date: string;
  notes: string;
  issuerName: string;
  issuerDepartment?: string;
  status?: string;
  referenceNumber: string;
}

export function createMorReference(date?: string) {
  const parsedDate = date ? new Date(date) : new Date();
  const year = Number.isNaN(parsedDate.getTime())
    ? new Date().getFullYear()
    : parsedDate.getFullYear();
  const suffix = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');

  return `MOR-${year}-${suffix}`;
}

export function encodeMorData(data: MorData) {
  return encodeURIComponent(btoa(JSON.stringify(data)));
}

export function decodeMorData(value: string) {
  const parsed = JSON.parse(atob(decodeURIComponent(value)));

  if (!isMorData(parsed)) {
    throw new Error('Invalid MOR payload');
  }

  return parsed;
}

function isMorData(value: unknown): value is MorData {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.assetLabel === 'string' &&
    typeof candidate.assigneeName === 'string' &&
    typeof candidate.department === 'string' &&
    typeof candidate.date === 'string' &&
    typeof candidate.notes === 'string' &&
    typeof candidate.issuerName === 'string' &&
    typeof candidate.referenceNumber === 'string' &&
    (candidate.issuerDepartment === undefined || typeof candidate.issuerDepartment === 'string') &&
    (candidate.status === undefined || typeof candidate.status === 'string')
  );
}
