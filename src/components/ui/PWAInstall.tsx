"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstall() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
      return;
    }
    try {
      if (localStorage.getItem("pwa_install_dismissed")) {
        setDismissed(true);
        return;
      }
    } catch {}

    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setPrompt(null);
  };

  const dismiss = () => {
    try { localStorage.setItem("pwa_install_dismissed", "1"); } catch {}
    setDismissed(true);
  };

  if (installed || dismissed || !prompt) return null;

  return (
    <div
      className="flex items-center gap-3 rounded-2xl p-3.5 mb-5 border"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
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
          Adicionar à tela inicial para acesso rápido
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={dismiss}
          className="text-xs text-cl-muted px-2 py-1.5 rounded-lg"
          style={{ background: "var(--surface-2)" }}
        >
          Agora não
        </button>
        <button
          onClick={install}
          className="text-xs font-bold text-white px-3 py-1.5 rounded-lg"
          style={{ background: "var(--instructor)" }}
        >
          Instalar
        </button>
      </div>
    </div>
  );
}
