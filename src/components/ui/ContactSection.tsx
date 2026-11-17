"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Award, AlertCircle, Lock, Loader2, Send, ShieldCheck, Zap } from "lucide-react";
import { trackMetaEvent } from "@/components/MetaPixel";
import { saveCyberOregonLead } from "@/app/actions/leads";
import { Confetti } from "@/components/ui/MotionKit";
import { CONTACT_SERVICES } from "@/lib/contact";

export const ContactSection = () => {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState<string>(CONTACT_SERVICES.pentest);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect -- Restore the URL fragment after hydration. */
  useEffect(() => {
    const prefix = "#solicitacao?";
    if (!window.location.hash.startsWith(prefix)) return;

    const params = new URLSearchParams(window.location.hash.slice(prefix.length));
    const selectedService = Object.entries(CONTACT_SERVICES).find(
      ([key]) => key === params.get("service")
    );
    const details = params.get("details") ?? "";
    if (!selectedService || details.length > 1500) {
      setErrorMsg("Não foi possível preencher o escopo. Confira os campos antes de enviar.");
      return;
    }

    setService(selectedService[1]);
    setMessage(details);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2 || !email.trim()) return;

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      await saveCyberOregonLead({
        name,
        company,
        email,
        phone,
        service,
        message,
      });

      trackMetaEvent("Lead", {
        content_name: "Formulário de Diagnóstico CyberOregon",
        content_category: service,
      });

      setSubmitted(true);
      setName("");
      setCompany("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Não foi possível enviar sua solicitação. Tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contato" className="pt-32 sm:pt-36 lg:pt-48 pb-24 lg:pb-32 relative overflow-hidden bg-[#020b1f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl bg-[#04122C] border border-[#00D4FF]/50 p-6 sm:p-10 lg:p-14 shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-hidden">
          {/* Background Image inside CTA Container */}
          <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
            <Image
              src="/images/templates/cyber-oregon/preocupe-se-com-a-ciberseguranca-de-sua-empresa.png"
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-center opacity-25 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#020b1f] via-[#020b1f]/90 to-[#04122C]/85" />
          </div>

          <div className="relative z-10 grid lg:grid-cols-12 gap-10 items-start">
            {/* Right Form */}
            <div className="lg:order-2 lg:col-span-6">
              <div className="rounded-2xl bg-[#020b1f]/95 border border-[#00D4FF]/30 p-6 sm:p-8 backdrop-blur-xl">
                {submitted ? (
                  <div className="text-center py-8 space-y-4">
                    <Confetti />
                    <div className="w-14 h-14 rounded-2xl bg-[#00EAFF]/20 border border-[#00EAFF] text-[#00EAFF] flex items-center justify-center mx-auto">
                      <ShieldCheck className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-black text-white">
                      Solicitação Registrada com Sucesso!
                    </h3>
                    <p className="text-sm text-slate-300 max-w-md mx-auto">
                      Recebemos os dados do seu escopo e notificamos nossa equipe por e-mail. Em breve um especialista da CyberOregon entrará em contato.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="px-5 py-2.5 rounded-xl bg-white/10 text-xs font-mono uppercase tracking-wider text-white hover:bg-white/15"
                    >
                      Enviar nova solicitação
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <span className="font-mono text-xs uppercase tracking-widest text-[#00EAFF] font-bold">
                        SOLICITAR PROPOSTA / BRIEFING TÉCNICO
                      </span>
                      <span className="font-mono text-[11px] text-slate-400">
                        TLS 1.3 SECURE
                      </span>
                    </div>

                    {errorMsg && (
                      <div
                        role="alert"
                        className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2"
                      >
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="co-name"
                          className="block font-mono text-[11px] uppercase tracking-wider text-slate-300 mb-1.5"
                        >
                          Seu Nome *
                        </label>
                        <input
                          id="co-name"
                          type="text"
                          required
                          minLength={2}
                          autoComplete="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ex: Rodrigo Almeida"
                          className="w-full px-4 py-3 rounded-xl bg-[#04122C] border border-white/15 text-white text-sm placeholder:text-slate-500 focus:border-[#00EAFF] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="co-company"
                          className="block font-mono text-[11px] uppercase tracking-wider text-slate-300 mb-1.5"
                        >
                          Empresa / Organização
                        </label>
                        <input
                          id="co-company"
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Ex: FinTech Brasil S.A."
                          className="w-full px-4 py-3 rounded-xl bg-[#04122C] border border-white/15 text-white text-sm placeholder:text-slate-500 focus:border-[#00EAFF] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="co-email"
                          className="block font-mono text-[11px] uppercase tracking-wider text-slate-300 mb-1.5"
                        >
                          E-mail Corporativo *
                        </label>
                        <input
                          id="co-email"
                          type="email"
                          required
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="rodrigo@suaempresa.com.br"
                          className="w-full px-4 py-3 rounded-xl bg-[#04122C] border border-white/15 text-white text-sm placeholder:text-slate-500 focus:border-[#00EAFF] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="co-phone"
                          className="block font-mono text-[11px] uppercase tracking-wider text-slate-300 mb-1.5"
                        >
                          Telefone / Contato
                        </label>
                        <input
                          id="co-phone"
                          type="tel"
                          autoComplete="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="(11) 99999-9999"
                          className="w-full px-4 py-3 rounded-xl bg-[#04122C] border border-white/15 text-white text-sm placeholder:text-slate-500 focus:border-[#00EAFF] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="co-service"
                        className="block font-mono text-[11px] uppercase tracking-wider text-slate-300 mb-1.5"
                      >
                        Solução Desejada
                      </label>
                      <select
                        id="co-service"
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#04122C] border border-white/15 text-white text-sm focus:border-[#00EAFF] focus:outline-none"
                      >
                        {Object.entries(CONTACT_SERVICES).map(([key, label]) => (
                          <option key={key} value={label}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="co-message"
                        className="block font-mono text-[11px] uppercase tracking-wider text-slate-300 mb-1.5"
                      >
                        Detalhes do Escopo (opcional)
                      </label>
                      <textarea
                        id="co-message"
                        rows={3}
                        maxLength={1500}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Informe URLs, quantidade de APIs, prazo desejado ou observações..."
                        className="w-full px-4 py-3 rounded-xl bg-[#04122C] border border-white/15 text-white text-sm placeholder:text-slate-500 focus:border-[#00EAFF] focus:outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#0088CC] via-[#00C4F0] to-[#00EAFF] text-[#020b1f] font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(0,234,255,0.4)] hover:opacity-95 disabled:opacity-60 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Enviando Solicitação...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Enviar Solicitação de Proposta</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Left Callout */}
            <div className="lg:order-1 lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/35 mb-5 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-[#00EAFF] animate-pulse shadow-[0_0_8px_#00EAFF]" />
                <span className="font-mono text-[11px] font-bold text-[#00EAFF] tracking-widest">[SEC-07]</span>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-100 font-semibold">Canal Direto com Especialistas</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Proteja a reputação e a continuidade do seu negócio hoje.
              </h2>
              <p className="text-slate-200 text-base leading-relaxed">
                Agende uma reunião técnica de alinhamento sob NDA. Nossos engenheiros avaliam sua arquitetura e entregam um plano de ação sob medida em até 24h.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-[#00D4FF]/20 border border-[#00EAFF]/40 flex items-center justify-center text-[#00EAFF]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <span>Assinatura de NDA (Acordo de Confidencialidade) antes do briefing</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-[#00D4FF]/20 border border-[#00EAFF]/40 flex items-center justify-center text-[#00EAFF]">
                    <Zap className="w-4 h-4" />
                  </div>
                  <span>Atendimento ágil diretamente com líder de Segurança Ofensiva</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-[#00D4FF]/20 border border-[#00EAFF]/40 flex items-center justify-center text-[#00EAFF]">
                    <Award className="w-4 h-4" />
                  </div>
                  <span>Escopos completos de Pentest, Red Team e Security Review</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
