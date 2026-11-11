import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { readState } from "@/lib/db";
import { SITE_URL } from "@/lib/site";
import "./globals.css";
import ContentProtection from "@/components/ContentProtection";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap", weight: ["600", "700"] });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap", weight: ["400", "500"] });

const FALLBACK_TITLE = "Arif Rizki — Network & IT Support Engineer";
const FALLBACK_DESCRIPTION = "Portofolio Network & IT Support Engineer: infrastruktur jaringan, MikroTik, dukungan TI, dan pemeliharaan sistem.";

function trimDescription(text: string, max = 158): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

export async function generateMetadata(): Promise<Metadata> {
  let brandName = "Arif Rizki";
  let title = FALLBACK_TITLE;
  let description = FALLBACK_DESCRIPTION;
  let photoUrl: string | undefined;
  try {
    const state = await readState();
    const s = state.settings;
    brandName = s.brandName;
    title = `${s.brandName} — ${s.tagline}`;
    description = trimDescription(s.heroSubtitle || s.tagline);
    photoUrl = s.photoUrl;
  } catch {
    // Database not reachable at build/preview time: fall back to static metadata.
  }

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s — ${brandName}`,
    },
    description,
    openGraph: {
      title,
      description,
      url: SITE_URL,
      siteName: brandName,
      locale: "id_ID",
      type: "website",
      ...(photoUrl ? { images: [{ url: photoUrl }] } : {}),
    },
    twitter: {
      card: photoUrl ? "summary_large_image" : "summary",
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className={`${inter.variable} ${jakarta.variable} ${jetbrains.variable} antialiased`}>
        <ContentProtection />
        {children}
      </body>
    </html>
  );
}
