# Diagnóstico de Maturidade de Dados — Loyal Consulting

Formulário de avaliação de maturidade em dados, BI e operações. Coleta dados do lead, calcula score por dimensão e gera um relatório executivo em PDF diretamente no navegador. Ao finalizar, envia os dados para a API no Railway, que os persiste no PostgreSQL e cria/atualiza o contato no HubSpot.

---

## Arquitetura

```
[Usuário no formulário]
        │
        ▼
[GitHub Pages]                     ← index.html (formulário + PDF client-side)
  https://hugoloyalconsulting.github.io/diagnostico-maturidade-dados/
        │
        │  POST /api/submit (não-bloqueante)
        ▼
[Railway — API Node.js]            ← backend/
  https://api-production-9b04.up.railway.app
        │
        ├── [Railway — PostgreSQL]  ← backup de todas as submissões
        └── [HubSpot CRM]          ← contato criado/atualizado automaticamente
```

---

## URLs

| Serviço | URL |
|---------|-----|
| Formulário (GitHub Pages) | https://hugoloyalconsulting.github.io/diagnostico-maturidade-dados/ |
| API (Railway) | https://api-production-9b04.up.railway.app |
| Health check | https://api-production-9b04.up.railway.app/health |
| Projeto Railway | https://railway.com/project/d8a11439-fa6e-42c4-98a6-fb56650c7eec |
| Repositório GitHub | https://github.com/HugoLoyalConsulting/diagnostico-maturidade-dados |

---

## Estrutura de arquivos

```
/
├── index.html                  ← Formulário completo (todas as libs embutidas)
├── vendor/                     ← Fontes originais das libs (não usadas em prod)
├── backend/                    ← API Node.js (Railway)
│   ├── server.js               ← Ponto de entrada Express
│   ├── package.json
│   ├── railway.json            ← Configuração de deploy Railway
│   ├── .env.example            ← Variáveis necessárias
│   └── src/
│       ├── db.js               ← Conexão PostgreSQL + criação da tabela
│       ├── hubspot.js          ← Integração HubSpot API v3
│       └── routes/
│           └── submit.js       ← POST /api/submit
├── DEPLOY.md                   ← Guia passo a passo de deploy
└── README.md                   ← Este arquivo
```

---

## Fluxo de dados

1. Usuário preenche o formulário (7 etapas: lead + 5 seções + resultado)
2. Ao chegar na tela de resultado, `submitToAPI()` é chamada de forma não-bloqueante
3. O payload enviado contém:
   - `lead`: nome, email, empresa, WhatsApp, setor, área, cargo, porte, site
   - `report.score`: score geral + score por dimensão (5 dimensões)
   - `report.classification`: nível de maturidade (Crítico / Baixo / Intermediário / Avançado)
   - `answers`: todas as 12 respostas individuais
4. A API salva no PostgreSQL e cria/atualiza o contato no HubSpot
5. O formulário continua funcionando normalmente mesmo se a API estiver fora do ar

---

## Variáveis de ambiente (Railway)

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | Fornecida automaticamente pelo Railway PostgreSQL |
| `HUBSPOT_API_TOKEN` | Private App Token do HubSpot (escopos: `contacts.read`, `contacts.write`) |
| `ALLOWED_ORIGINS` | Origens CORS permitidas (ex: `https://hugoloyalconsulting.github.io`) |
| `NODE_ENV` | `production` |

---

## HubSpot — Propriedades customizadas de contato

Crie em **Settings → Properties → Contact Properties**:

| Nome interno | Tipo | Label |
|---|---|---|
| `maturidade_score_geral` | Number | Maturidade: Score Geral |
| `maturidade_nivel` | Text | Maturidade: Nível |
| `maturidade_score_clareza` | Number | Maturidade: Clareza e Visibilidade |
| `maturidade_score_eficiencia` | Number | Maturidade: Eficiência Operacional |
| `maturidade_score_qualidade` | Number | Maturidade: Qualidade dos Dados |
| `maturidade_score_arquitetura` | Number | Maturidade: Arquitetura |
| `maturidade_score_governanca` | Number | Maturidade: Governança |
| `maturidade_setor` | Text | Maturidade: Setor |
| `maturidade_area` | Text | Maturidade: Área |
| `maturidade_porte_empresa` | Text | Maturidade: Porte da Empresa |

---

## Desenvolvimento local

```bash
cd backend
cp .env.example .env
# Edite .env com suas credenciais
npm install
npm run dev
```

O frontend (`index.html`) pode ser aberto diretamente no navegador ou servido com qualquer servidor estático.

---

## Deploy

Veja [DEPLOY.md](DEPLOY.md) para o guia completo.
