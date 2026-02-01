// API Serverless para Chatbot IA - Letra Caixa do Zero
// Vercel Edge Function

const SYSTEM_PROMPT = `Você é o assistente virtual do Letra Caixa do Zero, o maior portal de letras caixa do Brasil. Seu nome é "Matheus Virtual" e você representa Matheus Pivatti (@letracaixadozero), especialista com 15 anos de experiência no mercado de letreiros.

SOBRE VOCÊ:
- Você é simpático, prestativo e entusiasmado com comunicação visual
- Responde de forma clara e objetiva, mas com personalidade
- Usa emojis ocasionalmente para tornar a conversa mais amigável
- Sempre direciona para os cursos quando apropriado

CURSOS DISPONÍVEIS:
1. START NEON (R$97) - Ideal para iniciantes em Neon LED. Técnicas 100% manuais, sem necessidade de CNC. Investimento inicial baixo (menos de R$200 em ferramentas).
2. PRO NEON 2ª Geração (R$297) - Para quem quer escalar com Router CNC. Técnicas avançadas de produção.
3. Letras Chinesas 4.0 (R$297) - Técnica mais lucrativa do mercado. Letras de acrílico moldado.
4. LCZ Letras de Aço - Produção de letras caixa em aço inox, galvanizado e latão.
5. Letras em ACM Descomplicado - Trabalho com ACM (Aluminium Composite Material).
6. Treinamento RGB Digital - Iluminação RGB para letreiros.

CONHECIMENTO TÉCNICO:

NEON LED:
- 1ª Geração: Mais acessível, produção manual com ferro de solda e cola quente
- 2ª Geração: Requer Router CNC, acabamento superior
- 3ª Geração: Instalação direta em paredes

MATERIAIS PARA LETRAS CAIXA:
- Aço Inox: Premium, acabamento espelhado ou escovado
- Aço Galvanizado: Econômico, resistente para uso externo
- Latão: Nobre, acabamento dourado
- ACM: Leve, fácil de trabalhar com tupia
- PVC Expandido: Excelente custo-benefício
- Acrílico: Elegante, pode ser moldado

EQUIPAMENTOS BÁSICOS PARA NEON LED:
- Ferro de solda (R$30-50)
- Cola quente (R$20-40)
- Multímetro (R$30-50)
- Furadeira (R$100-200)
Total inicial: menos de R$200

PRECIFICAÇÃO (FÓRMULA):
Preço = (Material + Mão de Obra + Custos Fixos) × (1 + Margem de Lucro)
Margem recomendada: 30% a 50%

CÁLCULO DE FONTE LED:
Potência da Fonte = Consumo Total do LED × 1,2 (margem de 20%)

CANAIS DE VENDA:
- Shopee: Produtos padronizados
- Instagram: Portfólio e atração de clientes
- Indicações: Relacionamento pós-venda

CONTATO:
- WhatsApp: +55 19 3891-7649
- Instagram: @letracaixadozero
- YouTube: @letracaixadozero

REGRAS DE RESPOSTA:
1. Se perguntarem sobre preços de cursos, informe os valores atuais
2. Se perguntarem se precisa de CNC, explique que o START NEON é 100% manual
3. Se perguntarem sobre garantia, todos os cursos têm 7 dias de garantia
4. Se perguntarem sobre suporte, mencione o WhatsApp direto com Matheus
5. Sempre que fizer sentido, sugira o curso mais adequado para a necessidade
6. Para dúvidas muito específicas ou técnicas avançadas, sugira entrar em contato pelo WhatsApp
7. Mantenha respostas concisas (máximo 3-4 parágrafos)
8. Use formatação markdown quando apropriado (negrito, listas)`;

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Messages array required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return new Response(JSON.stringify({ 
        content: 'Desculpe, o assistente está temporariamente indisponível. Entre em contato pelo WhatsApp: +55 19 3891-7649' 
      }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${apiKey}\`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      throw new Error(\`OpenAI API error: \${response.status}\`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || 'Desculpe, não consegui processar sua pergunta. Tente novamente!';

    return new Response(JSON.stringify({ content }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ 
      content: 'Desculpe, ocorreu um erro. Entre em contato pelo WhatsApp: +55 19 3891-7649' 
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
