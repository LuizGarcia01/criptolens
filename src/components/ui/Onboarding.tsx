"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const KEY = "criptolens_onboarded_v1";

const SLIDES = [
  {
    emoji: "🎓",
    title: "Bem-vindo ao CriptoLens",
    subtitle: "O mercado cripto ao vivo como sua sala de aula particular.",
    body: "Um Instrutor de IA do seu lado em cada tela — explica qualquer número, sinal ou notícia na hora que você precisar.",
    extra: null,
  },
  {
    emoji: null,
    title: "O que você vai encontrar",
    subtitle: null,
    body: null,
    extra: [
      { icon: "📚", label: "Aprender", desc: "16 lições com vídeo, visual e mini-chat por lição" },
      { icon: "📊", label: "Sinais", desc: "RSI e tendência ao vivo das principais moedas" },
      { icon: "🎮", label: "Simular", desc: "Trades virtuais com feedback do Instrutor" },
      { icon: "⚡", label: "Missão do dia", desc: "Uma tarefa educativa nova a cada dia" },
    ],
  },
  {
    emoji: "🤝",
    title: "O Instrutor está com você",
    subtitle: "Em cada tela há um botão 🎓 ou uma pergunta contextual.",
    body: 'Toque neles a qualquer hora. Não existe pergunta idiota — quanto mais você perguntar, mais vai aprender.',
    extra: null,
  },
];

export default function Onboarding() {
  const [show, setShow] = useState(false);
  const [slide, setSlide] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      // If localStorage is blocked, skip onboarding
    }
  }, []);

  const goTo = (next: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setSlide(next);
      setAnimating(false);
    }, 180);
  };

  const finish = () => {
    try { localStorage.setItem(KEY, "1"); } catch {}
    setShow(false);
  };

  if (!show) return null;

  const current = SLIDES[slide];
  const isLast = slide === SLIDES.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "var(--background)" }}
    >
      {/* Skip */}
      <div className="flex justify-end p-4 pt-safe">
        <button
          onClick={finish}
          className="text-xs font-semibold text-cl-muted px-3 py-1.5 rounded-xl"
          style={{ background: "var(--surface-2)" }}
        >
          Pular
        </button>
      </div>

      {/* Content */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-6 pb-4 transition-opacity duration-200"
        style={{ opacity: animating ? 0 : 1 }}
      >
        {/* Slide 0 & 2: emoji + text */}
        {current.emoji && (
          <>
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-6"
              style={{ background: "var(--instructor-bg)", border: "2px solid var(--instructor-border)" }}
            >
              {current.emoji}
            </div>
            <h1 className="text-2xl font-bold text-cl-primary text-center mb-2 leading-tight">
              {current.title}
            </h1>
            {current.subtitle && (
              <p className="text-sm font-semibold text-center mb-3" style={{ color: "var(--instructor)" }}>
                {current.subtitle}
              </p>
            )}
            {current.body && (
              <p className="text-sm text-cl-secondary text-center leading-relaxed max-w-xs">
                {current.body}
              </p>
            )}
          </>
        )}

        {/* Slide 1: feature grid */}
        {current.extra && (
          <>
            <h1 className="text-2xl font-bold text-cl-primary text-center mb-6 leading-tight">
              {current.title}
            </h1>
            <div className="w-full max-w-xs space-y-3">
              {current.extra.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-2xl p-3.5 border"
                  style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                >
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-cl-primary">{item.label}</p>
                    <p className="text-xs text-cl-muted leading-snug">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 pb-8 space-y-4">
        {/* Dots */}
        <div className="flex items-center justify-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="rounded-full transition-all duration-200"
              style={{
                width: i === slide ? 20 : 6,
                height: 6,
                background: i === slide ? "var(--accent)" : "var(--surface-2)",
              }}
            />
          ))}
        </div>

        {/* Button */}
        {isLast ? (
          <Link
            href="/"
            onClick={finish}
            className="block w-full py-3.5 rounded-2xl text-sm font-bold text-center text-white"
            style={{ background: "var(--accent)" }}
          >
            Começar agora →
          </Link>
        ) : (
          <button
            onClick={() => goTo(slide + 1)}
            className="w-full py-3.5 rounded-2xl text-sm font-bold text-white"
            style={{ background: "var(--accent)" }}
          >
            Próximo →
          </button>
        )}
      </div>
    </div>
  );
}
