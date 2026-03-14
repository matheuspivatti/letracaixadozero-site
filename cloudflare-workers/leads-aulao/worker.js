// Cloudflare Worker - Sistema de Leads Aulão com D1
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // GET = Download CSV
    if (request.method === 'GET') {
      try {
        const { results } = await env.DB.prepare(
          'SELECT * FROM leads ORDER BY timestamp DESC'
        ).all();

        const csv = [
          'Data/Hora,Nome,Email,WhatsApp,Evento,Página',
          ...results.map(r => 
            `"${r.timestamp}","${r.nome}","${r.email}","${r.whatsapp}","${r.evento}","${r.pagina}"`
          )
        ].join('\n');

        return new Response(csv, {
          headers: {
            ...corsHeaders,
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': 'attachment; filename=leads-aulao.csv'
          }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // POST = Salvar lead
    if (request.method === 'POST') {
      try {
        const body = await request.json();
        const { nome, email, whatsapp, evento, pagina } = body;

        if (!nome || !email || !whatsapp) {
          return new Response(JSON.stringify({ error: 'Campos obrigatórios faltando' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

        await env.DB.prepare(
          'INSERT INTO leads (timestamp, nome, email, whatsapp, evento, pagina) VALUES (?, ?, ?, ?, ?, ?)'
        ).bind(timestamp, nome, email, whatsapp, evento || 'Aulão Letreiros do Futuro', pagina || '').run();

        const { results } = await env.DB.prepare('SELECT COUNT(*) as total FROM leads').all();

        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Lead salvo com sucesso!',
          total: results[0].total 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }
};
