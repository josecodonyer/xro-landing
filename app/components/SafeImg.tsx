'use client';

export default function SafeImg({ src, alt, width, height, className }: {
  src: string; alt: string; width?: number; height?: number; className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src} alt={alt} width={width} height={height} className={className}
      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
    />
  );
}
