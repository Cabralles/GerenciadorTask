# 📋 Task Manager - Gerenciador de Tarefas Externas

> Um gerenciador de tarefas moderno para empresas, exibindo itens pendentes como OS e avisos importantes.

**Stack Recomendado:**
- **Frontend:** React 19 + Vite + shadcn/ui
- **Backend:** FastAPI (Python)
- **Banco:** PostgreSQL
- **Auth:** JWT
- **Deploy:** Vercel + Railway

---

## ✅ **STATUS DO PROJETO**

### 🟢 **CONCLUÍDO (100%)**

#### Backend
- ✅ Estrutura de diretórios (`app/core`, `app/models`, `app/routes`, `app/schemas`)
- ✅ Configurações com variáveis de ambiente (`config.py`)
- ✅ Modelos SQLAlchemy:
  - `User` - Usuários do sistema
  - `Task` - Tarefas e OS
  - Estrutura pronta para `Notification`
- ✅ Schemas Pydantic para validação
- ✅ Rotas base:
  - `/api/auth` - Autenticação com JWT
  - `/api/tasks` - Gerenciamento de tarefas
  - `/api/users` - Gerenciamento de usuários
- ✅ Sistema de segurança:
  - Hash de senhas com Bcrypt
  - Tokens JWT
  - CORS configurado
- ✅ Database setup com SQLAlchemy

#### Frontend
- ✅ Vite + React 19 configurado
- ✅ Components UI completos (shadcn/ui - 30+ componentes)
- ✅ Serviços de API:
  - `api.ts` - Cliente HTTP com axios
  - `auth.ts` - Autenticação
  - `tasks.ts` - Operações de tarefas
  - `users.ts` - Operações de usuários
- ✅ Contexto de Autenticação (`AuthContext.tsx`)
- ✅ Main.tsx com AuthProvider
- ✅ Estilos Tailwind CSS
- ✅ Temas customizados

---

## 🔴 **O QUE FALTA (CRÍTICO)**

### 1. **Base de Dados (PostgreSQL)**
- ❌ Docker Compose para PostgreSQL local
- ❌ Script de inicialização do banco
- ❌ Alembic setup para migrations
- ❌ Seed de dados (usuário admin, tarefas teste)

**Arquivo faltando:** `docker-compose.yml`

### 2. **Backend - Complementos**
- ❌ Instalar dependências: `pip install -r requirements.txt`
- ❌ Configurar `.env` do backend
- ❌ Modelo completo de `Notification` (avisos importantes)
- ❌ Rota `/api/notifications` para avisos
- ❌ Testes das rotas
- ❌ Documentação Swagger/OpenAPI (automática com FastAPI)

**Dependências:** Ver `requirements.txt`

### 3. **Frontend - Integração**
- ❌ Instalar dependências: `npm install` ou `pnpm install`
- ❌ Conexão dos componentes ao backend
- ❌ Formulário de Login/Registro funcional
- ❌ Modal CRUD de tarefas
- ❌ Loading states e error handling
- ❌ Interceptor de erros HTTP

**Componentes a conectar:**
- `Dashboard.tsx` - Listar tarefas
- `TaskCard.tsx` - Exibir tarefa
- `TaskModal.tsx` - Criar/editar tarefa
- `UserPanel.tsx` - Info do usuário

### 4. **Autenticação & Segurança**
- ❌ Rota de refresh token
- ❌ Proteção de rotas privadas
- ❌ Logout com limpeza de token
- ❌ Validação de token expirado

### 5. **Deploy & DevOps**
- ❌ Dockerfile para backend
- ❌ Dockerfile para frontend
- ❌ Docker Compose para produção
- ❌ Scripts de deployment

---

## 📊 **Resumo Visual**

```
┌─────────────────────────────────────────────┐
│  BACKEND                                    │
├─────────────────────────────────────────────┤
│ ✅ Estrutura              ✅ Segurança      │
│ ✅ Modelos                ✅ CORS            │
│ ✅ Rotas base             ❌ Migrations      │
│ ✅ Schemas                ❌ Docker          │
│ ✅ Config                 ❌ Banco (setup)   │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  FRONTEND                                   │
├─────────────────────────────────────────────┤
│ ✅ Vite + React           ✅ Estilos        │
│ ✅ Components             ✅ Contexto       │
│ ✅ Serviços API           ❌ Conexão        │
│ ✅ Temas                  ❌ CRUD           │
└─────────────────────────────────────────────┘
```

---

## 🎯 **Próximos Passos (Prioridade)**

1. **[CRÍTICO]** Criar `docker-compose.yml` → PostgreSQL rodando
2. **[CRÍTICO]** Configurar `.env` → Variáveis de ambiente
3. **[CRÍTICO]** `pip install -r requirements.txt` → Dependências Python
4. **[CRÍTICO]** Alembic migrations → Setup banco de dados
5. **[CRÍTICO]** `python run.py` → Backend rodando em `http://localhost:8000`
6. **[ALTO]** `npm install` → Dependências do frontend
7. **[ALTO]** Conectar componentes → Frontend buscando dados do backend
8. **[ALTO]** CRUD funcional → Criar, ler, atualizar, deletar tarefas
9. **[ALTO]** Autenticação → Login/Registro funcionando
10. **[MÉDIO]** Deploy → Railway (backend) + Vercel (frontend)

---

## 📁 **Estrutura do Projeto**

```
project/
├── backend/
│   ├── app/
│   │   ├── core/           # Configurações, DB, segurança
│   │   ├── models/         # SQLAlchemy models
│   │   ├── routes/         # Endpoints da API
│   │   ├── schemas/        # Pydantic schemas
│   │   └── main.py         # App FastAPI
│   ├── requirements.txt    # Dependências Python
│   └── run.py             # Script para rodar
│
├── src/                    # Frontend React
│   ├── app/
│   │   ├── components/     # Componentes React
│   │   ├── data/           # Dados mockados
│   │   └── App.tsx
│   ├── services/           # Serviços de API
│   ├── context/            # Contextos React
│   └── styles/             # CSS e Tailwind
│
├── docker-compose.yml      # ❌ FALTANDO
├── .env                    # ✅ Existe, mas incompleto
└── package.json            # ✅ Configurado
```

---

## 🚀 **Como Começar**

**Veja o arquivo `SETUP.txt` para instruções passo a passo!**

### Setup Rápido
```bash
# 1. Backend
cd backend
pip install -r requirements.txt
python run.py

# 2. Frontend (novo terminal)
npm install
npm run dev
```

---

## 📝 **Dependências Principais**

### Backend
- `fastapi` - Framework web
- `uvicorn` - Servidor ASGI
- `sqlalchemy` - ORM
- `psycopg2-binary` - Driver PostgreSQL
- `python-jose` - JWT
- `passlib` - Hash de senhas
- `pydantic` - Validação

### Frontend
- `react@19` - UI library
- `vite` - Build tool
- `tailwindcss` - Estilos
- `axios` - HTTP client
- `@radix-ui` - Componentes

---

## 🔗 **Links Úteis**

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [SQLAlchemy](https://www.sqlalchemy.org/)
- [React 19](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

---

## 👥 **Autor**

Gerenciador de Tarefas Moderno - 2026

---

**Última atualização:** 13/06/2026
