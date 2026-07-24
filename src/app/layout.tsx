import type { Metadata } from 'next'
import { Inter, Geist } from 'next/font/google'
import './globals.css';
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pegasus Dashboard',
  description: 'Enterprise Discord Bot Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn("dark", "font-sans", geist.variable)} suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
