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

const CORS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

async function getToken() {
  const now = Math.floor(Date.now() / 1000);
  const enc = obj => btoa(JSON.stringify(obj)).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
  const input = `${enc({alg:'RS256',typ:'JWT'})}.${enc({
    iss: CLIENT_EMAIL,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600, iat: now,
  })}`;
  const key = PRIVATE_KEY.replace(/-----[^-]+-----/g,'').replace(/\n/g,'');
  const ck = await crypto.subtle.importKey(
    'pkcs8', Uint8Array.from(atob(key), c=>c.charCodeAt(0)),
    { name:'RSASSA-PKCS1-v1_5', hash:'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', ck, new TextEncoder().encode(input));
  const jwt = `${input}.${btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_')}`;
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'},
    body:`grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });
  return (await r.json()).access_token;
}

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return { statusCode:200, headers:CORS, body:'' };

  try {
    const token = await getToken();
    const action = event.queryStringParameters?.action || 'read';
    const base = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}`;
    const auth = { Authorization: `Bearer ${token}` };

    if (action === 'read') {
      const [hr, tr] = await Promise.all([
        fetch(`${base}/values/holdings!A2:D`, { headers: auth }),
        fetch(`${base}/values/trades!A2:E`, { headers: auth }),
      ]);
      const hd = await hr.json();
      const td = await tr.json();

      return { statusCode:200, headers:CORS, body: JSON.stringify({
        success: true,
        holdings: (hd.values||[]).map(r=>({ cd:r[0]||'', name:r[1]||'', sh:parseFloat(r[2])||0, buy:parseFloat(r[3])||0 })).filter(h=>h.cd),
        trades:   (td.values||[]).map(r=>({ dt:r[0]||'', cd:r[1]||'', tp:r[2]||'buy', sh:parseFloat(r[3])||0, am:parseFloat(r[4])||0 })).filter(t=>t.cd),
      })};
    }

    if (action === 'write') {
      const { holdings=[], trades=[] } = JSON.parse(event.body||'{}');

      // 取得 sheetId
      const meta = await (await fetch(`${base}?fields=sheets.properties`, { headers: auth })).json();
      const sheetMap = {};
      (meta.sheets||[]).forEach(s => { sheetMap[s.properties.title] = s.properties.sheetId; });

      const hId = sheetMap['holdings'];
      const tId = sheetMap['trades'];
      if (hId === undefined || tId === undefined) {
        throw new Error(`找不到工作表 holdings/trades，現有：${Object.keys(sheetMap).join(', ')}`);
      }

      // batchUpdate：先清空再寫入
      const makeRows = arr => arr.map(row => ({
        values: row.map(v => typeof v === 'number'
          ? { userEnteredValue: { numberValue: v } }
          : { userEnteredValue: { stringValue: String(v||'') } })
      }));

      const hRows = makeRows(holdings.map(h => [h.cd, h.name, h.sh, h.buy]));
      const tRows = makeRows(trades.map(t => [t.dt, t.cd, t.tp, t.sh, t.am]));

      const requests = [
        // 清空
        { updateCells: { range: { sheetId: hId, startRowIndex: 1 }, fields: 'userEnteredValue' } },
        { updateCells: { range: { sheetId: tId, startRowIndex: 1 }, fields: 'userEnteredValue' } },
      ];

      // 寫入（若有資料）
      if (hRows.length) requests.push({ updateCells: { start: { sheetId: hId, rowIndex: 1, columnIndex: 0 }, rows: hRows, fields: 'userEnteredValue' } });
      if (tRows.length) requests.push({ updateCells: { start: { sheetId: tId, rowIndex: 1, columnIndex: 0 }, rows: tRows, fields: 'userEnteredValue' } });

      const wr = await fetch(`${base}:batchUpdate`, {
        method: 'POST',
        headers: { ...auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({ requests }),
      });
      const wd = await wr.json();
      if (!wr.ok) throw new Error(`batchUpdate 失敗: ${JSON.stringify(wd.error)}`);

      return { statusCode:200, headers:CORS, body: JSON.stringify({ success:true, saved:{ holdings:hRows.length, trades:tRows.length } }) };
    }

  } catch(err) {
    return { statusCode:500, headers:CORS, body: JSON.stringify({ success:false, error:err.message }) };
  }
};
