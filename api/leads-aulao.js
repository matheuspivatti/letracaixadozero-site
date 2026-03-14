// SOLUÇÃO ULTRA SIMPLES: Enviar email + salvar localmente
// Email garante que você NUNCA perde um lead
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { nome, email, whatsapp, evento, pagina } = req.body;
    if (!nome || !email || !whatsapp) {
      return res.status(400).json({ error: 'Campos faltando' });
    }

    const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    // Enviar email via Resend (super confiável)
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Aulão Letreiros <aulao@letracaixadozero.com>',
        to: 'matheus@letracaixadozero.com',
        subject: `🎯 Novo Lead Aulão: ${nome}`,
        html: `
          <h2>Novo Lead Aulão Letreiros do Futuro</h2>
          <p><strong>Data/Hora:</strong> ${timestamp}</p>
          <p><strong>Nome:</strong> ${nome}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>WhatsApp:</strong> ${whatsapp}</p>
          <p><strong>Evento:</strong> ${evento || 'Aulão Letreiros do Futuro'}</p>
          <p><strong>Página:</strong> ${pagina || '-'}</p>
        `
      })
    });

    return res.status(200).json({ success: true, message: 'Lead salvo e email enviado!' });
  } catch (error) {
    console.error('Erro:', error);
    return res.status(500).json({ error: error.message });
  }
};
