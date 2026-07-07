"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

interface LessonChatProps {
  lessonTitle: string;
  lessonContext: string;
  starters: string[];
  maxExchanges?: number;
}

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

export default function LessonChat({
  lessonTitle,
  lessonContext,
  starters,
  maxExchanges = 3,
}: LessonChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const exchanges = Math.floor(messages.filter((m) => m.role === "user").length);
  const limitReached = exchanges >= maxExchanges;
  const remaining = maxExchanges - exchanges;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || isLoading || limitReached) return;

    const userMsg: Message = { role: "user", content: text.trim() };
    const apiMessages = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "", streaming: true },
    ]);

    try {
      const res = await fetch("/api/instrutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, lessonContext }),
      });

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
        { role: "assistant", content: "Erro ao conectar. Tente novamente." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ borderColor: "var(--instructor-border)" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2.5 px-4 py-3 border-b"
        style={{
          background: "var(--instructor-bg)",
          borderColor: "var(--instructor-border)",
        }}
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0"
          style={{ background: "var(--instructor)" }}
        >
          🎓
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold" style={{ color: "var(--instructor)" }}>
            Instrutor — Tire suas dúvidas
          </p>
          {!limitReached && (
            <p className="text-[10px] text-cl-muted">
              {remaining} pergunta{remaining !== 1 ? "s" : ""} restante{remaining !== 1 ? "s" : ""} · {lessonTitle}
            </p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div
        className="p-4 space-y-3"
        style={{ background: "var(--surface-2)", minHeight: "80px" }}
      >
        {/* Starter chips when no messages */}
        {messages.length === 0 && (
          <div className="space-y-2">
            {starters.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="w-full text-left text-xs px-3 py-2 rounded-lg border transition-all active:scale-[0.98]"
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
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {msg.role === "assistant" && (
              <div
                className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs mt-0.5"
                style={{ background: "var(--instructor)" }}
              >
                🎓
              </div>
            )}
            <div
              className={`rounded-xl px-3 py-2 text-xs leading-relaxed max-w-[85%] ${
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
                    className="w-1 h-1 rounded-full animate-bounce"
                    style={{ background: "var(--instructor)", animationDelay: "0ms" }}
                  />
                  <span
                    className="w-1 h-1 rounded-full animate-bounce"
                    style={{ background: "var(--instructor)", animationDelay: "150ms" }}
                  />
                  <span
                    className="w-1 h-1 rounded-full animate-bounce"
                    style={{ background: "var(--instructor)", animationDelay: "300ms" }}
                  />
                </span>
              ) : msg.role === "assistant" ? (
                <span
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                />
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}

        {/* Limit reached */}
        {limitReached && (
          <div className="text-center pt-2">
            <p className="text-xs text-cl-muted mb-2">
              Limite de perguntas desta lição atingido.
            </p>
            <Link
              href={`/chat?q=${encodeURIComponent("Tenho mais dúvidas sobre " + lessonTitle)}`}
              className="text-xs font-semibold px-4 py-2 rounded-lg inline-block transition-opacity active:opacity-80"
              style={{ background: "var(--instructor)", color: "white" }}
            >
              Continuar no Chat Completo →
            </Link>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {!limitReached && (
        <div className="flex items-center gap-2 px-3 py-2.5 border-t border-cl-border bg-cl-surface">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send(input);
            }}
            placeholder="Ficou com dúvida? Pergunte aqui..."
            disabled={isLoading}
            className="flex-1 rounded-xl px-3 py-2 text-xs focus:outline-none disabled:opacity-60 transition-colors"
            style={{
              border: "1px solid var(--border)",
              background: "var(--surface-2)",
              color: "var(--text-primary)",
            }}
          />
          <button
            onClick={() => send(input)}
            disabled={isLoading || !input.trim()}
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all active:scale-95 disabled:opacity-40"
            style={{ background: "var(--instructor)" }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M10.5 6H1.5M7 2.5L10.5 6 7 9.5"
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
  );
}
