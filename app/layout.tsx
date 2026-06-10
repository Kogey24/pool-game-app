import type { Metadata, Viewport } from "next";
import { inter, oswald } from "@/app/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pool Marks - Kenya Local Pool Scorekeeper",
  description:
    "Track marks, eliminations, and fouls for the Kenyan local pool game variation.",
  appleWebApp: {
    capable: true,
    title: "Pool Marks",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0A0F0A",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
