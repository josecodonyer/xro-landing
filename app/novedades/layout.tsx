import type { Metadata } from 'next';
import Topbar from '../components/Topbar';

export const metadata: Metadata = {
  title: 'Novedades · Notas de parche · xRO',
  description:
    'Notas de parche de xRO: cada cambio que llega al servidor de Ragnarok Online Renewal x10. Tienda cosmética, recompensas del Eden Group, calidad de vida y correcciones.',
  openGraph: {
    title: 'Novedades · Notas de parche · xRO',
    description: 'Cada cambio que llega al servidor de xRO, parche a parche.',
    url: 'https://xro-server.es/novedades',
    siteName: 'xRO',
    locale: 'es_ES',
    type: 'website',
  },
};

export default function NovedadesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Topbar active="novedades" subtitle="Novedades" />
      {children}
    </>
  );
}
