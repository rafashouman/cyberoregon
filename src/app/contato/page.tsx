import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactSection } from "@/components/ui/ContactSection";

export const metadata: Metadata = {
  title: "Fale Conosco | CyberOregon",
  description:
    "Entre em contato com a CyberOregon para solicitar uma proposta de Pentest, Red Team ou Security Review.",
};

export default function ContactPage() {
  return (
    <div className="cyber-oregon-page demo-dark min-h-screen bg-[#020b1f] text-slate-100 selection:bg-[#00EAFF] selection:text-[#020b1f] font-sans antialiased overflow-x-hidden">
      <header className="border-b border-[#00D4FF]/20 bg-[#020b1f]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="CyberOregon — Início">
            <Image
              src="/images/templates/cyber-oregon/logo-cyber-oregon-dark.png"
              alt="CyberOregon Cybersecurity"
              width={230}
              height={44}
              priority
              className="h-8 w-auto object-contain"
            />
          </Link>
          <div className="flex flex-col items-end gap-2 text-right">
            <a
              href="mailto:contato@cyberoregon.com.br"
              className="text-xs font-mono text-[#00EAFF] hover:text-cyan-200 transition-colors"
            >
              Fale Conosco: contato@cyberoregon.com.br
            </a>
            <Link
              href="/"
              className="text-xs font-mono text-slate-300 hover:text-white transition-colors"
            >
              Voltar ao site
            </Link>
          </div>
        </div>
      </header>
      <main id="conteudo">
        <ContactSection />
      </main>
    </div>
  );
}
