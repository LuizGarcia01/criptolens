"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
  interface Window {
    __pwaPrompt?: BeforeInstallPromptEvent;
  }
}

function getOS(): "android" | "ios" | "other" {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent.toLowerCase();
  if (/android/.test(ua)) return "android";
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  return "other";
}

export default function PWAInstall() {
  const [visible, setVisible] = useState(false);
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const os = typeof navigator !== "undefined" ? getOS() : "other";

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    try {
      if (localStorage.getItem("pwa_install_dismissed")) return;
    } catch {}

    // Capture native prompt if available
    const captured = window.__pwaPrompt;
    if (captured) setPrompt(captured);

    const handler = (e: Event) => {
      e.preventDefault();
      const ev = e as BeforeInstallPromptEvent;
      window.__pwaPrompt = ev;
      setPrompt(ev);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // Show banner on mobile (Android + iOS)
    if (os === "android" || os === "ios") setVisible(true);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [os]);

  const install = async () => {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") setVisible(false);
    setPrompt(null);
  };

  const dismiss = () => {
    try { localStorage.setItem("pwa_install_dismissed", "1"); } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  const steps = os === "ios"
    ? [
        'Toque em "Compartilhar" (ícone □↑) no Safari',
        '"Adicionar à Tela de Início"',
        'Confirme em "Adicionar"',
      ]
    : [
        "Toque nos 3 pontinhos ⋮ no canto superior direito",
        '"Adicionar à tela inicial"',
        'Confirme em "Adicionar"',
      ];

  return (
    <div
      className="rounded-2xl p-4 mb-5 border"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)" }}
          >
            ₿
          </div>
          <div>
            <p className="text-sm font-bold text-cl-primary leading-tight">
              Instalar CriptoLens
            </p>
            <p className="text-xs text-cl-muted">Adicione à tela inicial</p>
          </div>
        </div>
        <button
          onClick={dismiss}
          className="text-cl-muted text-lg leading-none px-1"
          aria-label="Fechar"
        >
          ×
        </button>
      </div>

      {/* Native install button if prompt available */}
      {prompt ? (
        <button
          onClick={install}
          className="w-full py-3 rounded-xl text-sm font-bold text-white"
          style={{ background: "var(--instructor)" }}
        >
          Instalar agora
        </button>
      ) : (
        /* Manual steps always visible */
        <div
          className="rounded-xl p-3 space-y-2"
          style={{ background: "var(--surface-2)" }}
        >
          <p className="text-xs font-bold text-cl-primary mb-2">
            {os === "ios" ? "No Safari:" : "No Chrome:"}
          </p>
          {steps.map((text, i) => (
            <div key={i} className="flex items-start gap-2">
              <span
                className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white mt-0.5"
                style={{ background: "var(--instructor)" }}
              >
                {i + 1}
              </span>
              <p className="text-xs text-cl-secondary leading-snug">{text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
