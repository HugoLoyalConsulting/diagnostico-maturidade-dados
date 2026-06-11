# Guia de Deploy — Formulário de Maturidade de Dados

## Visão geral da arquitetura

```
[Usuário]
   │
   ▼
[GitHub Pages]          ← index.html (frontend estático)
   │  POST /api/submit
   ▼
[Railway — Node.js API] ← backend/
   │
   ├── [Railway — PostgreSQL]  ← backup de todas as submissões
   └── [HubSpot CRM]          ← contato criado/atualizado automaticamente
```

---

## 1. GitHub Pages (frontend)

### Passos

1. Crie um repositório no GitHub (ex: `form-maturidade-dados`).
2. Faça o upload do `index.html` para a raiz do repositório.
3. Acesse **Settings → Pages → Source** e selecione a branch `main`, pasta `/root`.
4. O GitHub Pages ficará disponível em:
   `https://SEU_USUARIO.github.io/form-maturidade-dados/`

> **Nota:** depois de fazer o deploy do backend no Railway (passo 2), volte ao `index.html` e atualize a linha:
> ```js
> const API_URL = "https://SEU-PROJETO.railway.app/api/submit";
> ```

---

## 2. Railway — Backend + Banco de dados

### 2.1 Criar o projeto

1. Acesse [railway.app](https://railway.app) e crie um novo projeto.
2. Clique em **Deploy from GitHub repo** e selecione o repositório.
3. No Railway, configure o **Root Directory** do serviço Node.js como `backend/`.

### 2.2 Adicionar PostgreSQL

1. No mesmo projeto Railway, clique em **+ Add Service → PostgreSQL**.
2. O Railway criará a variável `DATABASE_URL` automaticamente e a injetará no serviço Node.

### 2.3 Variáveis de ambiente

No serviço Node.js, vá em **Variables** e adicione:

| Variável              | Valor                                     |
|-----------------------|-------------------------------------------|
| `HUBSPOT_API_TOKEN`   | Seu Private App Token do HubSpot          |
| `ALLOWED_ORIGINS`     | `https://SEU_USUARIO.github.io`           |
| `NODE_ENV`            | `production`                              |

> `DATABASE_URL` é injetada automaticamente pelo Railway.

### 2.4 Deploy

O Railway fará o deploy automaticamente ao detectar o `railway.json`.
Copie a URL gerada (ex: `https://loyal-api.up.railway.app`) e atualize o `API_URL` no `index.html`.

---

## 3. HubSpot — Configuração das propriedades customizadas

Antes de usar, crie as seguintes propriedades de contato no HubSpot:

**Settings → Properties → Contact Properties → Create property**

| Nome interno                      | Tipo    | Label                              |
|-----------------------------------|---------|------------------------------------|
| `maturidade_score_geral`          | Number  | Maturidade: Score Geral            |
| `maturidade_nivel`                | Text    | Maturidade: Nível                  |
| `maturidade_score_clareza`        | Number  | Maturidade: Clareza e Visibilidade |
| `maturidade_score_eficiencia`     | Number  | Maturidade: Eficiência Operacional |
| `maturidade_score_qualidade`      | Number  | Maturidade: Qualidade dos Dados    |
| `maturidade_score_arquitetura`    | Number  | Maturidade: Arquitetura            |
| `maturidade_score_governanca`     | Number  | Maturidade: Governança             |
| `maturidade_setor`                | Text    | Maturidade: Setor                  |
| `maturidade_area`                 | Text    | Maturidade: Área                   |
| `maturidade_porte_empresa`        | Text    | Maturidade: Porte da Empresa       |

### Gerar o Private App Token

1. HubSpot → **Settings → Integrations → Private Apps → Create a private app**
2. Nome: `Loyal Consulting API`
3. Escopos necessários: `crm.objects.contacts.write`, `crm.objects.contacts.read`
4. Copie o token e adicione como `HUBSPOT_API_TOKEN` no Railway.

---

## 4. Testar localmente

```bash
cd backend
cp .env.example .env
# Edite .env com suas credenciais
npm install
npm run dev
```

Abra o `index.html` no navegador e preencha o formulário. Ao chegar na etapa de resultado,
o formulário enviará os dados para `http://localhost:3000/api/submit`.

---

## 5. Estrutura de arquivos

```
Formulário Maturidade Dados/
├── index.html          ← Frontend (GitHub Pages)
├── vendor/             ← Libs JS (já embutidas no HTML)
├── DEPLOY.md           ← Este guia
└── backend/            ← API Node.js (Railway)
    ├── server.js
    ├── package.json
    ├── railway.json
    ├── .env.example
    ├── .gitignore
    └── src/
        ├── db.js
        ├── hubspot.js
        └── routes/
            └── submit.js
```
