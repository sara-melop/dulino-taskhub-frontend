# TaskHub — Frontend

Aplicação de gerenciamento de tarefas com autenticação JWT, tema claro/escuro e widget de clima em tempo real.

---

## Sumário

- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Rodando o frontend](#rodando-o-frontend)
- [Executando os testes](#executando-os-testes)
- [Respostas conceituais](#respostas-conceituais)

---

## Tecnologias utilizadas

| Tecnologia | Versão | Papel |
|---|---|---|
| Next.js | 16 | Framework React (App Router) |
| React | 19 | UI |
| Tailwind CSS | 4 | Estilização utility-first |
| Axios | 1 | Cliente HTTP com interceptors |
| Vitest + React Testing Library | 4 / 16 | Testes unitários de componentes |
| Open-Meteo API | — | Dados de clima (sem chave de API) |
| Nominatim (OpenStreetMap) | — | Geocodificação reversa |

---

## Pré-requisitos

- Node.js 20 ou superior
- npm 10 ou superior

---

## Rodando o frontend

```bash
# 1. Instale as dependências
npm install

# 2. (Opcional) Configure a URL do backend
# Crie um arquivo .env.local se quiser sobrescrever o padrão:
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

O frontend ficará disponível em `http://localhost:3000`.

> O backend deve estar rodando em `http://localhost:3001` antes de usar o frontend.

---

## Executando os testes

```bash
npm test
```

Para rodar um arquivo de teste específico:

```bash
npx vitest run tests/TaskForm.test.jsx
npx vitest run tests/TaskItem.test.jsx
```

Os testes cobrem os componentes `TaskForm` e `TaskItem`: renderização, interações de usuário (preencher formulário, submeter, cancelar) e modo de edição.

---

## Respostas conceituais

### 1. Se o projeto crescesse para múltiplos desenvolvedores, quais mudanças de arquitetura você sugeriria?

**Estado do servidor:** extrair as chamadas de API em um layer de dados dedicado (ex: React Query / TanStack Query) para cache, re-fetch automático e deduplicação de requisições. Isso retira a lógica de loading/error dos hooks customizados e centraliza o estado do servidor.

**Variáveis de ambiente:** usar um secret manager (ex: Doppler, Vercel Environment Variables) em vez de arquivos `.env` versionados, garantindo que chaves sensíveis não vazem no repositório.

**CI/CD:** pipeline com lint, testes e build obrigatórios em cada PR (GitHub Actions). Ambientes de staging isolados por branch (ex: Vercel preview deployments) para validar mudanças antes do merge.

**Componentização:** com a equipe crescendo, adotar Storybook para documentar e isolar componentes, facilitando reuso e evitando regressões visuais.

---

### 2. Como você implementaria autenticação mais segura em produção?

A implementação atual armazena o JWT no `localStorage`, o que o expõe a ataques XSS. Em produção, as melhorias prioritárias seriam:

**Tokens em cookies HttpOnly:** mover o JWT para um cookie com flags `HttpOnly`, `Secure` e `SameSite=Strict`. O JavaScript da página não consegue ler esse cookie, eliminando o vetor XSS.

**Refresh token com rotação:** usar um access token de curta duração (15 min) e um refresh token de longa duração (7–30 dias) em cookie separado. A cada renovação o refresh token é substituído (rotação), permitindo detectar roubo de token.

**Rate limiting no cliente:** limitar tentativas de login na UI (ex: desabilitar o botão após N falhas consecutivas) como primeira linha de defesa contra força bruta, complementando a proteção no backend.

**HTTPS obrigatório:** garantir que toda a comunicação ocorra via TLS. Os cookies `Secure` só trafegam em HTTPS, tornando isso um pré-requisito para as medidas acima funcionarem.

---

### 3. Descreva como funcionaria um sistema de permissões por papel (roles) para equipes

O modelo atual é simples: cada tarefa pertence a um único usuário. Para suportar equipes com papéis distintos, a arquitetura precisaria evoluir:

**Modelo de dados (backend):** adicionar entidades `Team` e `TeamMember` com a coluna `role` (`owner`, `admin`, `member`, `viewer`). Tarefas passariam a ter `teamId` além de `userId`.

**Permissões por papel:**
| Papel | Ver tarefas da equipe | Criar/editar | Excluir | Gerenciar membros |
|---|---|---|---|---|
| viewer | sim | não | não | não |
| member | sim | próprias | próprias | não |
| admin | sim | todas | todas | sim |
| owner | sim | todas | todas | sim + transferir ownership |

**No frontend:** o payload do JWT (ou um endpoint `/me`) retorna os papéis do usuário por equipe. A UI usa esses papéis para exibir ou ocultar controles (ex: botão "Excluir" visível apenas para `admin`/`owner`). A validação real, porém, sempre ocorre no backend — a UI é apenas conveniência visual.
