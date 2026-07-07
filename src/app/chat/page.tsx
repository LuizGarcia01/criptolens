"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

const STARTERS = [
  "O que é Bitcoin e por que ele é importante?",
  "Como funciona o Fear & Greed Index?",
  "O que significa uma moeda cair 10% em um dia?",
  "O que é RSI e como usar?",
  "Qual a diferença entre Bitcoin e altcoins?",
  "Como funciona o market cap de uma criptomoeda?",
];

function renderMarkdown(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n\n/g, "<br><br>")
    .replace(/\n/g, "<br>");
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Pre-fill from URL param (e.g. ?q=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      setInput(q);
      window.history.replaceState({}, "", "/chat");
      // Auto-focus so user can send immediately
      textareaRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: text.trim() };
    const apiMessages = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setIsLoading(true);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "", streaming: true },
    ]);

    try {
      const res = await fetch("/api/instrutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (res.status === 503) {
        setApiKeyMissing(true);
        setMessages((prev) => prev.slice(0, -1));
        return;
      }

      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let aiContent = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.startsWith("data: ") && !line.includes("[DONE]")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.text) {
                aiContent += data.text;
                setMessages((prev) => [
                  ...prev.slice(0, -1),
                  { role: "assistant", content: aiContent, streaming: true },
                ]);
              }
            } catch {
              // ignore malformed SSE lines
            }
          }
        }
      }

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "assistant", content: aiContent, streaming: false },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: "assistant",
          content: "Ocorreu um erro ao conectar com o instrutor. Tente novamente.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  return (
    <div
      className="flex flex-col max-w-lg mx-auto"
      style={{ height: "calc(100dvh - 5rem)" }}
    >
      {/* Header */}
      <div className="flex-shrink-0 px-4 pt-5 pb-3 border-b border-cl-border">
        <p className="text-xs font-semibold tracking-widest uppercase text-cl-muted mb-0.5">
          Assistente
        </p>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-cl-primary">
            Instrutor
          </h1>
          <span
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full"
            style={{
              background: "var(--instructor-bg)",
              color: "var(--instructor)",
              border: "1px solid var(--instructor-border)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--instructor)" }}
            />
            Claude AI
          </span>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Welcome + starters (shown when no messages) */}
        {messages.length === 0 && (
          <>
            <div className="flex gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm mt-0.5"
                style={{ background: "var(--instructor)" }}
              >
                🎓
              </div>
              <div
                className="rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed border"
                style={{
                  background: "var(--instructor-bg)",
                  borderColor: "var(--instructor-border)",
                  color: "var(--text-secondary)",
                }}
              >
                <p
                  className="font-semibold mb-1"
                  style={{ color: "var(--instructor)" }}
                >
                  Olá! Sou seu Instrutor de Cripto.
                </p>
                Pergunte qualquer coisa — do que é Bitcoin até como interpretar
                o Fear &amp; Greed Index. Explico tudo em linguagem simples, sem
                jargão. 🚀
              </div>
            </div>

            {!apiKeyMissing && (
              <div>
                <p className="text-xs text-cl-muted mb-2 px-1">
                  Perguntas frequentes:
                </p>
                <div className="space-y-2">
                  {STARTERS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="w-full text-left text-sm px-3 py-2.5 rounded-xl border transition-all active:scale-[0.98]"
                      style={{
                        borderColor: "var(--instructor-border)",
                        background: "var(--instructor-bg)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {apiKeyMissing && (
              <div className="bg-cl-surface border border-cl-border rounded-2xl p-4">
                <p className="text-xs font-bold tracking-wider uppercase text-cl-muted mb-3">
                  Configure o Instrutor
                </p>
                <ol className="space-y-3">
                  {[
                    "Crie uma conta em console.anthropic.com",
                    "Gere uma API Key no painel",
                    "Crie o arquivo .env.local com: ANTHROPIC_API_KEY=sua_chave",
                    "Reinicie o servidor (Ctrl+C e npm run dev)",
                  ].map((text, i) => (
                    <li key={i} className="flex items-baseline gap-3 text-sm">
                      <span className="font-mono text-xs font-bold text-cl-accent flex-shrink-0">
                        0{i + 1}
                      </span>
                      <span className="text-cl-secondary">{text}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </>
        )}

        {/* Message bubbles */}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {msg.role === "assistant" && (
              <div
                className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs mt-0.5"
                style={{ background: "var(--instructor)" }}
              >
                🎓
              </div>
            )}

            <div
              className={`rounded-2xl px-4 py-3 text-sm leading-relaxed max-w-[82%] ${
                msg.role === "user" ? "rounded-tr-sm" : "rounded-tl-sm border"
              }`}
              style={
                msg.role === "user"
                  ? { background: "var(--accent)", color: "#111827" }
                  : {
                      background: "var(--instructor-bg)",
                      borderColor: "var(--instructor-border)",
                      color: "var(--text-secondary)",
                    }
              }
            >
              {msg.content === "" && msg.streaming ? (
                <span className="inline-flex gap-1 items-center py-0.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-bounce"
                    style={{
                      background: "var(--instructor)",
                      animationDelay: "0ms",
                    }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-bounce"
                    style={{
                      background: "var(--instructor)",
                      animationDelay: "150ms",
                    }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-bounce"
                    style={{
                      background: "var(--instructor)",
                      animationDelay: "300ms",
                    }}
                  />
                </span>
              ) : msg.role === "assistant" ? (
                <span
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(msg.content),
                  }}
                />
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="flex-shrink-0 px-4 pb-4 pt-2 border-t border-cl-border">
        {apiKeyMissing ? (
          <p className="text-sm text-cl-muted text-center py-1">
            Configure a{" "}
            <code
              className="font-mono text-xs rounded px-1 py-0.5"
              style={{ background: "var(--surface-2)" }}
            >
              ANTHROPIC_API_KEY
            </code>{" "}
            no{" "}
            <code
              className="font-mono text-xs rounded px-1 py-0.5"
              style={{ background: "var(--surface-2)" }}
            >
              .env.local
            </code>{" "}
            para ativar
          </p>
        ) : (
          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Pergunte qualquer coisa sobre cripto..."
              rows={1}
              disabled={isLoading}
              className="flex-1 resize-none rounded-xl border px-3 py-2.5 text-sm focus:outline-none transition-colors disabled:opacity-60"
              style={{
                borderColor: "var(--border)",
                background: "var(--surface-2)",
                color: "var(--text-primary)",
                maxHeight: "120px",
              }}
            />
            <button
              onClick={() => send(input)}
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all active:scale-95 disabled:opacity-40"
              style={{ background: "var(--instructor)" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M14 8H2M9 3l5 5-5 5"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
