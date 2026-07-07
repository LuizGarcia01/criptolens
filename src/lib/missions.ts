export interface Mission {
  id: number;
  emoji: string;
  title: string;
  description: string;
  steps: string[];
  cta: { label: string; href: string };
  instructorQ: string;
  category: string;
  duration: string;
}

type MissionFn = (fearGreedValue: number, fearGreedLabel: string) => Mission;

const FACTORIES: MissionFn[] = [
  // 0 — Fear & Greed
  (fg, fgLabel) => ({
    id: 0, emoji: "🌡️", category: "Mercado", duration: "5 min",
    title: "Leia o termômetro do mercado",
    description: `O Fear & Greed Index está em ${fg} hoje (${fgLabel}). Descubra o que esse número revela sobre o comportamento dos investidores agora.`,
    steps: [
      "Veja o Fear & Greed Index na tela inicial",
      `Identifique o que "${fgLabel}" significa na prática`,
      "Pergunte ao Instrutor como agir nesse cenário",
    ],
    cta: { label: "Ver na tela inicial", href: "/" },
    instructorQ: `O Fear & Greed Index está em ${fg} (${fgLabel}) hoje. Como iniciante, o que isso significa e como devo agir?`,
  }),

  // 1 — RSI sobrevendido
  () => ({
    id: 1, emoji: "🔍", category: "Análise", duration: "8 min",
    title: "Encontre uma oportunidade nos Sinais",
    description: "RSI abaixo de 30 pode indicar um ativo vendido em excesso — preço caiu rápido demais. Veja os Sinais e identifique se algum ativo está assim.",
    steps: [
      "Abra a página de Sinais",
      "Encontre um ativo com RSI menor que 30",
      "Pergunte ao Instrutor se é realmente uma oportunidade",
    ],
    cta: { label: "Abrir Sinais", href: "/sinais" },
    instructorQ: "Vi que um ativo tem RSI abaixo de 30 nos Sinais. Isso significa que devo comprar? Quais outros fatores preciso considerar antes de decidir?",
  }),

  // 2 — Bitcoin
  () => ({
    id: 2, emoji: "₿", category: "Aprender", duration: "10 min",
    title: "Entenda o pioneiro das criptos",
    description: "Antes de qualquer outro ativo, o Bitcoin é o fundamento. Entenda como ele funciona, por que tem valor e o que o torna único.",
    steps: [
      "Estude a lição sobre Bitcoin em Aprender",
      "Assista ao vídeo e revise o resumo visual",
      "Faça pelo menos 1 pergunta ao Instrutor",
    ],
    cta: { label: "Estudar Bitcoin", href: "/aprender/bitcoin" },
    instructorQ: "Acabei de estudar sobre Bitcoin. Uma coisa que não entendi: por que o Bitcoin vale tanto se é só digital? O que garante que não vai a zero?",
  }),

  // 3 — Primeiro trade
  () => ({
    id: 3, emoji: "🎮", category: "Simulador", duration: "10 min",
    title: "Faça sua primeira operação simulada",
    description: "Sem risco real. Use os US$1.000 virtuais do Simulador, faça uma compra e sinta na prática como funciona uma operação.",
    steps: [
      "Abra o Simulador e veja os preços ao vivo",
      "Compre pelo menos US$50 de qualquer moeda",
      "Pergunte ao Instrutor se foi uma boa escolha",
    ],
    cta: { label: "Abrir Simulador", href: "/simular" },
    instructorQ: "Acabei de fazer minha primeira compra no simulador. Como sei se tomei uma boa decisão? Que critérios um trader usa para avaliar um trade?",
  }),

  // 4 — Notícias
  () => ({
    id: 4, emoji: "📰", category: "Mercado", duration: "7 min",
    title: "Interprete uma notícia com o Instrutor",
    description: "Notícias movem o mercado. Saber separar o que importa do ruído é uma habilidade essencial para qualquer investidor.",
    steps: [
      "Leia as notícias na tela inicial",
      "Escolha uma que chamou sua atenção",
      "Pergunte ao Instrutor como ela pode impactar os preços",
    ],
    cta: { label: "Ver notícias", href: "/" },
    instructorQ: "Li uma notícia de cripto hoje que me chamou atenção. Como avalio se ela é relevante o suficiente para influenciar uma decisão de investimento?",
  }),

  // 5 — Tendência de alta
  () => ({
    id: 5, emoji: "📈", category: "Análise", duration: "8 min",
    title: "Identifique quem está em tendência de alta",
    description: "Quando a média de 7 dias fica acima da de 30 dias, o ativo está em tendência de alta. Veja quais moedas estão nessa condição agora.",
    steps: [
      "Abra os Sinais e olhe a coluna de Tendência",
      "Encontre um ativo com ↗ Alta (MA7 > MA30)",
      "Compare com o RSI — os dois confirmam o mesmo sinal?",
    ],
    cta: { label: "Abrir Sinais", href: "/sinais" },
    instructorQ: "Um ativo está com MA7 acima do MA30 (tendência de alta) e RSI neutro. Isso é um bom momento para comprar? O que mais devo verificar?",
  }),

  // 6 — DCA
  () => ({
    id: 6, emoji: "📅", category: "Aprender", duration: "10 min",
    title: "Conheça a estratégia favorita dos investidores de longo prazo",
    description: "Dollar-Cost Averaging: comprar um valor fixo regularmente, sem se preocupar com o preço. Simples e eficaz para iniciantes.",
    steps: [
      "Estude a lição sobre DCA em Aprender",
      "Calcule: DCA de R$100/mês por 12 meses = R$1.200 investidos",
      "Pergunte ao Instrutor se DCA é certo para o seu perfil",
    ],
    cta: { label: "Estudar DCA", href: "/aprender/dca" },
    instructorQ: "Aprendi sobre DCA. Se eu tenho R$200/mês para investir em cripto, como montar uma estratégia DCA consistente? Foco em BTC, ETH ou diversifico?",
  }),

  // 7 — Portfolio diversificado
  () => ({
    id: 7, emoji: "🧺", category: "Simulador", duration: "12 min",
    title: "Monte um portfolio diversificado",
    description: "Não coloque tudo em um único ativo. Simule hoje um portfolio com 3 moedas diferentes e entenda por que diversificar importa.",
    steps: [
      "Abra o Simulador e compre 3 moedas distintas",
      "Distribua os US$1.000 entre elas conscientemente",
      "Peça ao Instrutor para analisar sua diversificação",
    ],
    cta: { label: "Abrir Simulador", href: "/simular" },
    instructorQ: "Montei um portfolio simulado com 3 moedas diferentes. Como sei se estou bem diversificado? Qual a proporção ideal para um iniciante: mais BTC ou mais altcoins?",
  }),

  // 8 — RSI sobrecomprado
  () => ({
    id: 8, emoji: "🚨", category: "Análise", duration: "7 min",
    title: "Identifique riscos no mercado hoje",
    description: "RSI acima de 70 indica sobrecompra — o preço subiu rápido demais e pode corrigir. Veja se há algum ativo assim nos Sinais agora.",
    steps: [
      "Abra os Sinais e procure RSI acima de 70",
      "Veja o panorama geral (quantos sobrecomprados?)",
      "Pergunte ao Instrutor o que fazer quando um ativo está sobrecomprado",
    ],
    cta: { label: "Ver Sinais", href: "/sinais" },
    instructorQ: "Um ativo está com RSI acima de 70 (sobrecomprado). Isso significa que devo vender? Ou RSI alto pode continuar subindo? Quando o sinal de venda fica válido?",
  }),

  // 9 — Gestão de risco
  () => ({
    id: 9, emoji: "🛡️", category: "Aprender", duration: "10 min",
    title: "Aprenda a proteger seu dinheiro",
    description: "Gestão de risco é o que separa traders que sobrevivem dos que perdem tudo. Aprenda stop loss, sizing de posição e regras essenciais.",
    steps: [
      "Estude a lição de Gestão de Risco em Aprender",
      "Entenda o que é stop loss e quando usar",
      "Pergunte ao Instrutor quanto do capital arriscar por trade",
    ],
    cta: { label: "Estudar Gestão de Risco", href: "/aprender/gestao-risco" },
    instructorQ: "Aprendi sobre gestão de risco. Se eu tenho R$1.000 para investir em cripto, quanto é razoável arriscar em uma única operação? Qual a regra dos traders profissionais?",
  }),

  // 10 — Altcoins
  () => ({
    id: 10, emoji: "🪙", category: "Aprender", duration: "8 min",
    title: "Explore além do Bitcoin",
    description: "Altcoins são todas as criptomoedas além do Bitcoin. Ethereum, Solana, Cardano — cada uma com uma proposta diferente. Entenda o ecossistema.",
    steps: [
      "Estude a lição sobre Altcoins em Aprender",
      "Compare: qual a proposta do Ethereum vs Bitcoin?",
      "Pergunte ao Instrutor qual altcoin faz mais sentido estudar primeiro",
    ],
    cta: { label: "Estudar Altcoins", href: "/aprender/altcoins" },
    instructorQ: "Aprendi sobre altcoins. O que diferencia Ethereum de Bitcoin no uso real? E o Solana — qual problema ele tenta resolver que os outros dois não conseguem?",
  }),

  // 11 — Market cap
  () => ({
    id: 11, emoji: "⚖️", category: "Mercado", duration: "6 min",
    title: "Entenda o verdadeiro tamanho das moedas",
    description: "Preço baixo não significa moeda barata. O market cap revela o tamanho real de uma cripto no mercado — e isso muda tudo.",
    steps: [
      "Veja o market cap de cada moeda na tela inicial",
      "Compare o market cap do BTC com uma altcoin de preço baixo",
      "Pergunte ao Instrutor por que preço baixo não é sinônimo de oportunidade",
    ],
    cta: { label: "Ver Market Caps", href: "/" },
    instructorQ: "Olhei os market caps hoje. Por que uma moeda com preço de R$0,01 não é necessariamente mais barata ou com mais potencial que o Bitcoin? Como o market cap muda minha análise?",
  }),

  // 12 — Análise completa
  () => ({
    id: 12, emoji: "🔬", category: "Análise", duration: "15 min",
    title: "Análise completa de um ativo",
    description: "Una tudo que aprendeu: RSI, tendência, sentimento de mercado e notícias. Escolha um ativo e faça uma análise de 360°.",
    steps: [
      "Escolha BTC ou ETH para analisar",
      "Veja RSI e tendência nos Sinais",
      "Pergunte ao Instrutor uma análise completa com todos os dados",
    ],
    cta: { label: "Ver Sinais", href: "/sinais" },
    instructorQ: "Quero fazer uma análise completa do Bitcoin: RSI atual, tendência de médias móveis, Fear & Greed e notícias recentes. Pode me guiar no que cada dado significa e qual seria a conclusão?",
  }),

  // 13 — Revisar portfolio
  () => ({
    id: 13, emoji: "📊", category: "Simulador", duration: "10 min",
    title: "Revise sua carteira simulada com o Instrutor",
    description: "Hora de fazer uma retrospectiva. Veja seu portfolio virtual, analise P&L e peça ao Instrutor uma avaliação honesta da sua estratégia.",
    steps: [
      "Abra o Simulador e veja a aba Carteira",
      "Avalie seu P&L e a composição do portfolio",
      "Peça uma análise ao Instrutor com sugestões de melhoria",
    ],
    cta: { label: "Ver Carteira Virtual", href: "/simular" },
    instructorQ: "Quero revisar minha carteira virtual no simulador. Além do P&L total, que métricas devo olhar para saber se minha estratégia está funcionando? O que mudaria na minha abordagem?",
  }),
];

export function getMissionForDay(
  date: Date,
  fearGreedValue: number,
  fearGreedLabel: string
): Mission {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor(
    (date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
  );
  const idx = ((dayOfYear % FACTORIES.length) + FACTORIES.length) % FACTORIES.length;
  return FACTORIES[idx](fearGreedValue, fearGreedLabel);
}

export function getNextMission(
  date: Date,
  fearGreedValue: number,
  fearGreedLabel: string
): Mission {
  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getMissionForDay(tomorrow, fearGreedValue, fearGreedLabel);
}
