# loyal-consulting-api

API REST para o formulário de diagnóstico de maturidade de dados da Loyal Consulting.

## Responsabilidades

- Receber o payload do formulário via `POST /api/submit`
- Persistir a submissão no PostgreSQL
- Criar ou atualizar o contato no HubSpot com score e nível de maturidade
- Expor `/health` para monitoramento

## Stack

- **Runtime**: Node.js 18+
- **Framework**: Express 4
- **Banco**: PostgreSQL via `pg`
- **CRM**: HubSpot API v3 via `axios`
- **Deploy**: Railway (Nixpacks)

## Endpoints

### `GET /health`
Retorna `{ status: "ok", ts: "<ISO timestamp>" }`.

### `POST /api/submit`

**Body (JSON):**
```json
{
  "lead": {
    "firstName": "Carlos",
    "lastName": "Mendes",
    "email": "carlos@empresa.com",
    "company": "Empresa Ltda",
    "whatsapp": "11999999999",
    "sector": "Tecnologia",
    "area": "TI",
    "role": "Diretor",
    "companySize": "51-200",
    "website": "https://empresa.com"
  },
  "report": {
    "score": {
      "general": 3.2,
      "scope": {
        "Clareza e Visibilidade do Negócio": 3.5,
        "Eficiência Operacional e Automação": 2.8,
        "Qualidade e Integração dos Dados": 3.0,
        "Arquitetura, Engenharia e Escalabilidade": 3.5,
        "Governança e Cultura Data-Driven": 3.2
      }
    },
    "classification": "Intermediário"
  },
  "answers": {
    "q1": "4", "q2": "3", "q3": "3", "q4": "2",
    "q5": "3", "q6": "3", "q7": "4", "q8": "3",
    "q9": "3", "q10": "3", "q11": "3", "q12": "4"
  }
}
```

**Resposta de sucesso:**
```json
{
  "success": true,
  "submissionId": 42,
  "hubspotContactId": "12345678",
  "hubspotStatus": "sent"
}
```

**Possíveis valores de `hubspotStatus`:** `sent`, `error`, `skipped` (quando `HUBSPOT_API_TOKEN` não está definido).

## Banco de dados — tabela `submissions`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | SERIAL | Chave primária |
| `created_at` | TIMESTAMPTZ | Timestamp de criação |
| `first_name` | TEXT | Nome |
| `last_name` | TEXT | Sobrenome |
| `email` | TEXT | E-mail |
| `company` | TEXT | Empresa |
| `whatsapp` | TEXT | WhatsApp |
| `sector` | TEXT | Setor |
| `area` | TEXT | Área |
| `role` | TEXT | Cargo |
| `company_size` | TEXT | Porte da empresa |
| `website` | TEXT | Site |
| `score_overall` | NUMERIC(4,2) | Score geral (1–5) |
| `score_level` | TEXT | Nível: Crítico / Baixo / Intermediário / Avançado |
| `score_clareza` | NUMERIC(4,2) | Score por dimensão |
| `score_eficiencia` | NUMERIC(4,2) | — |
| `score_qualidade` | NUMERIC(4,2) | — |
| `score_arquitetura` | NUMERIC(4,2) | — |
| `score_governanca` | NUMERIC(4,2) | — |
| `answers` | JSONB | Respostas individuais |
| `hubspot_contact_id` | TEXT | ID do contato no HubSpot |
| `hubspot_status` | TEXT | Status da integração |

A tabela é criada automaticamente no primeiro start (`initDB()`).

## Variáveis de ambiente

```env
DATABASE_URL=postgresql://user:pass@host:5432/railway
HUBSPOT_API_TOKEN=pat-na1-xxxx
ALLOWED_ORIGINS=https://hugoloyalconsulting.github.io
NODE_ENV=production
PORT=3000
```

## Desenvolvimento local

```bash
npm install
cp .env.example .env
# Configure .env
npm run dev      # nodemon com hot-reload
npm start        # produção
```
