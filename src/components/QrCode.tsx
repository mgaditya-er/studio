'use client';

import Image from 'next/image';

interface QrCodeProps {
  value: string;
  size?: number;
}

export function QrCode({ value, size = 150 }: QrCodeProps) {
  if (!value) return null;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
    value
  )}&bgcolor=E8F0ED`;

  return (
    <Image
      src={qrCodeUrl}
      alt={`QR code for ${value}`}
      width={size}
      height={size}
      className="rounded-md"
    />
  );
}
