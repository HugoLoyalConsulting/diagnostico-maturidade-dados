require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB } = require('./src/db');
const submitRoute = require('./src/routes/submit');

const app = express();
const PORT = process.env.PORT || 3000;

// Permite chamadas do GitHub Pages (e localhost para dev)
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Permite ausência de origem (ex: Postman, curl) e origens na lista
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

async function start() {
  try {
    await initDB();
    console.log('[DB] Tabelas inicializadas.');
    app.listen(PORT, () => console.log(`[API] Rodando na porta ${PORT}`));
  } catch (err) {
    console.error('[FATAL] Falha ao iniciar:', err.message);
    process.exit(1);
  }
}

start();
