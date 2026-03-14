// Vercel Serverless Function - Salvar Leads Aulão
const { createClient } = require('@vercel/redis');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET = Download CSV
  if (req.method === 'GET') {
    try {
      const redis = createClient({ url: process.env.REDIS_URL });
      const leads = await redis.lrange('aulao:leads', 0, -1);
      redis.disconnect();
      
      if (leads.length === 0) {
        return res.status(200).send('Data/Hora,Nome,Email,WhatsApp,Evento,Página\n');
      }

      const csv = [
        'Data/Hora,Nome,Email,WhatsApp,Evento,Página',
        ...leads.map(lead => {
          const l = JSON.parse(lead);
          return `"${l.timestamp}","${l.nome}","${l.email}","${l.whatsapp}","${l.evento}","${l.pagina}"`;
        })
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename=leads-aulao.csv');
      return res.status(200).send(csv);
    } catch (error) {
      console.error('Erro ao gerar CSV:', error);
      return res.status(500).json({ error: 'Erro ao gerar CSV', details: error.message });
    }
  }

  // POST = Salvar lead
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { nome, email, whatsapp, evento, pagina } = req.body;

    if (!nome || !email || !whatsapp) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    const lead = {
      timestamp,
      nome,
      email,
      whatsapp,
      evento: evento || 'Aulão Letreiros do Futuro',
      pagina: pagina || ''
    };

    // Salvar no Vercel Redis
    const redis = createClient({ url: process.env.REDIS_URL });
    await redis.lpush('aulao:leads', JSON.stringify(lead));
    redis.disconnect();

    return res.status(200).json({ success: true, message: 'Lead salvo com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar lead:', error);
    return res.status(500).json({ error: 'Erro ao salvar lead', details: error.message });
  }
};
