import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TRPCProvider } from "@/trpc/client";
import { NuqsAdapter } from 'nuqs/adapters/next/app'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "Invorg | Invoice organizer",
  description: "Invoice organization made simple",
  twitter: {
    title: "Invorg | Invoice organizer",
    description:
      "Let AI help you, keeping all your invoices organized in one place",
    images: [
      {
        url: "https://invorg.app/invorg-og-small.jpg",
        width: 800,
        height: 600,
      },
    ],
  },
  openGraph: {
    title: "Invorg | Invoice organizer",
    description:
      "Let AI help you, keeping all your invoices organized in one place",
    url: "https://invorg.app",
    siteName: "Invorg",
    images: [
      {
        url: "https://invorg.app/invorg-og-small.jpg",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased dark`}
      >
        <NuqsAdapter>
          <TRPCProvider>
            {children}
          </TRPCProvider>
          <Toaster richColors />
        </NuqsAdapter>
      </body>
    </html>
  );
}
