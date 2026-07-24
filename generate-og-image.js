// Gera og-image.png (1200×630) para preview de WhatsApp/LinkedIn/Facebook.
// Uso: node generate-og-image.js
const { chromium } = require('./qa/node_modules/playwright');
const path = require('path');

const HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; overflow: hidden;
    background: #0a0820;
    font-family: 'Segoe UI', system-ui, sans-serif;
    color: #f7fbff;
    display: flex; align-items: center; justify-content: center;
  }
  .bg-glow {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 700px 400px at 30% 50%, rgba(148,91,255,0.22) 0%, transparent 70%),
                radial-gradient(ellipse 500px 300px at 80% 60%, rgba(65,228,214,0.14) 0%, transparent 70%);
  }
  .card {
    position: relative; z-index: 1;
    display: flex; align-items: center; gap: 80px;
    padding: 0 80px;
    width: 100%;
  }
  .left { flex: 1; }
  .badge {
    display: inline-block;
    background: rgba(148,91,255,0.2);
    border: 1px solid rgba(148,91,255,0.5);
    color: #b894ff;
    font-size: 15px; font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 6px 18px;
    border-radius: 999px;
    margin-bottom: 24px;
  }
  h1 {
    font-size: 52px; font-weight: 800; line-height: 1.1;
    color: #f7fbff;
    margin-bottom: 20px;
  }
  h1 span { color: #945bff; }
  p {
    font-size: 20px; line-height: 1.5;
    color: #c5d8f0;
    max-width: 520px;
  }
  .right {
    flex-shrink: 0;
    display: flex; flex-direction: column; gap: 16px;
  }
  .pill {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 12px;
    padding: 14px 24px;
    font-size: 17px; font-weight: 500;
    color: #dbe7f5;
    display: flex; align-items: center; gap: 12px;
    white-space: nowrap;
  }
  .dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .dot.purple { background: #945bff; }
  .dot.teal   { background: #41e4d6; }
  .cta {
    margin-top: 36px;
    display: inline-flex; align-items: center; gap: 10px;
    background: #945bff;
    color: #fff;
    font-size: 18px; font-weight: 700;
    padding: 16px 32px;
    border-radius: 10px;
  }
  .logo {
    position: absolute; bottom: 36px; right: 56px;
    font-size: 16px; color: rgba(255,255,255,0.35);
    font-weight: 500; letter-spacing: 0.04em;
  }
  .divider {
    width: 1px; height: 320px; flex-shrink: 0;
    background: linear-gradient(to bottom, transparent, rgba(148,91,255,0.4), transparent);
  }
</style>
</head>
<body>
<div class="bg-glow"></div>
<div class="card">
  <div class="left">
    <div class="badge">Diagnóstico Gratuito</div>
    <h1>Maturidade de<br/><span>Dados</span> da sua<br/>Empresa</h1>
    <p>12 perguntas. Relatório executivo instantâneo com score por dimensão e recomendações práticas.</p>
    <div class="cta">Fazer o diagnóstico agora →</div>
  </div>
  <div class="divider"></div>
  <div class="right">
    <div class="pill"><span class="dot purple"></span>Clareza e Visibilidade</div>
    <div class="pill"><span class="dot teal"></span>Eficiência Operacional</div>
    <div class="pill"><span class="dot purple"></span>Qualidade dos Dados</div>
    <div class="pill"><span class="dot teal"></span>Arquitetura e Escala</div>
    <div class="pill"><span class="dot purple"></span>Governança e Cultura</div>
  </div>
</div>
<div class="logo">loyalconsulting.com.br</div>
</body>
</html>`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.setContent(HTML, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(300);
  const out = path.join(__dirname, 'og-image.png');
  await page.screenshot({ path: out, type: 'png' });
  await browser.close();
  console.log('og-image.png gerada em:', out);
})();
