import type { Metadata } from "next";
import DemoShell from "@/components/ui/DemoShell";
import MetaPixel from "@/components/MetaPixel";
import "./globals.css";

export const metadata: Metadata = {
  title: "CyberOregon | Pentest, Red Team & Security Review",
  description:
    "Serviços especializados em Pentest (Web, APIs, MCP, Mobile, IA, Kiosk, Desktop, CAPT e Code Review), Red Team e Security Review.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-scroll-behavior="smooth" lang="pt-BR" className="scroll-smooth dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- This root layout applies to every route. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:ital,wght@0,100..900;1,100..900&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#020b1f] text-slate-100 font-sans">
        <MetaPixel />
        <DemoShell>{children}</DemoShell>
      </body>
    </html>
  );
}
