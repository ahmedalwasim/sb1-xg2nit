// ZATCA (Saudi tax authority) Phase 1 simplified tax invoice QR code:
// a base64 string encoding five TLV (Tag-Length-Value) fields.
interface ZatcaFields {
  sellerName: string;
  vatNumber: string;
  timestamp: string;
  invoiceTotal: string;
  vatTotal: string;
}

function encodeTlv(tag: number, value: string): number[] {
  const bytes = Array.from(new TextEncoder().encode(value));
  return [tag, bytes.length, ...bytes];
}

export function buildZatcaQrBase64(fields: ZatcaFields): string {
  const bytes = [
    ...encodeTlv(1, fields.sellerName),
    ...encodeTlv(2, fields.vatNumber),
    ...encodeTlv(3, fields.timestamp),
    ...encodeTlv(4, fields.invoiceTotal),
    ...encodeTlv(5, fields.vatTotal),
  ];

  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}
