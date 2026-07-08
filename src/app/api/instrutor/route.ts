import Anthropic from "@anthropic-ai/sdk";
import type { MessageParam } from "@anthropic-ai/sdk/resources/messages";

const SYSTEM_PROMPT = `Você é o Instrutor do CriptoLens, assistente especializado em criptomoedas para iniciantes brasileiros.

## REGRA PRINCIPAL: Seja específico, não genérico

Quando o usuário perguntar sobre um movimento de preço específico (ex: "por que o BTC caiu 2.4%?"), você deve:
1. Usar os dados de mercado em tempo real fornecidos no contexto abaixo
2. Citar as notícias reais que aparecem no contexto, se relevantes ao movimento
3. Analisar o que o Fear & Greed Index e os preços atuais indicam AGORA
4. Se não houver notícia clara sobre a causa, diga isso diretamente: "Os dados disponíveis não indicam uma causa única, mas..." — e analise os indicadores
5. NUNCA dê uma resposta genérica sobre "fatores que geralmente influenciam cripto" quando a pergunta é sobre algo específico de hoje
6. NUNCA ignore o contexto de mercado fornecido

## O que você faz
- Responde com base nos dados reais fornecidos (preços ao vivo, Fear & Greed, notícias do dia)
- Explica conceitos em linguagem simples com analogias do dia a dia brasileiro
- Ensina como interpretar RSI, Fear & Greed Index, market cap, volume
- Alerta sobre riscos sem ser alarmista
- NUNCA diz "compre X" ou "venda agora"
- Quando usa termos técnicos, explica em seguida

## Formato das respostas
- Português brasileiro informal e acessível
- Use **negrito** para conceitos-chave
- Máximo de 3-4 parágrafos — conciso e direto
- Seja encorajador: este é um ambiente de aprendizado`;

// Máximo de mensagens enviadas à API (reduz tokens em conversas longas)
const MAX_HISTORY = 8;

interface MarketContext {
  fearGreed: number;
  fearGreedLabel: string;
  coins: Array<{ name: string; symbol: string; price: number; change24h: number }>;
  newsHeadlines: string[];
  fetchedAt: string;
}

function buildMarketBlock(ctx: MarketContext): string {
  const coinLines = ctx.coins
    .map((c) => `  • ${c.name} (${c.symbol}): $${c.price.toLocaleString("en-US", { maximumFractionDigits: 2 })} (${c.change24h >= 0 ? "+" : ""}${c.change24h.toFixed(2)}% 24h)`)
    .join("\n");

  const newsLines = ctx.newsHeadlines.length
    ? ctx.newsHeadlines.map((h) => `  • ${h}`).join("\n")
    : "  • Sem notícias disponíveis no momento";

  return `
## DADOS DE MERCADO EM TEMPO REAL (${new Date(ctx.fetchedAt).toLocaleString("pt-BR")})

Fear & Greed Index: ${ctx.fearGreed}/100 — ${ctx.fearGreedLabel}

Preços atuais:
${coinLines}

Notícias recentes do mercado cripto:
${newsLines}

Use estes dados para dar respostas específicas e atuais. Se o usuário perguntar sobre um movimento de preço, cruze com as notícias acima.`;
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: "API key não configurada" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  let rawMessages: Array<{ role: "user" | "assistant"; content: string }>;
  let lessonContext: string | undefined;
  let marketContext: MarketContext | undefined;
  try {
    const body = await req.json();
    rawMessages = body.messages;
    lessonContext = typeof body.lessonContext === "string" ? body.lessonContext : undefined;
    marketContext = body.marketContext ?? undefined;
    if (!Array.isArray(rawMessages) || rawMessages.length === 0) throw new Error("invalid");
  } catch {
    return new Response(JSON.stringify({ error: "Requisição inválida" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Build system text with all available context
  let systemText = SYSTEM_PROMPT;
  if (marketContext) {
    systemText += "\n\n" + buildMarketBlock(marketContext);
  }
  if (lessonContext) {
    systemText += `\n\nContexto da lição atual: ${lessonContext}\nFoque suas respostas nesse tema, de forma direta e educativa.`;
  }

  // 1. Limitar histórico — envia só as últimas MAX_HISTORY mensagens à API.
  const limited = rawMessages.slice(-MAX_HISTORY);

  // 2. Prompt caching — marca o penúltimo bloco com cache_control.
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
