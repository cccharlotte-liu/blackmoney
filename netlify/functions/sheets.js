const SHEET_ID = '1ZL_zadhVJxd_wCw9n2CvSbwfsn-EU-XqoeacHuFkWsc';
const CLIENT_EMAIL = 'blackmoney@smart-caster-503407-n0.iam.gserviceaccount.com';
const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCw+5RA6rxGJwtI
ZAqMheeOkAyTDyvQg+m7qsOaFxa3SEzNtex4ADVkKW2SejH5YbUmDy09rjYdjtXk
zC6nOjyxwRlF3g1jtjNIXJM1RkGruprwhIhXQg/zkcy9siNdIZb9OeKoLlnlPG7S
mkjIWp5HG1iGeVA5/O7EG8yi1JIXAtbzy3LnzTfAfFCjUGOqnIs2WEnXl4J+9QtD
DCvYqwVp2EevdlhN0rsNjqhfhw3MwX43YNnzmHTcVubuslhn8+z9apyyERGLMo8t
C51JBuCvk1YoYFs0dTCGv45c/tdWzrooN3cJMSPrZ59VFMBBL803PLndXvWpmyAu
RzbOuFX7AgMBAAECggEAJ1sSeSsZyenVxvfEJsKCHwAmY69ceWZUHBDZpVLcEM7J
kXcSig7V0Jury4ZTxZZ2L2vxjgVG8GS6aMIE39gB9i8v/QrnZFR4a+92JsMkSFlb
Kf/2x5yfqnSyGD7cQVH+Xvo3zllcUS8Sn8+CPtdz2fEZSvIAJpz5xW8/Hrhxch8n
DIiTR/57Y0h4TWaW0/f+QLTETmMZydvKUAPB6XFmJs6nBd08PVq0CBgmG8vXsK2f
OqpLtlkYPFh3b0ce4d4qeRGKozj9yFQxqyx1ukSKyrOnK1oc1YbEPHXhE8EyV6Av
c5stjSspbOk6tjeClbTu+ZN4hFUNLc3OgkAcVqZ38QKBgQDnBBqA1y9sC17Uu0XY
2PCVjvwBZJi9u0P4a4A+TpbJm2mwkri2Uipv7xyavH1eCfErzVpwx6Fiemb01uEK
zls6pMRonHXb+ERSVs3RcEZFS/l5jofWyJcGBMHh1CNL92e/bXII7AvT45sw82Zm
2KbiVlEnvLoFcbA/3Q81mSnVywKBgQDEH4NG4bpOwUPAFTSirn1qCx5BvHnXtdAl
I/nArAUmxG54ZcjzyXRTd2WxInRiK8iRb7dNzRpF2jWC6+a7IkBXgfkqJ6c5c0/e
yAcz1Yzz5of5DtlLsqhWvDz5DOE78RYjg1SJ43su2MV0jFhkk5tOWL1eyQFzPyns
o47S4fr6kQKBgQDiPVyPTS3+C+ylPXob8ek7LrqRyqjjNuBMC0ueuWxmqLMK38XR
mApDcNJ8n5fPXsE3enbV+EuOm/z0TvQ5lvo1JmPLZ17tO+f9E1GhiOjouIzrhLB3
oh51IHeX6B9hKDwMduy03CaBLmgvuk9Q7WASTSJRXjx3VG2dParFfOhBnQKBgG9o
610fq4NDfGYoZa8oaiwMRtLW62wjZytCBYVy8rY0DgEs6Pu76+3iPI1kYjLGZnhf
uwRiR9N4gr9tnLOfYGeVeOJ+hhs3qx6GCLlkTV7cDU/pJH1A7yneYtCjhWtUp9vi
pepypC5Xi8uKUkhIJYhbFrA6hS1fq0Q3IVIgdz9RAoGBAJa84KxmPZJgD+P+HHL5
I5v2kepCvIH3Gci/la5QQTm6Mq7FaHzHocfpsARPcxIyzz1T0oALfr5AkvpKhD13
xiajEK849hdZN+1GZNX4ryAKTgYgnwFcUWjDppHK4QLaZgCvz+D55MnkaI+aWBRC
2lC++u3ucZmDI2SyMTKvGWUK
-----END PRIVATE KEY-----`;

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// 產生 JWT token
async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: CLIENT_EMAIL,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const encode = obj => btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const signingInput = `${encode(header)}.${encode(payload)}`;

  // Import private key
  const keyData = PRIVATE_KEY.replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\n/g, '');
  const binaryKey = Uint8Array.from(atob(keyData), c => c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8', binaryKey,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false, ['sign']
  );

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5', cryptoKey,
    new TextEncoder().encode(signingInput)
  );

  const jwt = `${signingInput}.${btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')}`;

  const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });
  const tokenData = await tokenResp.json();
  return tokenData.access_token;
}

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  try {
    const token = await getAccessToken();
    const action = event.queryStringParameters?.action || 'read';

    // 讀取資料
    if (action === 'read') {
      const [holdingsResp, tradesResp] = await Promise.all([
        fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent("'持倉'!A2:D")}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent("'交易記錄'!A2:E")}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
      ]);

      const holdingsData = await holdingsResp.json();
      const tradesData = await tradesResp.json();

      const holdings = (holdingsData.values || []).map(row => ({
        cd: row[0] || '',
        name: row[1] || '',
        sh: parseFloat(row[2]) || 0,
        buy: parseFloat(row[3]) || 0,
      })).filter(h => h.cd);

      const trades = (tradesData.values || []).map(row => ({
        dt: row[0] || '',
        cd: row[1] || '',
        tp: row[2] || 'buy',
        sh: parseFloat(row[3]) || 0,
        am: parseFloat(row[4]) || 0,
      })).filter(t => t.cd);

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ success: true, holdings, trades }),
      };
    }

    // 寫入資料
    if (action === 'write') {
      const body = JSON.parse(event.body || '{}');
      const { holdings, trades } = body;

      if (!holdings || !trades) {
        return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ success: false, error: '缺少資料' }) };
      }

      const holdingValues = holdings.map(h => [h.cd || '', h.name || '', h.sh || 0, h.buy || 0]);
      const tradeValues = trades.map(t => [t.dt || '', t.cd || '', t.tp || 'buy', t.sh || 0, t.am || 0]);

      const writeRange = async (sheetName, range, values) => {
        // 中文工作表名稱需加單引號並 encode
        const fullRange = encodeURIComponent(`'${sheetName}'!${range}`);

        // 先清空
        const clearResp = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${fullRange}:clear`,
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
          }
        );
        const clearData = await clearResp.json();
        if (!clearResp.ok) throw new Error(`清空失敗: ${JSON.stringify(clearData)}`);

        // 若有資料則寫入
        if (values.length > 0) {
          const writeResp = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${fullRange}?valueInputOption=RAW`,
            {
              method: 'PUT',
              headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({ range: `'${sheetName}'!${range}`, values }),
            }
          );
          const writeData = await writeResp.json();
          if (!writeResp.ok) throw new Error(`寫入失敗: ${JSON.stringify(writeData)}`);
          return writeData;
        }
        return clearData;
      };

      const [h, t] = await Promise.all([
        writeRange('持倉', 'A2:D1000', holdingValues),
        writeRange('交易記錄', 'A2:E10000', tradeValues),
      ]);

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ success: true, saved: { holdings: holdingValues.length, trades: tradeValues.length } }),
      };
    }

  } catch(err) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
};
