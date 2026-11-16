import type { Metadata } from "next";
import { ContactSection } from "@/components/ui/ContactSection";
import { SiteHeader } from "@/components/ui/SiteHeader";

export const metadata: Metadata = {
  title: "Fale Conosco | CyberOregon",
  description:
    "Entre em contato com a CyberOregon para solicitar uma proposta de Pentest, Red Team ou Security Review.",
};

export default function ContactPage() {
  return (
    <div className="cyber-oregon-page demo-dark min-h-screen bg-[#020b1f] text-slate-100 selection:bg-[#00EAFF] selection:text-[#020b1f] font-sans antialiased overflow-x-hidden">
      <SiteHeader isContactPage />
      <main id="conteudo">
        <ContactSection />
      </main>
    </div>
  );
}
