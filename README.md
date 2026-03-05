# Jafet Duarte — AI Portfolio

An AI-powered portfolio website where visitors can chat with an AI assistant to learn about Jafet's skills, experience, education, and projects.

## Tech Stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS v4
- **Backend:** Node.js + Express + TypeScript
- **Database:** Supabase (PostgreSQL) + Prisma ORM
- **AI:** Groq API (Llama 3 70B)

## Architecture

```
User → React Chat UI → Express API → Groq AI (with Supabase data context) → Response → UI
```

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account (database already configured)
- Groq API key

### 1. Backend Setup
```bash
cd backend
npm install
```

Edit `.env` and replace `YOUR_PASSWORD` with your Supabase database password.

```bash
# Push schema to Supabase
npx prisma db push

# Seed database with portfolio data
npm run db:seed

# Start development server
npm run dev
```

Backend runs at `http://localhost:3001`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` (auto-proxies `/api` to backend)

## Project Structure

```
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── ui/              # Particle background, Navbar
│       │   ├── Chat/            # ChatWindow, ChatInput, Message
│       │   └── Portfolio/       # Hero, Experience, Skills, Contact
│       ├── App.tsx
│       └── index.css
│
├── backend/
│   ├── src/
│   │   ├── routes/chat.ts       # POST /api/chat
│   │   ├── services/
│   │   │   ├── groq.service.ts  # AI with system prompt
│   │   │   └── context.service.ts
│   │   └── index.ts             # Express server
│   └── prisma/
│       ├── schema.prisma        # 6 models
│       └── seed.ts              # Portfolio data
```

## Deployment

- **Frontend:** Vercel
- **Backend:** Railway or Render
