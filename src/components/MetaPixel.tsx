"use client";

import { useEffect, useRef, useSyncExternalStore, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || "1082811261440434";
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const CONSENT_KEY = "cyberoregon-cookie-consent-v1";
type Consent = "granted" | "denied";

function readConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  const saved = window.localStorage.getItem(CONSENT_KEY);
  return saved === "granted" || saved === "denied" ? saved : null;
}

export const trackMetaEvent = (
  eventName: string,
  params?: Record<string, unknown>
) => {
  if (
    typeof window !== "undefined" &&
    readConsent() === "granted" &&
    META_PIXEL_ID &&
    typeof window.fbq === "function"
  ) {
    window.fbq("track", eventName, params);
  }
};

function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (GA_MEASUREMENT_ID && typeof window.gtag === "function") {
      const query = searchParams.toString();
      window.gtag("event", "page_view", {
        page_path: `${pathname}${query ? `?${query}` : ""}`,
      });
    }
    if (META_PIXEL_ID && typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
  }, [pathname, searchParams]);

  return null;
}

function ConsentBanner({ onChoose }: { onChoose: (value: Consent) => void }) {
  return (
    <div
      role="dialog"
      aria-label="Consentimento de cookies"
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-xl rounded-2xl border border-[#00D4FF]/30 bg-[#020b1f]/95 p-4 text-sm text-slate-200 shadow-2xl backdrop-blur-md sm:p-5"
    >
      <p className="leading-6">
        Usamos cookies de medição para analisar audiência e interações no site da
        CyberOregon. Só ativamos com a sua permissão.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChoose("granted")}
          className="rounded-full bg-[#00EAFF] px-5 py-2 text-xs font-bold text-[#020b1f] transition hover:opacity-90"
        >
          Aceitar
        </button>
        <button
          type="button"
          onClick={() => onChoose("denied")}
          className="rounded-full border border-white/20 px-5 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
        >
          Recusar
        </button>
      </div>
    </div>
  );
}

const consentListeners = new Set<() => void>();

function subscribeConsent(cb: () => void) {
  consentListeners.add(cb);
  return () => {
    consentListeners.delete(cb);
  };
}

export default function MetaPixel() {
  const consent = useSyncExternalStore<Consent | null | undefined>(
    subscribeConsent,
    readConsent,
    () => undefined
  );

  const choose = (value: Consent) => {
    window.localStorage.setItem(CONSENT_KEY, value);
    consentListeners.forEach((cb) => cb());
  };

  if (!GA_MEASUREMENT_ID && !META_PIXEL_ID) return null;
  if (consent === undefined) return null;
  if (consent === null) return <ConsentBanner onChoose={choose} />;
  if (consent === "denied") return null;

  return (
    <>
      {GA_MEASUREMENT_ID && (
        <>
          <Script
            id="google-analytics-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                window.gtag = function(){window.dataLayer.push(arguments);};
                window.gtag('js', new Date());
                window.gtag('config', '${GA_MEASUREMENT_ID}');
              `,
            }}
          />
          <Script
            id="google-analytics"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
        </>
      )}
      {META_PIXEL_ID && (
        <>
          <Script
            id="meta-pixel-base"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${META_PIXEL_ID}');
                fbq('track', 'PageView');
              `,
            }}
          />
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}
      <Suspense fallback={null}>
        <RouteTracker />
      </Suspense>
    </>
  );
}
