// Vercel Serverless Function - Salvar Leads Aulão no Google Sheets
const { google } = require('googleapis');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { nome, email, whatsapp, evento, pagina } = req.body;

    if (!nome || !email || !whatsapp) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    // Validar env vars
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      return res.status(500).json({ error: 'Service Account Key não configurada' });
    }

    if (!process.env.AULAO_SPREADSHEET_ID) {
      return res.status(500).json({ error: 'Spreadsheet ID não configurado' });
    }

    // Service Account credentials (via environment variable)
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Spreadsheet ID (será configurado via env var)
    const spreadsheetId = process.env.AULAO_SPREADSHEET_ID;

    // Timestamp
    const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    // Append row
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Leads!A:F',
      valueInputOption: 'RAW',
      resource: {
        values: [[timestamp, nome, email, whatsapp, evento || 'Aulão Letreiros do Futuro', pagina || '']],
      },
    });

    return res.status(200).json({ success: true, message: 'Lead salvo com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar lead:', error);
    return res.status(500).json({ error: 'Erro ao salvar lead', details: error.message });
  }
};
