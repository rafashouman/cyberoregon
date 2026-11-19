"use client";

import Image from "next/image";
import { Mail } from "lucide-react";
import { useDemoTheme } from "@/components/ui/DemoShell";
import { LOGO_DARK_SRC, LOGO_LIGHT_SRC } from "@/components/ui/SiteHeader";

const CURRENT_YEAR = 2026;

export function SiteFooter({ isContactPage = false }: { isContactPage?: boolean }) {
  const theme = useDemoTheme();
  const sectionHref = (section: string) =>
    isContactPage ? `/#${section}` : `#${section}`;

  return (
    <footer className="bg-[#010714] border-t border-[#00D4FF]/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-white/10">
          <div className="space-y-3">
              <Image
                src={theme === "claro" ? LOGO_LIGHT_SRC : LOGO_DARK_SRC}
                alt="CyberOregon Cybersecurity"
                width={278}
                height={53}
                className="h-8 w-auto object-contain"
              />
            <p className="text-xs text-slate-400 max-w-sm">
              Serviços especializados em Pentest, Red Team e Security Review para aplicações, infraestrutura, identidade e código-fonte.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap gap-6 text-xs font-mono uppercase tracking-wider text-slate-300">
              <a href={sectionHref("solucoes")} className="hover:text-[#00EAFF] transition-colors">
                Soluções
              </a>
              <a href={sectionHref("simulador")} className="hover:text-[#00EAFF] transition-colors">
                Simulador de Escopo
              </a>
              <a href={sectionHref("metodologia")} className="hover:text-[#00EAFF] transition-colors">
                Metodologia
              </a>
              <a href={sectionHref("faq")} className="hover:text-[#00EAFF] transition-colors">
                FAQ
              </a>
              <a href="/contato" className="text-[#00EAFF] hover:underline">
                Fale conosco
              </a>
            </div>
            <a
              href="mailto:contato@cyberoregon.com.br"
              className="flex items-center gap-2 border-t border-white/10 pt-4 text-sm font-mono text-[#00EAFF] hover:text-cyan-200 transition-colors"
            >
              <Mail aria-hidden="true" className="w-4 h-4 shrink-0" />
              contato@cyberoregon.com.br
            </a>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <p>
            © {CURRENT_YEAR} CYBEROREGON CYBERSECURITY. TODOS OS DIREITOS RESERVADOS.
          </p>
          <p className="text-slate-500">
            OWASP • PTES • MITRE ATT&amp;CK • CIS BENCHMARKS
          </p>
        </div>
      </div>
    </footer>
  );
}
