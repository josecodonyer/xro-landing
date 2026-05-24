import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "xRO · Renewal x10 · Servidor de Ragnarok Online",
  description:
    "Servidor privado de Ragnarok Online Renewal x10 en español, sin pay-to-win. Una sola progresión. Un solo cliente. Comunidad hispana activa.",
  metadataBase: new URL("https://xro-server.es"),
  openGraph: {
    title: "xRO · Renewal x10 · Servidor de Ragnarok Online",
    description: "Ragnarok Online Renewal x10 en español, sin pay-to-win.",
    url: "https://xro-server.es",
    siteName: "xRO",
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
