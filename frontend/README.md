# 🎬 Movie Night - Frontend

Interface web para escolher filmes com amigos de forma democrática e aleatória.

## 🚀 Tecnologias

- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool ultra-rápido
- **React Router** - Navegação SPA
- **Axios** - Cliente HTTP
- **CSS Modules** - Estilos isolados

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Criar arquivo .env
cp .env.example .env

# Editar .env com a URL do backend
# VITE_API_URL=http://localhost:3333
```

## 🎯 Scripts

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Lint
npm run lint
```

## 🌐 Acessar

Após rodar `npm run dev`, acesse:
- **Local:** http://localhost:3000
- **Network:** Disponível na rede local

## 📁 Estrutura

```
src/
├── @types/          # Tipos TypeScript
├── components/      # Componentes reutilizáveis
│   ├── ui/         # Componentes de UI
│   └── layout/     # Componentes de layout
├── contexts/       # Contexts (Auth)
├── hooks/          # Custom hooks
├── pages/          # Páginas da aplicação
├── services/       # Serviços (API)
├── styles/         # Estilos globais
├── utils/          # Utilitários
├── App.tsx         # Componente raiz
├── main.tsx        # Entry point
└── routes.tsx      # Configuração de rotas
```

## 🎨 Páginas

- `/` - Home (criar ou entrar em sala)
- `/create` - Criar nova sala
- `/join` - Entrar em sala existente
- `/room/:code` - Sala (adicionar filmes e sortear)

## 🔐 Autenticação

O frontend usa JWT armazenado em `localStorage`:
- Token válido por 2 horas
- Renovação automática não implementada
- Logout ao expirar ou sair

## 🎯 Funcionalidades

✅ Criar sala e gerar código único  
✅ Entrar em sala com código  
✅ Adicionar filmes (título + ano)  
✅ Ver participantes em tempo real  
✅ Sortear vencedor aleatoriamente (apenas host)  
✅ Polling automático (3 segundos)  
✅ Rotas protegidas  
✅ Feedback visual (loading, errors)  

## 🔄 Integração com Backend

Base URL configurada em `.env`:
```
VITE_API_URL=http://localhost:3333
```

Endpoints utilizados:
- `POST /api/v1/rooms` - Criar sala
- `POST /api/v1/rooms/join` - Entrar
- `GET /api/v1/rooms/:code` - Buscar sala
- `POST /api/v1/rooms/:code/movies` - Adicionar filme
- `POST /api/v1/rooms/:code/finish` - Finalizar

## 📱 Responsivo

Interface adaptada para:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)

## 🎨 Design System

Cores principais:
- Primary: `#667eea`
- Secondary: `#764ba2`
- Success: `#48bb78`
- Danger: `#e74c3c`

## 🐛 Troubleshooting

### Erro de conexão com backend
```bash
# Verificar se backend está rodando
curl http://localhost:3333/api/v1/rooms

# Verificar .env
cat .env
```

### Erro ao instalar dependências
```bash
# Limpar cache
rm -rf node_modules package-lock.json
npm install
```

## 📄 Licença

MIT