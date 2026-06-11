# Especificação de Requisitos — Diagnóstico de Maturidade de Dados, BI e Operações

## Objetivo do Sistema

Criar uma aplicação web extremamente simples, portátil e executável localmente via arquivo HTML, sem necessidade de backend, que permita:

1. preenchimento de um assessment de maturidade;
2. cálculo automático de score;
3. geração de dashboard analítico;
4. geração automática de PDF executivo aprofundado;
5. download automático do PDF no dispositivo do usuário;
6. compartilhamento manual do PDF com a consultoria.

O sistema deve transmitir percepção de:

* profissionalismo;
* inteligência analítica;
* autoridade técnica;
* diagnóstico consultivo avançado.

---

# Stack Recomendada

## Front-end

* HTML5
* CSS3
* JavaScript Vanilla

## Bibliotecas JS

### PDF

* `jsPDF`
* `html2canvas`

### Gráficos

* `Chart.js`

### Ícones

* `Lucide Icons` ou `Font Awesome`

---

# Arquitetura do Sistema

## Arquivo único

Preferencialmente:

```plaintext
index.html
```

Contendo:

* HTML
* CSS interno
* JS interno

Objetivo:

* máxima portabilidade;
* funcionar offline;
* abrir diretamente no navegador;
* permitir envio via WhatsApp/email.

---

# Fluxo do Usuário

## Etapa 1 — Tela Inicial

Elementos:

* logo;
* título;
* subtítulo;
* breve descrição;
* botão “Iniciar Diagnóstico”.

Mensagem estratégica:

* reforçar:

  * crescimento;
  * eficiência;
  * escalabilidade;
  * redução de gargalos invisíveis.

---

## Etapa 2 — Formulário

### Estrutura

* 10 perguntas;
* agrupadas em 3 âmbitos;
* escala Likert 1–5;
* obrigatório responder todas.

---

# Estrutura Visual do Formulário

## Cada pergunta deve conter:

* título da pergunta;
* descrição curta contextual;
* escala horizontal:

  * 1 → Discordo plenamente
  * 5 → Concordo plenamente

---

# UX/UI Desejada

## Estilo visual

Inspirado em:

* consultorias enterprise;
* dashboards executivos;
* SaaS B2B premium.

## Características

* clean;
* moderno;
* dark/light auto;
* responsivo;
* mobile-first;
* animações suaves;
* sensação de “assessment corporativo avançado”.

---

# Cálculo de Score

## Scores calculados:

### Geral

* média total.

### Por âmbito

* Governança e Qualidade;
* BI e Analytics;
* Integração e Escalabilidade.

### Por pergunta

* armazenar individualmente.

---

# Regras Analíticas

## Classificação

| Média | Classificação |
| ----- | ------------- |
| 1–2   | Crítico       |
| 2–3   | Baixo         |
| 3–4   | Intermediário |
| 4–5   | Avançado      |

---

# Página de Resultado

## Deve conter:

### 1. Score geral

* número;
* barra;
* classificação textual.

---

### 2. Gráfico Radar

Eixos:

* Governança;
* Qualidade;
* BI;
* Analytics;
* Integração;
* Automação;
* Escalabilidade.

---

### 3. Heatmap de Fragilidade

Mostrar:

* perguntas mais críticas;
* níveis de risco operacional.

---

### 4. Insights automáticos

Gerados dinamicamente conforme respostas.

Exemplo:

```plaintext
Sua operação demonstra forte dependência operacional e baixa integração entre áreas, o que aumenta risco de retrabalho, inconsistência de indicadores e lentidão decisória.
```

---

# Engine de Recomendações

## Estrutura obrigatória

Criar um objeto JS central contendo:

```javascript
const recommendations = {
  group_1_2: {
    low: {...},
    medium: {...},
    high: {...}
  }
}
```

---

# Regras de Recomendações

## Grupo Perguntas 1 + 2

Tema:

* Governança;
* rastreabilidade;
* confiança nos dados.

---

### Se média <= 2

Gerar:

* alerta crítico;
* texto consultivo;
* recomendações.

Exemplo:

* implantar governança;
* mapear origem dos dados;
* criar ownership;
* padronizar KPIs;
* implementar Data Dictionary;
* criar camada única de verdade.

---

### Se média 2–4

Gerar:

* maturidade parcial;
* necessidade de consolidação;
* automações pontuais.

---

### Se média >= 4

Gerar:

* foco em otimização;
* analytics avançado;
* IA;
* previsão;
* automações inteligentes.

---

# Grupos Recomendados

| Grupo | Perguntas | Tema                        |
| ----- | --------- | --------------------------- |
| G1    | 1–2       | Governança e confiança      |
| G2    | 3–4       | Padronização e qualidade    |
| G3    | 5–7       | BI e Analytics              |
| G4    | 8–10      | Integração e escalabilidade |

---

# PDF Executivo

## Deve ser gerado automaticamente

Formato:

```plaintext
assessment_empresa.pdf
```

---

# Estrutura do PDF

## Página 1

### Capa

* logo;
* nome do assessment;
* data;
* score geral;
* classificação.

---

## Página 2

### Resumo Executivo

Texto gerado dinamicamente:

* riscos;
* oportunidades;
* gargalos;
* nível de maturidade.

---

## Página 3

### Scores por âmbito

* gráficos;
* comparativos;
* interpretação.

---

## Página 4

### Principais Fragilidades

Top 3 menores notas.

---

## Página 5–7

### Recomendações Estratégicas

Separadas por:

* curto prazo;
* médio prazo;
* longo prazo.

---

# Recomendações Inteligentes

## Curto prazo

Exemplos:

* centralizar dados;
* eliminar planilhas críticas;
* criar dashboards operacionais.

## Médio prazo

* pipelines automatizados;
* DW/Data Lake;
* governança;
* integrações.

## Longo prazo

* IA;
* previsão;
* analytics avançado;
* software interno;
* automações corporativas.

---

# Recursos Técnicos Obrigatórios

## Exportação PDF

* automática após conclusão;
* sem backend;
* offline.

---

## Persistência

Salvar localmente:

```javascript
localStorage
```

---

## Responsividade

Funcionar:

* desktop;
* Android;
* iPhone.

---

# Estrutura de Código Recomendada

```plaintext
/index.html
/styles/
/scripts/
  questions.js
  scoring.js
  recommendations.js
  pdf-generator.js
```

Ou tudo inline em arquivo único.

---

# Requisitos de Performance

## Obrigatório

* carregamento < 2 segundos;
* sem dependências pesadas;
* funcionar offline;
* sem API externa.

---

# Linguagem dos Insights

## Diretrizes

O texto deve:

* parecer consultoria enterprise;
* transmitir urgência;
* reforçar:

  * custo oculto;
  * risco;
  * escalabilidade;
  * perda operacional;
  * oportunidade financeira.

Sem parecer agressivamente vendedor.

---

# Diferencial Estratégico Desejado

O sistema deve causar sensação de:

> “Temos mais problemas estruturais do que imaginávamos.”

e simultaneamente:

> “Existe um caminho claro para evoluir.”

---

# Resultado Esperado

Ao finalizar:

1. usuário responde;
2. sistema calcula score;
3. gera dashboard;
4. gera relatório executivo;
5. baixa PDF automaticamente;
6. usuário envia PDF para consultoria;
7. consultoria usa o PDF como abertura comercial altamente qualificada.