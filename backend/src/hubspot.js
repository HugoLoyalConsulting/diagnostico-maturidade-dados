const axios = require('axios');

const BASE_URL = 'https://api.hubapi.com';

function authHeaders() {
  return {
    Authorization: `Bearer ${process.env.HUBSPOT_API_TOKEN}`,
    'Content-Type': 'application/json',
  };
}

function buildContactProperties(lead, report) {
  const scope = report.score?.scope || {};
  return {
    email:     lead.email,
    firstname: lead.firstName,
    lastname:  lead.lastName,
    phone:     lead.whatsapp,
    company:   lead.company,
    jobtitle:  lead.role,
    website:   lead.website || '',
    // Propriedades customizadas do diagnóstico (criadas via HubSpot UI ou API)
    maturidade_score_geral:      String((report.score?.general || 0).toFixed(2)),
    maturidade_nivel:            report.classification || '',
    maturidade_score_clareza:    String((scope['Clareza e Visibilidade do Negócio'] || 0).toFixed(2)),
    maturidade_score_eficiencia: String((scope['Eficiência Operacional e Automação'] || 0).toFixed(2)),
    maturidade_score_qualidade:  String((scope['Qualidade e Integração dos Dados'] || 0).toFixed(2)),
    maturidade_score_arquitetura:String((scope['Arquitetura, Engenharia e Escalabilidade'] || 0).toFixed(2)),
    maturidade_score_governanca: String((scope['Governança e Cultura Data-Driven'] || 0).toFixed(2)),
    maturidade_setor:            lead.sector  || '',
    maturidade_area:             lead.area    || '',
    maturidade_porte_empresa:    lead.companySize || '',
  };
}

async function findContactByEmail(email) {
  const res = await axios.post(
    `${BASE_URL}/crm/v3/objects/contacts/search`,
    {
      filterGroups: [{
        filters: [{ propertyName: 'email', operator: 'EQ', value: email }],
      }],
      properties: ['id'],
      limit: 1,
    },
    { headers: authHeaders() }
  );
  return res.data.total > 0 ? res.data.results[0].id : null;
}

async function createOrUpdateContact(lead, report) {
  const properties = buildContactProperties(lead, report);

  let contactId = await findContactByEmail(lead.email);

  if (contactId) {
    await axios.patch(
      `${BASE_URL}/crm/v3/objects/contacts/${contactId}`,
      { properties },
      { headers: authHeaders() }
    );
  } else {
    const res = await axios.post(
      `${BASE_URL}/crm/v3/objects/contacts`,
      { properties },
      { headers: authHeaders() }
    );
    contactId = res.data.id;
  }

  return contactId;
}

module.exports = { createOrUpdateContact };
