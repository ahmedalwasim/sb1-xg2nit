import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export function QRCodeImage({ value, size = 140 }: { value: string; size?: number }) {
  const [dataUrl, setDataUrl] = useState('');

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(value, { width: size, margin: 0 })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setDataUrl('');
      });
    return () => {
      cancelled = true;
    };
  }, [value, size]);

  if (!dataUrl) {
    return <div style={{ width: size, height: size }} className="bg-gray-100" />;
  }

  return <img src={dataUrl} width={size} height={size} alt="ZATCA QR code" />;
}
