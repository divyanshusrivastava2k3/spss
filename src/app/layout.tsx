import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { Providers } from "./providers";
import { SettingsProvider } from "@/lib/settings-context";
import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

const getSettings = unstable_cache(
 async () => prisma.settings.findFirst(),
 ["site-settings"],
 { revalidate: 3600 }
);
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

function getContrastText(hex: string): string {
  if (!hex || hex === "#") return "#ffffff";
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16) || 0;
  const g = parseInt(c.substring(2, 4), 16) || 0;
  const b = parseInt(c.substring(4, 6), 16) || 0;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#1a1a2e" : "#ffffff";
}

async function getLang(): Promise<"en" | "hi"> {
  try {
    const cookieStore = await cookies();
    const lang = cookieStore.get("language")?.value;
    return lang === "hi" ? "hi" : "en";
  } catch {
    return "en";
  }
}

export async function generateMetadata(): Promise<Metadata> {
  let settings;
  try {
    settings = await getSettings();
  } catch {
    // fallback
  }

  const lang = await getLang();
  const faviconUrl = settings?.faviconUrl || "/favicon.ico";
  const ts = Date.now();

  return {
    title: settings?.ngoName || "NGO Website",
    description: (lang === "hi" ? settings?.aboutTextHi : settings?.aboutText)?.substring(0, 160) || (lang === "hi" ? "शिक्षा, कौशल विकास और ग्रामीण सशक्तिकरण के माध्यम से ग्रामीण समुदायों को सशक्त बनाना।" : "Empowering rural communities through education, skill development, and sustainable livelihoods."),
    icons: {
      icon: faviconUrl ? `${faviconUrl}?v=${ts}` : `/favicon.ico?v=${ts}`,
      shortcut: faviconUrl ? `${faviconUrl}?v=${ts}` : `/favicon.ico?v=${ts}`,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await getLang();
  let primary = "#166534";
  let secondary = "#15803d";
  let ngoName = "NGO";
  let ngoNameHi = "";
  let logoUrl = "";
  let aboutText = "";
  let aboutTextHi = "";
  let contactEmail = "";
  let contactPhone = "";
  let address = "";
  let addressHi = "";
  let facebookUrl = "";
  let twitterUrl = "";
  let instagramUrl = "";
  let youtubeUrl = "";
  let linkedinUrl = "";

  const settings = await getSettings();
  if (settings) {
    primary = settings.primaryColor || primary;
    secondary = settings.secondaryColor || secondary;
    ngoName = settings.ngoName || ngoName;
    ngoNameHi = settings.ngoNameHi || ngoNameHi;
    logoUrl = settings.logoUrl || "";
    aboutText = settings.aboutText || "";
    aboutTextHi = settings.aboutTextHi || "";
    contactEmail = settings.contactEmail || "";
    contactPhone = settings.contactPhone || "";
    address = settings.address || "";
    addressHi = settings.addressHi || "";
    facebookUrl = settings.facebookUrl || "";
    twitterUrl = settings.twitterUrl || "";
    instagramUrl = settings.instagramUrl || "";
    youtubeUrl = settings.youtubeUrl || "";
    linkedinUrl = settings.linkedinUrl || "";
  }

  const primaryFg = getContrastText(primary);
  const secondaryFg = getContrastText(secondary);

  return (
    <html
      lang={lang}
      className={`${inter.variable} h-full antialiased light`}
      data-theme="light"
      suppressHydrationWarning
      style={{
        "--primary": primary,
        "--secondary": secondary,
        "--primary-fg": primaryFg,
        "--secondary-fg": secondaryFg,
        "--primary-10": `${primary}1A`,
        "--primary-15": `${primary}26`,
        "--primary-20": `${primary}33`,
        "--primary-25": `${primary}40`,
        "--primary-30": `${primary}4D`,
        "--secondary-10": `${secondary}1A`,
        "--secondary-20": `${secondary}33`,
        "--secondary-25": `${secondary}40`,
      } as React.CSSProperties}
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <SettingsProvider initialSettings={{ ngoName, ngoNameHi, logoUrl, aboutText, aboutTextHi, contactEmail, contactPhone, address, addressHi, facebookUrl, twitterUrl, instagramUrl, youtubeUrl, linkedinUrl }}>
          <Providers initialLanguage={lang}>{children}</Providers>
        </SettingsProvider>
      </body>
    </html>
  );
}
