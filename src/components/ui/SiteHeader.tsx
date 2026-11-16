"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Mail, Menu, ShieldCheck, X } from "lucide-react";
import { useDemoTheme } from "@/components/ui/DemoShell";
import { useActiveSection } from "@/components/ui/useActiveSection";

export const LOGO_DARK_SRC = "/images/templates/cyber-oregon/logo-cyber-oregon-dark.png";
export const LOGO_LIGHT_SRC = "/images/templates/cyber-oregon/logo-cyber-oregon.png";

export function SiteHeader({ isContactPage = false }: { isContactPage?: boolean }) {
  const theme = useDemoTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useActiveSection([
    "solucoes",
    "simulador",
    "metodologia",
    "diferenciais",
    "faq",
    "contato",
  ]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { id: "solucoes", label: "Soluções" },
    { id: "simulador", label: "Diagnóstico & Escopo" },
    { id: "metodologia", label: "Metodologia" },
    { id: "diferenciais", label: "Por que CyberOregon" },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 pt-3 sm:pt-4 pointer-events-none">
      {/* Top Status Strip */}
      <div
        className={`max-w-7xl mx-auto mb-2 transition-all duration-300 pointer-events-auto hidden md:flex items-center justify-between px-4 py-1.5 rounded-xl bg-[#020b1f]/90 backdrop-blur-md border border-[#00D4FF]/25 text-[11px] font-mono text-slate-300 ${
          scrolled ? "opacity-0 -translate-y-3 pointer-events-none hidden" : "opacity-100"
        }`}
      >
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-2 text-[#00EAFF]">
            <span className="w-2 h-2 rounded-full bg-[#00EAFF] animate-ping" />
            PENTEST • RED TEAM • SECURITY REVIEW
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">
            OWASP • PTES • MITRE ATT&CK • CIS BENCHMARKS
          </span>
        </div>
        <div className="flex items-center gap-5">
          <a
            href={isContactPage ? "/#simulador" : "#simulador"}
            className="inline-flex items-center gap-1.5 text-[#00EAFF] hover:text-cyan-200 font-semibold transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Dimensionar Escopo sob NDA
          </a>
          <a
            href="mailto:contato@cyberoregon.com.br"
            className="text-slate-300 hover:text-[#00EAFF] transition-colors normal-case"
          >
            Fale Conosco: contato@cyberoregon.com.br
          </a>
        </div>
      </div>

      {/* Main Dock */}
      <div
        className={`max-w-7xl mx-auto transition-all duration-500 pointer-events-auto rounded-2xl border ${
          scrolled
            ? "bg-[#020b1f]/95 backdrop-blur-xl border-[#00D4FF]/35 shadow-[0_20px_50px_rgba(0,0,0,0.85)] py-2.5 px-4 sm:px-6"
            : "bg-[#020b1f]/80 backdrop-blur-lg border-[#00D4FF]/20 py-3 px-4 sm:px-6"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Novo Logo Dark CyberOregon integrado direto no fundo escuro */}
          <Link
            href="/"
            aria-label="CyberOregon — Início"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="relative flex items-center rounded-xl overflow-hidden px-2 py-1 bg-[#020b1f] border border-[#00D4FF]/30 group-hover:border-[#00EAFF] shadow-[0_0_25px_rgba(0,212,255,0.2)] transition-all duration-300">
              <Image
                src={theme === "claro" ? LOGO_LIGHT_SRC : LOGO_DARK_SRC}
                alt="CyberOregon Cybersecurity"
                width={230}
                height={44}
                priority
                className="h-8 sm:h-10 w-auto object-contain"
              />
            </div>
          </Link>

          {/* Desktop Links */}
          <nav
            aria-label="Navegação CyberOregon"
            className="hidden lg:flex items-center gap-1 xl:gap-2"
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={isContactPage ? `/#${item.id}` : `#${item.id}`}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                    isActive
                      ? "bg-[#00D4FF]/20 text-[#00EAFF] border border-[#00D4FF]/50 font-bold"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* CTA Button — Acesso rápido ao formulário */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={isContactPage ? "#contato" : "/contato"}
              className="group relative inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#0088CC] via-[#00B8E6] to-[#00EAFF] text-[#020b1f] font-black text-[11px] sm:text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(0,212,255,0.45)] hover:shadow-[0_0_35px_rgba(0,234,255,0.7)] transition-all active:scale-95"
            >
              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Fale conosco</span>
              <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={isOpen}
              className="lg:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 hover:text-[#00EAFF]"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <a
          href="mailto:contato@cyberoregon.com.br"
          className="md:hidden mt-3 flex items-center gap-2 border-t border-white/10 pt-2.5 text-[10px] sm:text-xs font-mono text-slate-300 hover:text-[#00EAFF] transition-colors"
        >
          <Mail className="w-3.5 h-3.5 shrink-0 text-[#00EAFF]" />
          <span>Fale Conosco: contato@cyberoregon.com.br</span>
        </a>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="pt-4 pb-2 mt-3 border-t border-white/10 flex flex-col gap-2">
                {navItems.map((item) => (
                  <a
                    key={item.id}
                    href={isContactPage ? `/#${item.id}` : `#${item.id}`}
                    onClick={() => setIsOpen(false)}
                    className="px-3.5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider text-slate-200 hover:bg-[#00D4FF]/20 hover:text-[#00EAFF]"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
