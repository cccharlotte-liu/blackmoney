exports.handler = async function(event) {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: corsHeaders, body: '' };

  const singleCode = event.queryStringParameters?.code;
  const reqHeaders = {
    'User-Agent': 'Mozilla/5.0',
    'Referer': 'https://www.twse.com.tw/',
  };

  if (singleCode) {
    for (const market of ['tse', 'otc']) {
      try {
        const url = `https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=${market}_${singleCode.toUpperCase()}.tw&json=1&delay=0&_=${Date.now()}`;
        const resp = await fetch(url, { headers: reqHeaders });
        if (!resp.ok) continue;
        const data = await resp.json();
        const item = (data.msgArray || [])[0];
        if (!item?.c) continue;
        const p = (item.z && item.z !== '-') ? parseFloat(item.z) : (item.y && item.y !== '-') ? parseFloat(item.y) : NaN;
        if (isNaN(p)) continue;
        return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true, stock: { code: item.c, name: item.n || singleCode, price: p } }) };
      } catch(e) { continue; }
    }
    return { statusCode: 404, headers: corsHeaders, body: JSON.stringify({ success: false, error: `找不到 ${singleCode}` }) };
  }

  const prices = {};
  const tseParam = ['0050','006208','2330','0052'].map(s=>`tse_${s}.tw`).join('|');
  const otcParam = ['00878','00403A'].map(s=>`otc_${s}.tw`).join('|');

  for (const [label, param] of [['TSE', tseParam], ['OTC', otcParam]]) {
    try {
      const resp = await fetch(`https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=${param}&json=1&delay=0&_=${Date.now()}`, { headers: reqHeaders });
      if (!resp.ok) continue;
      const data = await resp.json();
      (data.msgArray || []).forEach(item => {
        const p = (item.z && item.z !== '-') ? parseFloat(item.z) : (item.y && item.y !== '-') ? parseFloat(item.y) : NaN;
        if (item.c && !isNaN(p)) prices[item.c] = p;
      });
    } catch(e) { continue; }
  }

  if (Object.keys(prices).length === 0) {
    try {
      const resp = await fetch('https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL', { headers: reqHeaders });
      if (resp.ok) {
        const data = await resp.json();
        data.forEach(item => {
          const p = parseFloat((item.ClosingPrice||'').replace(/,/g,''));
          if (!isNaN(p)) prices[item.Code] = p;
        });
      }
    } catch(e) {}
  }

  return {
    statusCode: Object.keys(prices).length > 0 ? 200 : 500,
    headers: corsHeaders,
    body: JSON.stringify({ success: Object.keys(prices).length > 0, prices }),
  };
};
