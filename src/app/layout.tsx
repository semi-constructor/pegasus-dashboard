import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pegasus.cptcr.uk"),
  title: "Pegasus | Automated Discord Bot System & Server Manager",
  description: "Pegasus provides a fully automated Discord bot architecture for powerful server management, seamless moderation, and fun community features all in one place.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Pegasus | Automated Discord Bot System",
    description: "Pegasus provides a fully automated Discord bot architecture for powerful server management.",
    url: "https://pegasus.cptcr.uk",
    siteName: "Pegasus Discord Bot",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pegasus | Automated Discord Bot System",
    description: "Pegasus provides a fully automated Discord bot architecture for powerful server management.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-full flex flex-col bg-black text-neutral-100 selection:bg-[#5E5CE6]/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
