import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { SCHOOL_INFO } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://escolabenonivio.vercel.app"),
  title: {
    default: `${SCHOOL_INFO.name} | Portal Oficial`,
    template: `%s | ${SCHOOL_INFO.shortName}`,
  },
  description: `Bem-vindo ao portal oficial da ${SCHOOL_INFO.name} (INEP: ${SCHOOL_INFO.inep}). Acesse avisos, notícias, acervo histórico e contatos da nossa comunidade escolar em Palhoça, SC.`,
  keywords: ["escola", "palhoça", "santa catarina", "educação pública", "benonívio joão martins", "ensino médio", "ensino fundamental"],
  authors: [{ name: SCHOOL_INFO.name }],
  creator: SCHOOL_INFO.name,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://escolabenonivio.vercel.app",
    title: `${SCHOOL_INFO.name} | Portal Oficial`,
    description: `Acesse o canal oficial da ${SCHOOL_INFO.name}. Informações sobre turmas, avisos do Instagram e acervo de projetos.`,
    siteName: SCHOOL_INFO.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SCHOOL_INFO.name} | Portal Oficial`,
    description: `Acesse o canal oficial da ${SCHOOL_INFO.name}. Informações sobre turmas, avisos do Instagram e acervo de projetos.`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SCHOOL_INFO.name,
    "alternateName": ["EEB Benonívio", "Escola Benonívio"],
    "url": "https://escolabenonivio.vercel.app",
  };

  return (
    <html lang="pt-BR" className={`${inter.variable} ${outfit.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  );
}
