import Anthropic from "@anthropic-ai/sdk";
import type { MessageParam } from "@anthropic-ai/sdk/resources/messages";

const SYSTEM_PROMPT = `Você é o Instrutor do CriptoLens, um assistente especializado em criptomoedas para iniciantes brasileiros.

Seu papel é ensinar, não aconselhar financeiramente. Você:
- Explica conceitos em linguagem simples, usando analogias do dia a dia brasileiro
- Contextualiza movimentos do mercado de forma educativa
- Ensina como interpretar indicadores como RSI, Fear & Greed Index, market cap, volume
- Alerta sobre riscos sem ser alarmista
- NUNCA diz "compre X" ou "venda agora" — sempre incentiva o aprendizado próprio
- Quando usa termos técnicos, sempre os explica em seguida

Formato das respostas:
- Sempre em português brasileiro informal e acessível
- Use **negrito** para destacar conceitos-chave
- Máximo de 3-4 parágrafos — seja conciso e direto
- Use analogias simples: compare cripto a algo familiar (ações, câmbio, leilão, etc.)
- Seja encorajador: este é um ambiente de aprendizado, não um mercado agressivo`;

// Máximo de mensagens enviadas à API (reduz tokens em conversas longas)
const MAX_HISTORY = 8;

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: "API key não configurada" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  let rawMessages: Array<{ role: "user" | "assistant"; content: string }>;
  let lessonContext: string | undefined;
  try {
    const body = await req.json();
    rawMessages = body.messages;
    lessonContext = typeof body.lessonContext === "string" ? body.lessonContext : undefined;
    if (!Array.isArray(rawMessages) || rawMessages.length === 0) throw new Error("invalid");
  } catch {
    return new Response(JSON.stringify({ error: "Requisição inválida" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Quando vem de uma lição específica, adiciona contexto ao system prompt
  const systemText = lessonContext
    ? `${SYSTEM_PROMPT}\n\nContexto da lição atual: ${lessonContext}\nFoque suas respostas nesse tema, de forma direta e educativa.`
    : SYSTEM_PROMPT;

  // 1. Limitar histórico — envia só as últimas MAX_HISTORY mensagens à API.
  //    O usuário vê tudo na tela; só o que vai para a API é cortado.
  const limited = rawMessages.slice(-MAX_HISTORY);

  // 2. Prompt caching — marca o penúltimo bloco com cache_control.
  //    Nas chamadas seguintes, a API lê esse bloco do cache (10% do custo normal)
  //    em vez de reprocessar. O cache dura 5 min de inatividade.
  const messages: MessageParam[] = limited.map((msg, i) => {
    const isHistoryBoundary = limited.length >= 3 && i === limited.length - 2;
    if (isHistoryBoundary) {
      return {
        role: msg.role,
        content: [
          {
            type: "text" as const,
            text: msg.content,
            cache_control: { type: "ephemeral" as const },
          },
        ],
      };
    }
    return { role: msg.role, content: msg.content };
  });

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const readable = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();
      try {
        const stream = await client.messages.create({
          model: process.env.INSTRUCTOR_MODEL ?? "claude-haiku-4-5-20251001",
          max_tokens: 1024,
          // System prompt cacheado — pago na 1ª vez, 90% off nas seguintes
          system: [
            {
              type: "text" as const,
              text: systemText,
              cache_control: { type: "ephemeral" as const },
            },
          ],
          messages,
          stream: true,
        });

        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(
              enc.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
            );
          }
        }
        controller.enqueue(enc.encode("data: [DONE]\n\n"));
      } catch (err) {
        console.error("[instrutor] stream error:", err);
        controller.enqueue(
          enc.encode(
            `data: ${JSON.stringify({ text: "\n\n_Erro ao conectar com o instrutor. Tente novamente._" })}\n\n`
          )
        );
        controller.enqueue(enc.encode("data: [DONE]\n\n"));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
