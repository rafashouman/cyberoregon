import type { Metadata } from "next";
import { Sora, Plus_Jakarta_Sans } from "next/font/google";
import DemoShell from "@/components/ui/DemoShell";
import MetaPixel from "@/components/MetaPixel";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CyberOregon | Pentest, Red Team & Security Review",
  description:
    "Serviços especializados em Pentest (Web, APIs, MCP, Mobile, IA, Kiosk, Desktop, CAPT e Source Code Review), Red Team e Security Review.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-scroll-behavior="smooth" lang="pt-BR" className="scroll-smooth dark">
      <body
        className={`${sora.variable} ${jakarta.variable} antialiased bg-[#020b1f] text-slate-100 font-sans`}
      >
        <MetaPixel />
        <DemoShell>{children}</DemoShell>
      </body>
    </html>
  );
}
