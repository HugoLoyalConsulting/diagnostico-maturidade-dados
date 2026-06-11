require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS submissions (
      id              SERIAL PRIMARY KEY,
      created_at      TIMESTAMPTZ DEFAULT NOW(),
      first_name      TEXT,
      last_name       TEXT,
      email           TEXT,
      company         TEXT,
      whatsapp        TEXT,
      sector          TEXT,
      area            TEXT,
      role            TEXT,
      company_size    TEXT,
      website         TEXT,
      score_overall   NUMERIC(4,2),
      score_level     TEXT,
      score_clareza        NUMERIC(4,2),
      score_eficiencia     NUMERIC(4,2),
      score_qualidade      NUMERIC(4,2),
      score_arquitetura    NUMERIC(4,2),
      score_governanca     NUMERIC(4,2),
      answers         JSONB,
      hubspot_contact_id  TEXT,
      hubspot_status      TEXT DEFAULT 'pending'
    )
  `);
}

module.exports = { pool, initDB };
