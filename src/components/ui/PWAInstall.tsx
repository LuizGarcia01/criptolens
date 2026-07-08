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

type Mode = "prompt" | "manual" | "hidden";

function getOS(): "android" | "ios" | "other" {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent.toLowerCase();
  if (/android/.test(ua)) return "android";
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  return "other";
}

export default function PWAInstall() {
  const [mode, setMode] = useState<Mode>("hidden");
  const [showGuide, setShowGuide] = useState(false);
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Already installed as standalone
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    // User dismissed before
    try {
      if (localStorage.getItem("pwa_install_dismissed")) return;
    } catch {}

    const os = getOS();

    // Check for captured prompt (Android Chrome)
    const captured = window.__pwaPrompt;
    if (captured) {
      setPrompt(captured);
      setMode("prompt");
      return;
    }

    // Listen for future prompt event (desktop / late fire)
    const handler = (e: Event) => {
      e.preventDefault();
      const ev = e as BeforeInstallPromptEvent;
      window.__pwaPrompt = ev;
      setPrompt(ev);
      setMode("prompt");
    };
    window.addEventListener("beforeinstallprompt", handler);

    // On Android without prompt after 2s → show manual guide
    if (os === "android") {
      const timer = setTimeout(() => {
        if (!window.__pwaPrompt) setMode("manual");
      }, 2000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("beforeinstallprompt", handler);
      };
    }

    // iOS → always manual (Safari doesn't support beforeinstallprompt)
    if (os === "ios") {
      setMode("manual");
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") setMode("hidden");
    setPrompt(null);
  };

  const dismiss = () => {
    try { localStorage.setItem("pwa_install_dismissed", "1"); } catch {}
    setMode("hidden");
  };

  if (mode === "hidden") return null;

  return (
    <div
      className="rounded-2xl p-3.5 mb-5 border"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-xl"
          style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)" }}
        >
          ₿
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-cl-primary leading-tight">
            Instalar CriptoLens
          </p>
          <p className="text-xs text-cl-muted leading-snug">
            Adicione à tela inicial para acesso rápido
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={dismiss}
            className="text-xs text-cl-muted px-2 py-1.5 rounded-lg"
            style={{ background: "var(--surface-2)" }}
          >
            Não
          </button>
          {mode === "prompt" ? (
            <button
              onClick={install}
              className="text-xs font-bold text-white px-3 py-1.5 rounded-lg"
              style={{ background: "var(--instructor)" }}
            >
              Instalar
            </button>
          ) : (
            <button
              onClick={() => setShowGuide((v) => !v)}
              className="text-xs font-bold text-white px-3 py-1.5 rounded-lg"
              style={{ background: "var(--instructor)" }}
            >
              Como?
            </button>
          )}
        </div>
      </div>

      {/* Manual guide */}
      {mode === "manual" && showGuide && (
        <div
          className="mt-3 rounded-xl p-3 space-y-2"
          style={{ background: "var(--surface-2)" }}
        >
          <p className="text-xs font-bold text-cl-primary mb-1">
            Adicionar à tela inicial:
          </p>
          {getOS() === "ios" ? (
            <>
              <Step n={1} text='Toque em "Compartilhar" (ícone de caixa com seta) no Safari' />
              <Step n={2} text='"Adicionar à Tela de Início"' />
              <Step n={3} text='Confirme em "Adicionar"' />
            </>
          ) : (
            <>
              <Step n={1} text="Toque nos 3 pontinhos ⋮ no canto superior direito do Chrome" />
              <Step n={2} text='"Adicionar à tela inicial"' />
              <Step n={3} text='Confirme em "Adicionar"' />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Step({ n, text }: { n: number; text: string }) {
  return (
    <div className="flex items-start gap-2">
      <span
        className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white mt-0.5"
        style={{ background: "var(--instructor)" }}
      >
        {n}
      </span>
      <p className="text-xs text-cl-secondary leading-snug">{text}</p>
    </div>
  );
}
