"use client";

import React, { useEffect, useState } from "react";
import {
  Award,
  AlertCircle,
  CheckCircle2,
  Lock,
  Loader2,
  Mail,
  Send,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { trackMetaEvent } from "@/components/MetaPixel";
import { saveCyberOregonLead } from "@/app/actions/leads";
import { subscribeCyberOregonNewsletter } from "@/app/actions/newsletter";
import { CONTACT_SERVICES } from "@/lib/contact";

export const ContactSection = ({ spacious = false }: { spacious?: boolean }) => {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState<string>(CONTACT_SERVICES.pentest);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterConsent, setNewsletterConsent] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [newsletterError, setNewsletterError] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

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

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterConsent) return;

    setIsSubscribing(true);
    setNewsletterError("");

    try {
      await subscribeCyberOregonNewsletter({
        email: newsletterEmail,
        consent: newsletterConsent,
      });
      trackMetaEvent("Subscribe", {
        content_name: "Newsletter CyberOregon",
        content_category: "newsletter",
      });
      setNewsletterSubscribed(true);
      setNewsletterEmail("");
      setNewsletterConsent(false);
    } catch (err) {
      setNewsletterError(
        err instanceof Error
          ? err.message
          : "Não foi possível concluir sua inscrição. Tente novamente."
      );
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <section
      id="contato"
      className={`pb-24 lg:pb-32 relative bg-[#020b1f] ${
        spacious ? "pt-32 sm:pt-36 lg:pt-48" : "pt-24 lg:pt-32"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-2xl bg-[#04122C] border border-slate-700 p-6 sm:p-10 lg:p-14">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            {/* Right Form */}
            <div className="lg:order-2 lg:col-span-6">
              <div className="rounded-xl bg-[#020b1f] border border-slate-700 p-6 sm:p-8">
                {submitted ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-14 h-14 rounded-xl bg-slate-800 border border-slate-600 text-slate-100 flex items-center justify-center mx-auto">
                      <ShieldCheck className="w-7 h-7" />
                    </div>
                    <h3 className="font-sans text-xl font-bold text-white">
                      Mensagem enviada com sucesso!
                    </h3>
                    <p className="text-sm text-slate-300 max-w-md mx-auto">
                      Recebemos seus dados e em breve um especialista da CyberOregon entrará em contato para conversar sobre seu cenário. O orçamento final é definido após esse alinhamento.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="px-5 py-2.5 rounded-lg bg-white/10 text-sm font-medium text-white hover:bg-white/15"
                    >
                      Enviar nova mensagem
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
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
                          className="block text-sm font-medium text-slate-200 mb-1.5"
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
                          className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-600 text-white text-sm placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="co-company"
                          className="block text-sm font-medium text-slate-200 mb-1.5"
                        >
                          Empresa / Organização
                        </label>
                        <input
                          id="co-company"
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Ex: FinTech Brasil S.A."
                          className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-600 text-white text-sm placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="co-email"
                          className="block text-sm font-medium text-slate-200 mb-1.5"
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
                          className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-600 text-white text-sm placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="co-phone"
                          className="block text-sm font-medium text-slate-200 mb-1.5"
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
                          className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-600 text-white text-sm placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="co-service"
                        className="block text-sm font-medium text-slate-200 mb-1.5"
                      >
                        Solução Desejada
                      </label>
                      <select
                        id="co-service"
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-600 text-white text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
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
                        className="block text-sm font-medium text-slate-200 mb-1.5"
                      >
                        Conte um pouco sobre seu cenário (opcional)
                      </label>
                      <textarea
                        id="co-message"
                        rows={3}
                        maxLength={1500}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Conte sobre seu ambiente, objetivo ou dúvida. Alinhamos o escopo juntos na conversa."
                        className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-600 text-white text-sm placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-6 rounded-lg bg-sky-700 text-white font-semibold text-sm hover:bg-sky-600 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Enviando mensagem...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Agende uma conversa</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Left Callout */}
            <div className="lg:order-1 lg:col-span-6 space-y-6">
              <h2 className="font-sans text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                Proteja a reputação e a continuidade do seu negócio hoje.
              </h2>
              <p className="text-slate-200 text-base leading-relaxed">
                Converse com nossos especialistas para entendermos seu cenário e alinharmos o escopo técnico sob NDA. A proposta e o orçamento final são preparados depois dessa conversa.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-200">
                    <Lock className="w-4 h-4" />
                  </div>
                  <span>Assinatura de NDA (Acordo de Confidencialidade) antes do briefing</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-200">
                    <Zap className="w-4 h-4" />
                  </div>
                  <span>Atendimento ágil diretamente com líder de Segurança Ofensiva</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-200">
                    <Award className="w-4 h-4" />
                  </div>
                  <span>Escopos completos de Pentest, Red Team e Security Review</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-700 bg-[#04122C] p-6 sm:p-8">
          {newsletterSubscribed ? (
            <div
              role="status"
              className="flex items-center gap-3 text-slate-100"
            >
              <CheckCircle2 className="h-6 w-6 shrink-0 text-sky-400" />
              <div>
                <p className="font-semibold">Inscrição confirmada.</p>
                <p className="text-sm text-slate-300">
                  Você receberá nossas dicas e informações por e-mail.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-6">
                <div className="min-w-0 flex-1">
                  <label
                    htmlFor="co-newsletter-email"
                    className="block text-lg font-medium text-slate-200 mb-1.5"
                  >
                    Newsletter
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      id="co-newsletter-email"
                      type="email"
                      required
                      autoComplete="email"
                      maxLength={150}
                      value={newsletterEmail}
                      onChange={(event) => setNewsletterEmail(event.target.value)}
                      placeholder="seuemail@empresa.com.br"
                      className="w-full rounded-lg border border-slate-600 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubscribing || !newsletterConsent}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-sky-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60 lg:mt-7"
                >
                  {isSubscribing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Inscrevendo...
                    </>
                  ) : (
                    "Inscrever-se"
                  )}
                </button>
              </div>

              <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-300">
                <input
                  type="checkbox"
                  required
                  checked={newsletterConsent}
                  onChange={(event) => setNewsletterConsent(event.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-sky-600"
                />
                <span>
                  Receba nossa newsletter com dicas e informações.
                </span>
              </label>

              {newsletterError && (
                <div
                  role="alert"
                  className="flex items-center gap-2 rounded-lg border border-rose-500/40 bg-rose-500/15 p-3 text-xs text-rose-200"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                  <span>{newsletterError}</span>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
