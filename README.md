# Movie Night

Aplicação fullstack para grupos decidirem qual filme assistir juntos. Um host cria uma sala, os convidados entram via código, cada um sugere filmes, e o app sorteia o vencedor.

---

## Funcionalidades

- Criação de sala com código único
- Entrada de convidados sem cadastro (apenas nome de exibição)
- Sugestão de filmes por cada participante
- Sorteio do filme vencedor
- Limpeza automática de salas encerradas via background job

---

## Tech Stack

### Backend

| Tecnologia | Uso |
|---|---|
| Node.js + TypeScript | Runtime e linguagem |
| Express | Framework HTTP |
| Prisma | ORM e migrations |
| PostgreSQL | Banco de dados relacional |
| BullMQ + Redis | Filas e background jobs |
| JWT + bcryptjs | Autenticação stateless |
| Zod | Validação de esquemas |
| Fly.io | Deploy em produção |

### Frontend

| Tecnologia | Uso |
|---|---|
| React 18 + TypeScript | UI e tipagem |
| Vite | Build tool |
| React Router DOM | Roteamento SPA |
| Axios | HTTP client |
| Vercel | Deploy em produção |

### Infraestrutura local

| Ferramenta | Uso |
|---|---|
| Docker Compose | PostgreSQL + Redis locais |

---

## Arquitetura

### Backend — Arquitetura em Camadas

```
src/
├── modules/          # Domínios de negócio
│   └── rooms/
│       ├── http/     # Controllers e rotas
│       └── useCases/ # Regras de negócio
├── domain/           # Entidades e interfaces de repositório
├── infra/
│   ├── jobs/         # Workers BullMQ (limpeza de salas)
│   └── ...
├── config/           # Configurações globais
├── shared/           # Middlewares, erros, utilitários
├── app.ts            # Setup do Express
└── server.ts         # Ponto de entrada
```

Cada módulo segue o padrão:

```
Controller → UseCase/Service → Repository → Banco de Dados
```

- **Controller**: recebe a request, valida entrada com Zod, delega ao UseCase
- **UseCase**: contém a regra de negócio, orquestra repositórios
- **Repository**: acesso ao banco via Prisma, sem lógica de negócio

### Modelo de Dados

```
Room (sala)
├── code: String único de acesso
├── status: OPEN | FINISHED
├── hostId: FK → RoomUser
└── winnerMovieId: FK → Movie

RoomUser (participante)
├── role: HOST | GUEST
├── displayName: nome exibido
└── username + password: apenas para host (auth JWT)

Movie (sugestão)
├── title + year
└── suggestedById: FK → RoomUser
```

### API

Prefixo base: `/api/v1`

Verbos HTTP semânticos (`GET`, `POST`, `PUT`, `DELETE`), substantivos no plural, respostas padronizadas e erros centralizados.

---

## Como Rodar Localmente

### Pré-requisitos

- Node.js 20+
- Docker e Docker Compose

### 1. Subir infraestrutura

```bash
cd backend
docker compose up -d
```

### 2. Backend

```bash
cd backend
cp .env.example .env  # Configure as variáveis
npm install
npm run migrate       # Aplica migrations
npm run dev           # Sobe em http://localhost:3333
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev           # Sobe em http://localhost:5173
```

---

## Variáveis de Ambiente

### Backend (`.env`)

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/movienight
REDIS_URL=redis://localhost:6379
JWT_SECRET=sua-chave-secreta
FRONTEND_URL=http://localhost:5173
PORT=3333
NODE_ENV=development
```

### Frontend (`.env`)

```env
VITE_API_URL=http://localhost:3333/api/v1
```

---

## Deploy

| Serviço | Plataforma | Comando |
|---|---|---|
| Backend | Fly.io | `fly deploy` (a partir de `backend/`) |
| Frontend | Vercel | Push para `main` (deploy automático) |

---

## Boas Práticas Adotadas

- **Componentização**: UI dividida em componentes de responsabilidade única
- **Separação de camadas**: Controller / UseCase / Repository no backend; UI / hooks / API no frontend
- **Migrations versionadas**: nunca alterar migrations já aplicadas
- **Validação com Zod**: entrada validada na borda do sistema
- **JWT stateless**: sem sessão no servidor
- **Background Jobs**: limpeza de salas encerradas via BullMQ, fora do ciclo request/response
- **Error handling centralizado**: erros tratados em middleware, sem exposição de detalhes internos
- **Tipagem completa**: TypeScript em toda a stack
