const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { createOrUpdateContact } = require('../hubspot');

router.post('/', async (req, res) => {
  const { lead, report, answers } = req.body || {};

  if (!lead?.email || !lead?.firstName || !report?.score?.general) {
    return res.status(400).json({ error: 'Payload inválido: lead.email, lead.firstName e report.score.general são obrigatórios.' });
  }

  const scope = report.score?.scope || {};

  // 1. Persistir no PostgreSQL
  let submissionId;
  try {
    const { rows } = await pool.query(
      `INSERT INTO submissions (
        first_name, last_name, email, company, whatsapp,
        sector, area, role, company_size, website,
        score_overall, score_level,
        score_clareza, score_eficiencia, score_qualidade,
        score_arquitetura, score_governanca,
        answers
      ) VALUES (
        $1,$2,$3,$4,$5,
        $6,$7,$8,$9,$10,
        $11,$12,
        $13,$14,$15,
        $16,$17,
        $18
      ) RETURNING id`,
      [
        lead.firstName, lead.lastName, lead.email, lead.company, lead.whatsapp,
        lead.sector, lead.area, lead.role, lead.companySize, lead.website || null,
        report.score.general, report.classification || null,
        scope['Clareza e Visibilidade do Negócio']          ?? null,
        scope['Eficiência Operacional e Automação']         ?? null,
        scope['Qualidade e Integração dos Dados']           ?? null,
        scope['Arquitetura, Engenharia e Escalabilidade']   ?? null,
        scope['Governança e Cultura Data-Driven']           ?? null,
        JSON.stringify(answers || {}),
      ]
    );
    submissionId = rows[0].id;
  } catch (dbErr) {
    console.error('[DB] Erro ao salvar submission:', dbErr.message);
    return res.status(500).json({ error: 'Erro interno ao salvar dados.' });
  }

  // 2. Enviar ao HubSpot (opcional — só executa se token configurado)
  let hubspotContactId = null;
  let hubspotStatus = 'skipped';

  if (process.env.HUBSPOT_API_TOKEN) {
    try {
      hubspotContactId = await createOrUpdateContact(lead, report);
      hubspotStatus = 'sent';
    } catch (hsErr) {
      console.error('[HubSpot] Erro ao criar/atualizar contato:', hsErr.response?.data || hsErr.message);
      hubspotStatus = 'error';
    }

    await pool.query(
      'UPDATE submissions SET hubspot_contact_id = $1, hubspot_status = $2 WHERE id = $3',
      [hubspotContactId, hubspotStatus, submissionId]
    );
  }

  res.json({ success: true, submissionId, hubspotContactId, hubspotStatus });
});

module.exports = router;
