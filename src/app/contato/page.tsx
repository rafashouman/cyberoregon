import type { Metadata } from "next";
import { ContactSection } from "@/components/ui/ContactSection";
import { SiteHeader } from "@/components/ui/SiteHeader";

export const metadata: Metadata = {
  title: "Fale Conosco | CyberOregon",
  description:
    "Converse com um especialista da CyberOregon sobre Pentest, Red Team ou Security Review. O orçamento final é definido após o alinhamento do cenário.",
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
