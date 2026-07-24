const express = require('express');
const router  = express.Router();
const { pool } = require('../db');

// Proteção mínima por chave interna (definir ADMIN_KEY no Railway)
router.use((req, res, next) => {
  const key = process.env.ADMIN_KEY;
  if (key && req.headers['x-admin-key'] !== key) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

// GET /api/admin/submissions?limit=20&offset=0
router.get('/submissions', async (req, res) => {
  const limit  = Math.min(parseInt(req.query.limit  || '20', 10), 100);
  const offset = parseInt(req.query.offset || '0', 10);

  try {
    const { rows } = await pool.query(
      `SELECT id, created_at, first_name, last_name, email, company,
              sector, area, role, company_size,
              score_overall, score_level,
              score_clareza, score_eficiencia, score_qualidade,
              score_arquitetura, score_governanca,
              hubspot_status, hubspot_contact_id
       FROM submissions
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    const { rows: [{ count }] } = await pool.query('SELECT COUNT(*)::int FROM submissions');
    res.json({ total: count, limit, offset, data: rows });
  } catch (err) {
    console.error('[Admin] Erro ao listar:', err.message);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        COUNT(*)::int                                     AS total,
        ROUND(AVG(score_overall)::numeric, 2)            AS avg_score,
        MAX(score_overall)                                AS max_score,
        MIN(score_overall)                                AS min_score,
        COUNT(*) FILTER (WHERE score_level = 'Crítico')::int       AS nivel_critico,
        COUNT(*) FILTER (WHERE score_level = 'Baixo')::int         AS nivel_baixo,
        COUNT(*) FILTER (WHERE score_level = 'Intermediário')::int AS nivel_intermediario,
        COUNT(*) FILTER (WHERE score_level = 'Avançado')::int      AS nivel_avancado,
        COUNT(*) FILTER (WHERE hubspot_status = 'sent')::int       AS hubspot_enviados,
        COUNT(*) FILTER (WHERE hubspot_status = 'error')::int      AS hubspot_erros,
        COUNT(*) FILTER (WHERE hubspot_status = 'skipped')::int    AS hubspot_ignorados,
        MIN(created_at)  AS primeira_submissao,
        MAX(created_at)  AS ultima_submissao
      FROM submissions
    `);
    res.json(rows[0]);
  } catch (err) {
    console.error('[Admin] Erro ao calcular stats:', err.message);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

module.exports = router;
