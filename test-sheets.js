const { google } = require('googleapis');

async function testSheets() {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1gcpM5eHCoz2ybXIia5p1fAsSBN1ZtZP3pHLMv2mIa_s';

    console.log('Tentando salvar no Sheets...');
    
    const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Leads!A:F',
      valueInputOption: 'RAW',
      resource: {
        values: [[timestamp, 'Teste Local', 'teste@local.com', '(11) 99999-9999', 'Teste', 'local']],
      },
    });

    console.log('✅ SUCESSO! Lead salvo no Sheets!');
  } catch (error) {
    console.error('❌ ERRO:', error.message);
  }
}

testSheets();
