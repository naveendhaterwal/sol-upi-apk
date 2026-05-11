export type ParsedUpiPayload = {
  raw: string;
  pa: string;
  pn: string;
  am: number;
  tn?: string;
  tr?: string;
  cu?: string;
  valid: boolean;
  errors: string[];
};

export function parseUpiPayload(payload: string): ParsedUpiPayload {
  const errors: string[] = [];

  if (!payload.startsWith('upi://pay')) {
    return {
      raw: payload,
      pa: '',
      pn: '',
      am: 0,
      valid: false,
      errors: ['Only UPI payment QR payloads are supported.'],
    };
  }

  const queryIndex = payload.indexOf('?');
  const query = queryIndex >= 0 ? payload.slice(queryIndex + 1) : '';
  const searchParams = new URLSearchParams(query);

  const pa = searchParams.get('pa')?.trim() || '';
  const pn = searchParams.get('pn')?.trim() || 'UPI Merchant';
  const amRaw = searchParams.get('am')?.trim() || '0';
  const am = Number.parseFloat(amRaw);
  const tn = searchParams.get('tn')?.trim() || undefined;
  const tr = searchParams.get('tr')?.trim() || undefined;
  const cu = searchParams.get('cu')?.trim() || 'INR';

  if (!pa) {
    errors.push('Missing UPI ID.');
  }

  if (!Number.isFinite(am) || am <= 0) {
    errors.push('Missing or invalid amount.');
  }

  if (cu && cu !== 'INR') {
    errors.push(`Unsupported currency: ${cu}.`);
  }

  return {
    raw: payload,
    pa,
    pn,
    am: Number.isFinite(am) ? am : 0,
    tn,
    tr,
    cu,
    valid: errors.length === 0,
    errors,
  };
}
