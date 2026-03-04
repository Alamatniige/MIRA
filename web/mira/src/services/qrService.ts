export function parseQRCode(data: string): { type: string; id: string } | null {
  // Placeholder - parse QR code data
  try {
    const parsed = JSON.parse(data);
    return { type: parsed.type ?? "asset", id: parsed.id ?? data };
  } catch {
    return { type: "asset", id: data };
  }
}
