export type Level = "Iniciante" | "Intermediário" | "Avançado";

export interface ComparisonBlock {
  type: "comparison";
  title: string;
  left: { bg: string; icon: string; title: string; desc: string; textColor?: string };
  right: { bg: string; icon: string; title: string; desc: string; textColor?: string };
  summary?: string;
}
export interface StepsBlock {
  type: "steps";
  title: string;
  items: Array<{ icon: string; label: string; sub: string }>;
  note?: string;
  vertical?: boolean;
}
export interface FactsBlock {
  type: "facts";
  title: string;
  items: Array<{ value: string; label: string; icon: string }>;
  note?: string;
}
export interface PillarsBlock {
  type: "pillars";
  title: string;
  items: Array<{ icon: string; title: string; desc: string }>;
}
export interface TableBlock {
  type: "table";
  title: string;
  headers: string[];
  rows: Array<{ cells: string[]; highlight?: boolean }>;
  note?: string;
}
export interface ScaleBlock {
  type: "scale";
  title: string;
  items: Array<{ range: string; label: string; color: string; desc: string }>;
  note?: string;
}
export interface ExplanationBlock {
  type: "explanation";
  title: string;
  text: string;
  items?: Array<{ icon: string; text: string }>;
}

export type VisualBlock =
  | ComparisonBlock | StepsBlock | FactsBlock | PillarsBlock
  | TableBlock | ScaleBlock | ExplanationBlock;

export interface Lesson {
  slug: string;
  icon: string;
  title: string;
  category: string;
  level: Level;
  duration: string;
  videoId: string;
  lessonContext: string;
  chatStarters: string[];
  visualBlocks: VisualBlock[];
  takeaways: string[];
}

export const LESSONS: Lesson[] = [
  // ── FUNDAMENTOS ──────────────────────────────────────────────────────────
  {
    slug: "blockchain",
    icon: "🔗",
    title: "O que é Blockchain?",
    category: "Fundamentos",
    level: "Iniciante",
    duration: "5 min",
    videoId: "dZid_N5i6Tg",
    lessonContext: "O usuário estudou a lição sobre Blockchain: o que é, como funciona como livro-razão distribuído, imutabilidade dos blocos e por que ninguém pode alterar o histórico.",
    chatStarters: [
      "Se blockchain é público, meu saldo fica visível para todo mundo?",
      "Qual a diferença entre blockchain pública e privada?",
      "Blockchain pode ser usado para outras coisas além de cripto?",
    ],
    visualBlocks: [
      {
        type: "comparison",
        title: "🏦 Banco vs. Blockchain",
        left: { bg: "var(--surface-2)", icon: "🏦", title: "Banco tradicional", desc: "Um servidor central guarda todos os registros. Se o banco sair do ar, os dados somem." },
        right: { bg: "#EFF6FF", icon: "🔗", title: "Blockchain", desc: "Milhares de cópias do mesmo livro espalhadas pelo mundo. Impossível apagar ou alterar.", textColor: "#1E40AF" },
        summary: "Na blockchain, cada transação é um \"bloco\" encadeado ao anterior — por isso o nome. Alterar um bloco invalidaria todos os seguintes.",
      },
      {
        type: "steps",
        title: "📦 Como um bloco é adicionado?",
        vertical: true,
        items: [
          { icon: "📤", label: "Você envia uma transação", sub: "ex: 0.01 BTC para um amigo" },
          { icon: "📡", label: "A rede recebe e valida", sub: "milhares de computadores verificam se é legítima" },
          { icon: "🔒", label: "O bloco é criado e lacrado", sub: "recebe um código único (hash)" },
          { icon: "⛓️", label: "Encadeado ao bloco anterior", sub: "a cadeia cresce — imutável para sempre" },
        ],
        note: "Este processo leva ~10 minutos no Bitcoin e segundos em outras blockchains.",
      },
      {
        type: "pillars",
        title: "💎 Por que blockchain importa?",
        items: [
          { icon: "🔒", title: "Imutável", desc: "Nenhum dado gravado pode ser alterado — nem por governos nem por hackers" },
          { icon: "🌐", title: "Distribuído", desc: "Não existe um único ponto de falha. A rede continua mesmo se metade dos computadores cair" },
          { icon: "🔍", title: "Transparente", desc: "Qualquer pessoa pode verificar qualquer transação de qualquer moeda a qualquer momento" },
        ],
      },
    ],
    takeaways: [
      "Blockchain é um livro-razão compartilhado por milhares de computadores",
      "Uma vez gravado, nenhum dado pode ser alterado ou apagado",
      "Não existe um dono — a rede é mantida por todos os participantes",
      "Blockchain vai além do cripto: contratos, votos, registros de propriedade, saúde",
    ],
  },
  {
    slug: "altcoins",
    icon: "🌐",
    title: "Bitcoin vs Altcoins",
    category: "Fundamentos",
    level: "Iniciante",
    duration: "4 min",
    videoId: "ms1WhtVvxzk",
    lessonContext: "O usuário estudou a lição sobre altcoins: diferença entre Bitcoin e moedas alternativas, os propósitos de cada uma (Ethereum, Solana, XRP, BNB) e por que existem tantas moedas.",
    chatStarters: [
      "Vale mais a pena comprar Bitcoin ou uma altcoin menor para lucrar mais?",
      "O que são smart contracts e por que o Ethereum é importante?",
      "Como saber se uma altcoin é legítima ou golpe?",
    ],
    visualBlocks: [
      {
        type: "comparison",
        title: "₿ Bitcoin vs Altcoins",
        left: { bg: "#FFFBEB", icon: "₿", title: "Bitcoin", desc: "Reserva de valor digital. O 'ouro' do cripto — escasso, seguro, amplamente aceito.", textColor: "#78350F" },
        right: { bg: "#EFF6FF", icon: "🌐", title: "Altcoins", desc: "Alternative Coins — todas as outras criptomoedas. Cada uma tenta resolver um problema específico.", textColor: "#1E40AF" },
        summary: "Bitcoin foi o primeiro e ainda é o maior. Altcoins surgiram para fazer coisas que o Bitcoin não foi desenhado para fazer.",
      },
      {
        type: "table",
        title: "🏆 As principais altcoins e seus propósitos",
        headers: ["Moeda", "Propósito", "Destaque"],
        rows: [
          { cells: ["Ethereum (ETH)", "Smart contracts & apps descentralizados", "Mais usado por devs"], highlight: true },
          { cells: ["Solana (SOL)", "Transações ultra-rápidas e baratas", "Rival do Ethereum"] },
          { cells: ["XRP (Ripple)", "Pagamentos internacionais rápidos", "Usado por bancos"] },
          { cells: ["BNB (Binance)", "Pagar taxas na Binance com desconto", "Utilidade na exchange"] },
          { cells: ["ADA (Cardano)", "Blockchain com foco em academia", "Desenvolvimento lento mas sólido"] },
        ],
        note: "Existem mais de 10.000 criptomoedas. A maioria não tem valor real — pesquise antes de investir.",
      },
      {
        type: "pillars",
        title: "⚠️ Por que existem tantas moedas?",
        items: [
          { icon: "🛠️", title: "Resolver problemas diferentes", desc: "Bitcoin é lento para pagamentos do dia a dia. Outras moedas tentam ser mais rápidas ou baratas" },
          { icon: "💰", title: "Especulação", desc: "Muitas são criadas apenas para enriquecer os fundadores. Cuidado com promessas de retorno garantido" },
          { icon: "🔬", title: "Experimento e inovação", desc: "Algumas são laboratórios de novas ideias que podem revolucionar finanças, contratos e identidade digital" },
        ],
      },
    ],
    takeaways: [
      "Altcoin = qualquer criptomoeda que não é Bitcoin",
      "Ethereum (ETH) é o mais importante após o Bitcoin — permite criar aplicativos na blockchain",
      "Cada altcoin tem uma proposta diferente: velocidade, privacidade, pagamentos, etc.",
      "Quanto menor e mais nova a moeda, maior o risco — e a possível recompensa",
    ],
  },
  {
    slug: "exchanges",
    icon: "🏦",
    title: "Como funcionam as exchanges?",
    category: "Fundamentos",
    level: "Iniciante",
    duration: "5 min",
    videoId: "HH1VGHMXPb8",
    lessonContext: "O usuário estudou como funcionam as exchanges de criptomoedas: diferença entre CEX e DEX, como comprar cripto na prática e as principais dicas de segurança.",
    chatStarters: [
      "Qual exchange é mais segura para iniciantes no Brasil?",
      "Devo deixar minha cripto na exchange ou transferir para uma carteira própria?",
      "O que acontece se a exchange for hackeada — perco tudo?",
    ],
    visualBlocks: [
      {
        type: "comparison",
        title: "🏦 CEX vs DEX",
        left: { bg: "#F0FDF4", icon: "🏢", title: "CEX (Centralizada)", desc: "Binance, Coinbase, Mercado Bitcoin. Fácil de usar, suporte, mas você não tem as chaves da carteira.", textColor: "#14532D" },
        right: { bg: "#EFF6FF", icon: "🔄", title: "DEX (Descentralizada)", desc: "Uniswap, PancakeSwap. Você controla tudo, mas é mais complexo. Sem suporte.", textColor: "#1E40AF" },
        summary: "Para iniciantes: comece pela CEX. É mais fácil e segura para aprender. Depois de entender o básico, explore DEX.",
      },
      {
        type: "steps",
        title: "📱 Como comprar na Binance (passo a passo)",
        vertical: true,
        items: [
          { icon: "📝", label: "Crie sua conta", sub: "Acesse binance.com → Registrar → E-mail e senha" },
          { icon: "🪪", label: "Verifique sua identidade", sub: "Envie RG/CNH e selfie (KYC — obrigatório por lei)" },
          { icon: "💳", label: "Deposite reais (BRL)", sub: "PIX, TED ou cartão de crédito" },
          { icon: "🔍", label: "Busque a moeda", sub: "Pesquise BTC, ETH, etc. na aba Mercado" },
          { icon: "✅", label: "Compre", sub: "Escolha o valor em reais e confirme" },
        ],
        note: "A primeira compra pode levar até 24h para liberar enquanto o depósito é confirmado.",
      },
      {
        type: "pillars",
        title: "🔒 Segurança essencial",
        items: [
          { icon: "🔐", title: "Ative o 2FA", desc: "Autenticação em dois fatores. Use Google Authenticator, nunca SMS — SIM swap é um golpe comum" },
          { icon: "📧", title: "E-mail exclusivo", desc: "Use um e-mail que você nunca usa em outros lugares para sua conta de exchange" },
          { icon: "📵", title: "Cuidado com phishing", desc: "A Binance nunca te contata por Telegram ou WhatsApp pedindo dados ou senhas" },
        ],
      },
    ],
    takeaways: [
      "Exchange é onde você compra, vende e troca criptomoedas",
      "CEX (centralizada) é mais fácil para iniciantes — Binance, Coinbase, Mercado Bitcoin",
      "Ative sempre o 2FA — é a proteção mais importante da sua conta",
      "Quem guarda as chaves da carteira tem o controle real das moedas",
    ],
  },

  // ── LENDO O MERCADO ──────────────────────────────────────────────────────
  {
    slug: "market-cap",
    icon: "📊",
    title: "O que é Market Cap?",
    category: "Lendo o Mercado",
    level: "Iniciante",
    duration: "4 min",
    videoId: "3cDi64fkZHM",
    lessonContext: "O usuário estudou market cap: fórmula (preço × oferta), por que market cap importa mais que o preço unitário e as categorias de moedas por tamanho de capitalização.",
    chatStarters: [
      "Uma moeda barata tem mais potencial de crescimento que uma cara?",
      "O que é dominância do Bitcoin e como ela afeta o mercado?",
      "Qual o market cap total do mercado cripto hoje?",
    ],
    visualBlocks: [
      {
        type: "explanation",
        title: "📐 A fórmula simples",
        text: "Market Cap = Preço × Quantidade total em circulação",
        items: [
          { icon: "🪙", text: "Moeda A: custa R$1.000 × 1.000 moedas = Market Cap de R$1.000.000" },
          { icon: "🪙", text: "Moeda B: custa R$0,01 × 1 bilhão de moedas = Market Cap de R$10.000.000" },
          { icon: "💡", text: "A Moeda B é 10x MAIOR que a Moeda A, mesmo custando quase nada por unidade" },
        ],
      },
      {
        type: "comparison",
        title: "⚖️ Preço da moeda ≠ Tamanho da moeda",
        left: { bg: "#FFFBEB", icon: "💰", title: "Armadilha do preço", desc: "\"Esta moeda custa R$0,001 — é barata! Vai chegar a R$1 facilmente!\" Errado: depende do supply total.", textColor: "#78350F" },
        right: { bg: "#F0FDF4", icon: "📊", title: "O que realmente importa", desc: "Market Cap mostra o tamanho real da moeda no mercado. Preço baixo + bilhões de moedas = moeda grande.", textColor: "#14532D" },
        summary: "Não se deixe enganar pelo preço unitário. Sempre verifique o market cap antes de comprar.",
      },
      {
        type: "scale",
        title: "🏷️ Categorias por Market Cap",
        items: [
          { range: "Large Cap", label: "> $10 bilhões", color: "#10B981", desc: "BTC, ETH, SOL — mais estáveis, menos risco, menor potencial de multiplicar rápido" },
          { range: "Mid Cap", label: "$1B–$10B", color: "#F59E0B", desc: "Risco moderado, potencial moderado. Projetos com alguma base sólida" },
          { range: "Small Cap", label: "< $1 bilhão", color: "#EF4444", desc: "Alto risco, alto potencial. Podem 10x ou ir a zero. Só com capital que você topa perder" },
        ],
        note: "Bitcoin e Ethereum são Large Cap — os mais seguros do mercado cripto, mas ainda muito mais voláteis que ações tradicionais.",
      },
    ],
    takeaways: [
      "Market Cap = preço × quantidade total de moedas em circulação",
      "Market cap mede o tamanho real de uma moeda, não o preço unitário",
      "Uma moeda com preço baixo pode ter market cap enorme — e vice-versa",
      "Large cap (BTC, ETH) = mais segurança. Small cap = mais risco e potencial",
    ],
  },
  {
    slug: "fear-greed",
    icon: "📉",
    title: "Fear & Greed Index",
    category: "Lendo o Mercado",
    level: "Iniciante",
    duration: "5 min",
    videoId: "uNhlSdI2E4k",
    lessonContext: "O usuário estudou o Fear & Greed Index: o que é, como é calculado (volatilidade, volume, redes sociais, dominância, tendências), o que cada faixa significa e como usar na prática.",
    chatStarters: [
      "Se o índice está em medo extremo, devo comprar agora?",
      "O Fear & Greed Index é confiável ou posso ignorá-lo?",
      "Como o sentimento das redes sociais afeta o preço do Bitcoin?",
    ],
    visualBlocks: [
      {
        type: "scale",
        title: "🌡️ A escala do sentimento",
        items: [
          { range: "0–24", label: "Medo Extremo", color: "#EF4444", desc: "Investidores em pânico. Historicamente bom momento para analisar compras, mas há razão para o medo." },
          { range: "25–49", label: "Medo", color: "#F59E0B", desc: "Cautela predomina. Mercado recuando. Bom para estudar sem tomar decisões apressadas." },
          { range: "50–74", label: "Ganância", color: "#84CC16", desc: "Confiança crescente. Mercado em alta. Cuidado com entrar tarde demais." },
          { range: "75–100", label: "Ganância Extrema", color: "#10B981", desc: "Euforia. Todo mundo quer comprar. Historicamente sinal de correção próxima." },
        ],
        note: "Warren Buffett dizia: \"Seja ganancioso quando outros têm medo, e tenha medo quando outros são gananciosos.\"",
      },
      {
        type: "pillars",
        title: "🔬 O que forma o índice?",
        items: [
          { icon: "📈", title: "Volatilidade (25%)", desc: "Comparação da volatilidade atual com a média dos últimos 30 e 90 dias" },
          { icon: "📊", title: "Volume de negociação (25%)", desc: "Alto volume em alta = ganância. Alto volume em queda = medo" },
          { icon: "📱", title: "Redes sociais (15%)", desc: "Quantidade de posts e engajamento sobre Bitcoin no Twitter/Reddit" },
          { icon: "₿", title: "Dominância do BTC (10%)", desc: "Quando BTC domina mais, investidores fogem do risco das altcoins" },
        ],
      },
      {
        type: "steps",
        title: "🎯 Como usar na prática",
        vertical: true,
        items: [
          { icon: "👀", label: "Observe, não aja sozinho", sub: "O índice é um dado entre muitos — nunca o único critério de compra" },
          { icon: "🔴", label: "Medo extremo (0–24)", sub: "Pesquise o motivo. Se for pânico irracional, pode ser oportunidade" },
          { icon: "🟡", label: "Ganância extrema (75–100)", sub: "Cuidado ao comprar. Muita gente já está dentro — lucros podem ser realizados" },
          { icon: "📅", label: "Combine com DCA", sub: "Comprar um pouco a cada mês independente do índice é mais seguro que tentar acertar o timing" },
        ],
      },
    ],
    takeaways: [
      "O Fear & Greed Index mede o sentimento do mercado de 0 (medo extremo) a 100 (ganância extrema)",
      "Medo extremo pode ser oportunidade; ganância extrema é sinal de cautela",
      "O índice é calculado com volatilidade, volume, redes sociais e dominância do BTC",
      "Nunca tome decisões baseado só nele — é uma peça do quebra-cabeça",
    ],
  },
  {
    slug: "volume",
    icon: "💧",
    title: "Volume de Negociação",
    category: "Lendo o Mercado",
    level: "Iniciante",
    duration: "4 min",
    videoId: "B3TxpR2CDtE",
    lessonContext: "O usuário estudou volume de negociação em cripto: o que é, por que importa, como interpretar volume alto/baixo em relação ao movimento de preços.",
    chatStarters: [
      "Onde vejo o volume de negociação de uma moeda?",
      "Uma moeda com volume baixo é sempre ruim?",
      "O que é volume anômalo e por que devo prestar atenção?",
    ],
    visualBlocks: [
      {
        type: "explanation",
        title: "💧 O que é volume?",
        text: "Volume é o total de dinheiro negociado em uma moeda nas últimas 24 horas. É a medida de interesse do mercado naquele momento.",
        items: [
          { icon: "📊", text: "BTC com volume de $30B = muito interesse, mercado ativo e líquido" },
          { icon: "📉", text: "Altcoin com volume de $50k = pouco interesse, difícil comprar ou vender sem mover o preço" },
          { icon: "💡", text: "Volume alto = fácil de entrar e sair. Volume baixo = armadilha de liquidez" },
        ],
      },
      {
        type: "comparison",
        title: "📈 Alta com volume alto vs. Alta com volume baixo",
        left: { bg: "#F0FDF4", icon: "✅", title: "Alta + Volume alto", desc: "Muita gente está comprando. O movimento é real e tem força. Tendência tem mais chance de continuar.", textColor: "#14532D" },
        right: { bg: "#FFF7ED", icon: "⚠️", title: "Alta + Volume baixo", desc: "Poucos comprando. O preço sobe artificialmente. Pode ser manipulação. Movimento frágil.", textColor: "#7C2D12" },
        summary: "Volume é a confirmação do movimento. Sem volume, uma alta ou queda não tem sustentação.",
      },
      {
        type: "pillars",
        title: "📏 Regras básicas do volume",
        items: [
          { icon: "🟢", title: "Alta + volume crescente", desc: "Tendência de alta sólida — compradores no controle" },
          { icon: "🔴", title: "Queda + volume crescente", desc: "Tendência de queda sólida — vendedores no controle" },
          { icon: "⚠️", title: "Volume anômalo repentino", desc: "Spike de volume sem notícia pode ser whale movendo mercado — fique atento" },
          { icon: "😴", title: "Volume baixo prolongado", desc: "Mercado lateral. Sem tendência definida. Melhor esperar um sinal claro" },
        ],
      },
    ],
    takeaways: [
      "Volume é o total de dinheiro negociado em 24 horas — mede o interesse do mercado",
      "Alta com alto volume = movimento real e sustentável",
      "Alta com baixo volume = movimento fraco, possível manipulação",
      "Moedas com volume muito baixo são perigosas — difícil vender na hora que precisa",
    ],
  },
  {
    slug: "whales",
    icon: "🐋",
    title: "O que são Whales?",
    category: "Lendo o Mercado",
    level: "Intermediário",
    duration: "5 min",
    videoId: "eZq7XecZe14",
    lessonContext: "O usuário estudou whales (baleias): quem são os grandes investidores de cripto, como eles influenciam os preços, como identificar movimentos de whale e como um iniciante pode se proteger.",
    chatStarters: [
      "Como rastrear movimentos de whales em tempo real?",
      "O que é um 'dump' de whale e como ele afeta o preço?",
      "Quantos Bitcoin preciso ter para ser considerado uma whale?",
    ],
    visualBlocks: [
      {
        type: "explanation",
        title: "🐋 Quem são as whales?",
        text: "Whales (baleias) são entidades com quantidades enormes de criptomoeda — suficiente para mover o preço sozinhas quando compram ou vendem.",
        items: [
          { icon: "₿", text: "Bitcoin whale: acima de 1.000 BTC (~$100M) em uma única carteira" },
          { icon: "🏢", text: "Exemplos: exchanges (Binance, Coinbase), ETFs de cripto (BlackRock), governos (EUA tem ~200k BTC apreendidos)" },
          { icon: "👤", text: "Pessoas físicas também: Satoshi Nakamoto tem ~1M de BTC que nunca moveu" },
        ],
      },
      {
        type: "steps",
        title: "📉 Como whales movem o mercado",
        vertical: true,
        items: [
          { icon: "🟢", label: "Whale quer comprar barato", sub: "Vende grande volume → preço cai → pequenos investidores entram em pânico e vendem" },
          { icon: "📉", label: "Preço despenca", sub: "Medo geral — o mercado parece estar \"quebrando\"" },
          { icon: "🛒", label: "Whale compra tudo barato", sub: "Acumula no fundo sem que ninguém perceba (OTC — fora das exchanges)" },
          { icon: "🚀", label: "Preço sobe com demanda", sub: "Agora a whale possui mais e o preço volta — quem vendeu com medo perdeu" },
        ],
        note: "Este padrão se chama \"stop hunt\" — busca dos stops dos pequenos traders.",
      },
      {
        type: "pillars",
        title: "🛡️ Como se proteger",
        items: [
          { icon: "📅", title: "DCA protege de manipulação", desc: "Comprar regularmente em vez de tentar acertar o timing elimina o risco de cair em armadilhas de whale" },
          { icon: "🔍", title: "Monitore on-chain", desc: "Sites como Whale Alert e Glassnode mostram grandes movimentos de carteiras em tempo real" },
          { icon: "😌", title: "Não venda no pânico", desc: "A maioria dos 'crashes' de whale dura horas, não dias. Manter a calma é a melhor defesa" },
        ],
      },
    ],
    takeaways: [
      "Whales são investidores com cripto suficiente para mover o preço sozinhos",
      "Eles frequentemente criam pânico artificial para comprar barato",
      "DCA e investimento de longo prazo são as melhores defesas contra manipulação",
      "Sites como Whale Alert permitem monitorar grandes movimentos on-chain",
    ],
  },

  // ── ANÁLISE TÉCNICA ──────────────────────────────────────────────────────
  {
    slug: "candlestick",
    icon: "🕯️",
    title: "Gráficos de Candlestick",
    category: "Análise Técnica",
    level: "Intermediário",
    duration: "6 min",
    videoId: "bZ6kRyxmfLs",
    lessonContext: "O usuário estudou candlesticks: anatomia de uma vela (corpo, sombra, cor), como ler o que aconteceu em um período e os padrões básicos (doji, hammer, engulfing).",
    chatStarters: [
      "O que é um doji e o que ele significa para o mercado?",
      "Qual a diferença entre candlestick de 1 hora e de 1 dia?",
      "Como identificar um padrão de reversão confiável?",
    ],
    visualBlocks: [
      {
        type: "explanation",
        title: "🕯️ Anatomia de uma vela",
        text: "Cada candlestick representa um período (1 min, 1h, 1 dia) e conta a história da batalha entre compradores e vendedores.",
        items: [
          { icon: "🟢", text: "Vela verde (alta): preço FECHOU mais alto que abriu. Compradores venceram." },
          { icon: "🔴", text: "Vela vermelha (baixa): preço FECHOU mais baixo que abriu. Vendedores venceram." },
          { icon: "📏", text: "Corpo = diferença entre abertura e fechamento. Sombra = máxima e mínima do período." },
        ],
      },
      {
        type: "facts",
        title: "📐 As 4 partes de uma vela",
        items: [
          { value: "Abertura", label: "Preço quando o período começou", icon: "🟡" },
          { value: "Fechamento", label: "Preço quando o período terminou", icon: "🔵" },
          { value: "Máxima", label: "Preço mais alto atingido", icon: "⬆️" },
          { value: "Mínima", label: "Preço mais baixo atingido", icon: "⬇️" },
        ],
      },
      {
        type: "table",
        title: "📋 Padrões básicos que você deve conhecer",
        headers: ["Padrão", "Aparência", "Sinal"],
        rows: [
          { cells: ["Doji", "Corpo tiny, sombras longas", "Indecisão — possível reversão"], highlight: false },
          { cells: ["Hammer", "Corpo pequeno, sombra inferior longa", "Possível fundo — compradores reagiram"], highlight: true },
          { cells: ["Engulfing alta", "Vela verde cobre a vermelha anterior", "Reversão para alta — forte sinal"], highlight: false },
          { cells: ["Engulfing baixa", "Vela vermelha cobre a verde anterior", "Reversão para baixa — sinal de cuidado"], highlight: false },
        ],
        note: "Padrões de candlestick são probabilísticos, não certezas. Sempre confirme com outros indicadores.",
      },
    ],
    takeaways: [
      "Cada candle mostra abertura, fechamento, máxima e mínima de um período",
      "Verde = compradores venceram; Vermelho = vendedores venceram",
      "Corpo grande = movimento forte; Sombras longas = indecisão",
      "Padrões como hammer e engulfing indicam possíveis reversões de tendência",
    ],
  },
  {
    slug: "rsi",
    icon: "📏",
    title: "RSI — Índice de Força Relativa",
    category: "Análise Técnica",
    level: "Intermediário",
    duration: "6 min",
    videoId: "LpjeKHLr5Qg",
    lessonContext: "O usuário estudou RSI: o que é, a escala de 0 a 100, o que significa estar acima de 70 (sobrecomprado) ou abaixo de 30 (sobrevendido), e como usar na prática.",
    chatStarters: [
      "O RSI em 80 significa que devo vender imediatamente?",
      "Qual o período de RSI ideal para cripto — 14, 7 ou outro?",
      "O que é divergência de RSI e por que é importante?",
    ],
    visualBlocks: [
      {
        type: "explanation",
        title: "📏 O que é RSI?",
        text: "RSI (Relative Strength Index) mede a velocidade e magnitude das variações de preço. Oscila de 0 a 100 e indica se uma moeda está sobrecomprada ou sobrevendida.",
        items: [
          { icon: "🧮", text: "É calculado comparando ganhos médios vs. perdas médias dos últimos 14 períodos" },
          { icon: "📊", text: "Aparece como uma linha abaixo do gráfico de preços, entre 0 e 100" },
          { icon: "💡", text: "Criado por J. Welles Wilder em 1978 — usado em ações, câmbio e cripto" },
        ],
      },
      {
        type: "scale",
        title: "🌡️ Interpretando o RSI",
        items: [
          { range: "0–30", label: "Sobrevendido", color: "#10B981", desc: "A moeda caiu demais e rápido. Pode estar barata. Possível oportunidade de compra — mas confirme com outros sinais." },
          { range: "30–70", label: "Zona Neutra", color: "#6B7280", desc: "Mercado equilibrado. Sem sinal claro. Aguarde o RSI atingir zonas extremas." },
          { range: "70–100", label: "Sobrecomprado", color: "#EF4444", desc: "A moeda subiu demais e rápido. Pode estar cara. Possível sinal de correção — cuidado ao comprar no topo." },
        ],
        note: "Em bull markets (mercado em alta), RSI pode ficar acima de 70 por semanas. Não venda só porque chegou em 70.",
      },
      {
        type: "steps",
        title: "🎯 Como usar na prática",
        vertical: true,
        items: [
          { icon: "👀", label: "RSI abaixo de 30", sub: "Pesquise o porquê da queda. Se não há notícia ruim, considere posição pequena" },
          { icon: "⏳", label: "Espere confirmação", sub: "RSI saindo de 30 para cima com vela verde = sinal mais confiável" },
          { icon: "🚫", label: "Nunca use RSI sozinho", sub: "Combine com volume, tendência geral e notícias do mercado" },
          { icon: "📅", label: "Timeframe importa", sub: "RSI de 1 dia é mais confiável que RSI de 5 minutos para iniciantes" },
        ],
      },
    ],
    takeaways: [
      "RSI mede se uma moeda está sobrecomprada (>70) ou sobrevendida (<30)",
      "Abaixo de 30 = possível oportunidade; acima de 70 = cautela",
      "Use RSI de 14 períodos no gráfico diário para mais confiabilidade",
      "Nunca tome decisões baseado só no RSI — combine com outros indicadores",
    ],
  },
  {
    slug: "suporte-resistencia",
    icon: "↔️",
    title: "Suporte e Resistência",
    category: "Análise Técnica",
    level: "Intermediário",
    duration: "5 min",
    videoId: "BsHMYkoT9Hw",
    lessonContext: "O usuário estudou suporte e resistência: o que são, como o preço reage a esses níveis, como identificar no gráfico e por que funcionam psicologicamente.",
    chatStarters: [
      "Como traçar uma linha de suporte no gráfico?",
      "O que acontece quando o preço rompe um suporte importante?",
      "Qual a diferença entre suporte dinâmico e estático?",
    ],
    visualBlocks: [
      {
        type: "comparison",
        title: "📏 Suporte vs. Resistência",
        left: { bg: "#F0FDF4", icon: "🛡️", title: "Suporte (piso)", desc: "Nível onde compradores aparecem com força. O preço 'bate no chão' e tende a subir.", textColor: "#14532D" },
        right: { bg: "#FFF1F2", icon: "🧱", title: "Resistência (teto)", desc: "Nível onde vendedores aparecem com força. O preço 'bate no teto' e tende a cair.", textColor: "#881337" },
        summary: "Quando um suporte é quebrado, ele vira resistência. Quando uma resistência é quebrada, ela vira suporte. Isso se chama inversão de polaridade.",
      },
      {
        type: "steps",
        title: "🔍 Como identificar esses níveis",
        vertical: true,
        items: [
          { icon: "🕯️", label: "Abra o gráfico diário", sub: "Timeframes maiores = níveis mais importantes e confiáveis" },
          { icon: "👁️", label: "Procure toques múltiplos", sub: "Se o preço voltou ao mesmo nível 3+ vezes, é um suporte/resistência forte" },
          { icon: "📐", label: "Trace a linha horizontal", sub: "Marque o nível onde o preço claramente parou e inverteu" },
          { icon: "📊", label: "Confirme com volume", sub: "Volume alto nos toques = nível mais forte e respeitado pelo mercado" },
        ],
      },
      {
        type: "pillars",
        title: "🧠 Por que funcionam?",
        items: [
          { icon: "💭", title: "Memória do mercado", desc: "Traders lembram onde o preço reagiu antes. Quanto mais toques, mais \"memória\" o nível tem" },
          { icon: "📋", title: "Ordens acumuladas", desc: "Grandes compradores colocam ordens nesses níveis. Quando o preço chega, as ordens são ativadas" },
          { icon: "🔄", title: "Profecia autorrealizável", desc: "Todos olham os mesmos gráficos. Quando todos colocam stop no mesmo lugar, o nível se torna real" },
        ],
      },
    ],
    takeaways: [
      "Suporte = piso onde compradores reagem. Resistência = teto onde vendedores reagem",
      "Quanto mais vezes o preço testou um nível, mais forte ele é",
      "Nível quebrado inverte papel: suporte rompido vira resistência e vice-versa",
      "Combine S/R com volume e candlestick para sinais mais confiáveis",
    ],
  },
  {
    slug: "medias-moveis",
    icon: "〰️",
    title: "Médias Móveis",
    category: "Análise Técnica",
    level: "Intermediário",
    duration: "5 min",
    videoId: "tmyb1lhEMEY",
    lessonContext: "O usuário estudou médias móveis: o que são SMA e EMA, como suavizam o ruído do preço, os períodos mais comuns (20, 50, 200) e os padrões Golden Cross e Death Cross.",
    chatStarters: [
      "Qual a diferença entre SMA e EMA na prática?",
      "O que é o Golden Cross de Bitcoin e por que é famoso?",
      "Médias móveis funcionam bem para cripto ou só para ações?",
    ],
    visualBlocks: [
      {
        type: "comparison",
        title: "〰️ SMA vs. EMA",
        left: { bg: "var(--surface-2)", icon: "📐", title: "SMA (Simples)", desc: "Média aritmética dos últimos N preços. Reage mais devagar. Boa para ver tendências longas.", textColor: "var(--text-primary)" },
        right: { bg: "#EFF6FF", icon: "⚡", title: "EMA (Exponencial)", desc: "Dá mais peso aos preços recentes. Reage mais rápido a mudanças. Preferida em cripto.", textColor: "#1E40AF" },
        summary: "Para cripto (mercado volátil e rápido), a EMA é mais usada. Para investimentos de longo prazo, a SMA ajuda a ver a tendência geral.",
      },
      {
        type: "facts",
        title: "📏 Períodos mais importantes",
        items: [
          { value: "MA 20", label: "Tendência de curto prazo (~1 mês)", icon: "🟢" },
          { value: "MA 50", label: "Tendência de médio prazo (~2 meses)", icon: "🟡" },
          { value: "MA 200", label: "Tendência de longo prazo (~9 meses)", icon: "🔴" },
          { value: "MA 9", label: "Muito curto — usado em day trade", icon: "⚡" },
        ],
        note: "A MA200 diária é a mais importante. Acima dela = mercado de alta. Abaixo = mercado de baixa.",
      },
      {
        type: "steps",
        title: "⚔️ Golden Cross e Death Cross",
        vertical: true,
        items: [
          { icon: "🟡", label: "Golden Cross", sub: "MA50 cruza para CIMA da MA200 → sinal histórico de bull market. Bitcoin já teve vários." },
          { icon: "💀", label: "Death Cross", sub: "MA50 cruza para BAIXO da MA200 → sinal de tendência de baixa. Precede bear markets." },
          { icon: "⚠️", label: "Lagging indicator", sub: "Médias móveis confirmam o que aconteceu — não preveem. São mais úteis para confirmar tendências." },
        ],
      },
    ],
    takeaways: [
      "Médias móveis suavizam o ruído do preço e mostram a tendência",
      "SMA = média simples; EMA = dá mais peso aos preços recentes (mais rápida)",
      "MA200 é a linha mais importante: acima = bull market, abaixo = bear market",
      "Golden Cross (MA50 > MA200) = sinal de alta; Death Cross = sinal de baixa",
    ],
  },

  // ── ESTRATÉGIA ───────────────────────────────────────────────────────────
  {
    slug: "dca",
    icon: "🗓️",
    title: "DCA — Compra Gradual",
    category: "Estratégia",
    level: "Iniciante",
    duration: "4 min",
    videoId: "fLR_RgdPh6c",
    lessonContext: "O usuário estudou DCA (Dollar Cost Averaging): o que é, como funciona na prática, vantagens em mercados voláteis e por que é recomendado para iniciantes.",
    chatStarters: [
      "Com quanto devo começar a fazer DCA em Bitcoin?",
      "Faz sentido fazer DCA em altcoins ou só em BTC e ETH?",
      "Se o mercado estiver caindo muito, devo parar o DCA?",
    ],
    visualBlocks: [
      {
        type: "explanation",
        title: "🗓️ O que é DCA?",
        text: "DCA (Dollar Cost Averaging = Preço Médio em Dólares) é comprar um valor fixo de cripto regularmente — toda semana ou todo mês — independentemente do preço.",
        items: [
          { icon: "📅", text: "Ex: Comprar R$100 de Bitcoin todo dia 1º do mês, custe o que custar" },
          { icon: "📉", text: "Mês em alta? Compra menos Bitcoin. Mês em queda? Compra mais Bitcoin pelo mesmo R$100" },
          { icon: "🎯", text: "Com o tempo, seu preço médio de compra se equilibra — você nunca compra só no topo" },
        ],
      },
      {
        type: "comparison",
        title: "⚖️ Investir tudo de uma vez vs. DCA",
        left: { bg: "#FFF7ED", icon: "💸", title: "Lump Sum (tudo de uma vez)", desc: "Investe R$1.200 em janeiro. Se cair logo depois, seu prejuízo é imediato e psicologicamente difícil de aguentar.", textColor: "#7C2D12" },
        right: { bg: "#F0FDF4", icon: "🗓️", title: "DCA (R$100/mês)", desc: "Investe R$100 por mês. Nas quedas, compra mais barato. Nas altas, compra menos. O estresse emocional é muito menor.", textColor: "#14532D" },
        summary: "DCA não maximiza ganhos — mas minimiza perdas e erros emocionais. Para iniciantes, é a estratégia mais segura.",
      },
      {
        type: "pillars",
        title: "✅ Por que DCA funciona para iniciantes",
        items: [
          { icon: "🧘", title: "Elimina o timing", desc: "Você não precisa saber quando o mercado vai subir ou cair — isso é impossível até para profissionais" },
          { icon: "😌", title: "Reduz estresse emocional", desc: "Comprar regularmente vira hábito automático. Menos ansiedade, menos decisões impulsivas" },
          { icon: "📈", title: "Funciona em mercados de alta", desc: "Bitcoin e Ethereum têm histórico de subida no longo prazo. DCA captura essa tendência" },
        ],
      },
    ],
    takeaways: [
      "DCA = comprar um valor fixo de cripto regularmente, independente do preço",
      "Nas quedas você compra mais, nas altas você compra menos — equilíbra o preço médio",
      "Elimina a necessidade de adivinhar o melhor momento para comprar",
      "É a estratégia mais recomendada para quem está começando",
    ],
  },
  {
    slug: "gestao-risco",
    icon: "🛡️",
    title: "Gestão de Risco",
    category: "Estratégia",
    level: "Iniciante",
    duration: "5 min",
    videoId: "vvcyRs5Or6I",
    lessonContext: "O usuário estudou gestão de risco em cripto: quanto investir, o que é stop-loss, como proteger o capital e os principais erros que iniciantes cometem.",
    chatStarters: [
      "Qual porcentagem da minha renda posso investir em cripto?",
      "Como configurar um stop-loss na Binance?",
      "O que fazer quando meu portfólio está caindo muito?",
    ],
    visualBlocks: [
      {
        type: "facts",
        title: "📏 As regras de ouro",
        items: [
          { value: "Máx 5–10%", label: "do seu patrimônio total em cripto", icon: "💰" },
          { value: "Nunca", label: "invista o que não pode perder", icon: "🚫" },
          { value: "1 moeda", label: "máx 30–40% do portfólio cripto", icon: "🎯" },
          { value: "Stop-loss", label: "antes de entrar em qualquer trade", icon: "🛑" },
        ],
        note: "Cripto é um ativo de alto risco. Até Bitcoin já caiu 80% em bear markets anteriores.",
      },
      {
        type: "explanation",
        title: "🛑 O que é Stop-Loss?",
        text: "Stop-loss é uma ordem automática que vende sua moeda se o preço cair até um nível que você definiu. É sua rede de segurança.",
        items: [
          { icon: "📌", text: "Ex: Comprei BTC a $40.000. Coloco stop-loss em $36.000 (queda de 10%)." },
          { icon: "🤖", text: "Se o preço cair a $36.000, a exchange vende automaticamente — sem eu precisar agir" },
          { icon: "💡", text: "Evita a situação de \"vou esperar subir\" enquanto a moeda cai 50% ou mais" },
        ],
      },
      {
        type: "pillars",
        title: "⚠️ Erros comuns de iniciantes",
        items: [
          { icon: "💎", title: "\"Diamond hands\" sem critério", desc: "Segurar uma moeda que caiu 90% esperando recuperar. Às vezes ela não volta nunca mais." },
          { icon: "🃏", title: "All-in em uma só moeda", desc: "Concentrar tudo em um único ativo é o maior erro de gestão de risco. Diversifique sempre." },
          { icon: "💳", title: "Investir com dívida", desc: "Nunca use cartão de crédito, empréstimo ou dinheiro de emergência para comprar cripto." },
          { icon: "📵", title: "Ignorar stop-loss", desc: "\"Vou ver como fica.\" É como dirigir sem cinto — OK até não ser mais." },
        ],
      },
    ],
    takeaways: [
      "Invista apenas o que você pode perder totalmente — isso é regra, não sugestão",
      "Nunca coloque mais de 30–40% do seu portfólio cripto em uma única moeda",
      "Stop-loss é obrigatório em trades — define o pior cenário aceitável antes de entrar",
      "Diversifique: Bitcoin, Ethereum e uma pequena parte em altcoins selecionadas",
    ],
  },
  {
    slug: "diversificacao",
    icon: "🎯",
    title: "Diversificação em Cripto",
    category: "Estratégia",
    level: "Iniciante",
    duration: "4 min",
    videoId: "JHuQ-0KUdv0",
    lessonContext: "O usuário estudou diversificação em cripto: por que não colocar tudo em uma moeda, como distribuir entre categorias (large, mid, small cap) e qual alocação faz sentido para iniciantes.",
    chatStarters: [
      "Qual a proporção ideal entre Bitcoin, Ethereum e altcoins?",
      "Vale a pena colocar parte em stablecoins para proteger?",
      "Quantas moedas diferentes devo ter no portfólio?",
    ],
    visualBlocks: [
      {
        type: "explanation",
        title: "🎯 Por que diversificar?",
        text: "Diversificação significa não colocar todos os ovos em um único cesto. Em cripto, significa distribuir entre diferentes moedas e categorias.",
        items: [
          { icon: "💥", text: "Em 2022, LUNA ($40B em market cap) foi a zero em 72 horas. Quem tinha 100% perdeu tudo." },
          { icon: "🛡️", text: "Quem tinha LUNA como 10% do portfólio perdeu 10%. O restante sobreviveu." },
          { icon: "📊", text: "Diversificar não elimina risco — reduz o impacto de qualquer moeda específica indo mal." },
        ],
      },
      {
        type: "facts",
        title: "📐 Alocação sugerida para iniciantes",
        items: [
          { value: "50–60%", label: "Bitcoin (BTC) — mais seguro", icon: "₿" },
          { value: "20–30%", label: "Ethereum (ETH) — segunda maior", icon: "Ξ" },
          { value: "10–20%", label: "Large caps (SOL, BNB, XRP)", icon: "🏆" },
          { value: "0–10%", label: "Small caps — apenas capital de risco", icon: "⚠️" },
        ],
        note: "Stablecoins (USDT, USDC) podem guardar parte da reserva em queda de mercado. Não rendem mas protegem.",
      },
      {
        type: "pillars",
        title: "🧠 Princípios da diversificação cripto",
        items: [
          { icon: "🎯", title: "Menos é mais", desc: "Melhor ter 3–5 moedas que você entende do que 20 que não acompanha" },
          { icon: "📅", title: "Rebalanceie periodicamente", desc: "A cada 3–6 meses, ajuste as proporções. Se BTC subiu muito, ele ocupa mais espaço — considere realocar" },
          { icon: "🚫", title: "Evite shitcoins como diversificação", desc: "Ter 10 moedas desconhecidas não é diversificação — é 10 apostas de alto risco" },
        ],
      },
    ],
    takeaways: [
      "Nunca concentre mais de 40% do portfólio cripto em uma única moeda",
      "Iniciantes: Bitcoin + Ethereum = base sólida (70–90% do portfólio)",
      "Small caps e tokens novos: máximo 10% — só dinheiro que você topa perder tudo",
      "3–5 moedas que você entende é melhor que 20 que você não acompanha",
    ],
  },
  {
    slug: "fomo-fud",
    icon: "😰",
    title: "FOMO e FUD",
    category: "Estratégia",
    level: "Iniciante",
    duration: "4 min",
    videoId: "SfjwQvGKt70",
    lessonContext: "O usuário estudou FOMO e FUD: o que significam, como afetam decisões de investimento, o ciclo emocional do mercado e estratégias para investir de forma mais racional.",
    chatStarters: [
      "Como saber se estou comprando por FOMO ou por análise real?",
      "Quem cria FUD no mercado e por quê?",
      "Qual a melhor estratégia para controlar emoções ao investir?",
    ],
    visualBlocks: [
      {
        type: "comparison",
        title: "😨 FOMO vs. FUD",
        left: { bg: "#FFF7ED", icon: "🚀", title: "FOMO", desc: "Fear Of Missing Out (Medo de Ficar de Fora). Comprar quando já subiu muito com medo de perder a alta. Geralmente termina em perda.", textColor: "#7C2D12" },
        right: { bg: "#FFF1F2", icon: "😱", title: "FUD", desc: "Fear, Uncertainty and Doubt (Medo, Incerteza e Dúvida). Notícias negativas que assustam investidores e derrubam o preço artificialmente.", textColor: "#881337" },
        summary: "FOMO te faz comprar no topo. FUD te faz vender no fundo. As duas emoções destroem portfólios.",
      },
      {
        type: "steps",
        title: "🎢 O ciclo emocional do investidor",
        vertical: true,
        items: [
          { icon: "😐", label: "Desinteresse", sub: "Preço baixo, ninguém fala. Melhor momento para estudar e acumular." },
          { icon: "😊", label: "Otimismo", sub: "Começa a subir. Notícias boas. \"Desta vez é diferente!\"" },
          { icon: "🤑", label: "Euforia (FOMO explode)", sub: "Todo mundo quer comprar. Preço no topo. Pior hora para entrar." },
          { icon: "😱", label: "Pânico (FUD domina)", sub: "Correção forte. \"Bitcoin vai zero!\" Iniciantes vendem tudo no fundo." },
          { icon: "😐", label: "Desinteresse novamente", sub: "O ciclo recomeça. Quem aguentou o pânico foi recompensado." },
        ],
        note: "O Bitcoin passou por esse ciclo várias vezes. Cada vez o fundo foi mais alto que o anterior.",
      },
      {
        type: "pillars",
        title: "🧘 Como investir de forma racional",
        items: [
          { icon: "📋", title: "Tenha um plano antes de comprar", desc: "Defina: por que estou comprando, qual meu objetivo e quando vou sair. Anote antes de executar." },
          { icon: "📵", title: "Limite o consumo de notícias", desc: "Checar preço 20 vezes por dia amplifica emoções. Defina horários fixos para verificar o portfólio." },
          { icon: "💬", title: "Cuidado com grupos e influencers", desc: "A maioria dos que \"garantem\" retorno estão sendo pagos para promover a moeda." },
        ],
      },
    ],
    takeaways: [
      "FOMO te faz comprar no topo; FUD te faz vender no fundo — ambos destroem retornos",
      "O mercado cripto segue um ciclo emocional previsível: euforia → pânico → apatia → otimismo",
      "Tenha um plano de investimento por escrito antes de qualquer compra",
      "DCA elimina FOMO — você compra regularmente sem precisar adivinhar o momento certo",
    ],
  },
];

export function getLessonBySlug(slug: string): Lesson | undefined {
  return LESSONS.find((l) => l.slug === slug);
}
