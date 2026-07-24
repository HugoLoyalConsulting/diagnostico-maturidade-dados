require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB } = require('./src/db');
const submitRoute = require('./src/routes/submit');
const adminRoute  = require('./src/routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS bloqueado para origem: ${origin}`));
    }
  },
}));

app.use(express.json({ limit: '512kb' }));

app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));
app.use('/api/submit', submitRoute);
app.use('/api/admin',  adminRoute);

async function initDBWithRetry(maxRetries = 5) {
  for (let i = 1; i <= maxRetries; i++) {
    try {
      await initDB();
      console.log('[DB] Tabelas inicializadas.');
      return;
    } catch (err) {
      const delay = 3000 * i;
      console.warn(`[DB] Tentativa ${i}/${maxRetries} falhou (${err?.message || err}). Aguardando ${delay}ms...`);
      if (i < maxRetries) await new Promise(r => setTimeout(r, delay));
    }
  }
  console.error('[DB] Todas as tentativas falharam.');
}

async function start() {
  app.listen(PORT, () => console.log(`[API] Rodando na porta ${PORT}`));
  await initDBWithRetry();
}

start();
