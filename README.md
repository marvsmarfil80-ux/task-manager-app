# Task Manager

A full-stack task and project management app built as a learning project — Next.js frontend + FastAPI backend, with real authentication, project/task CRUD, Kanban-style task boards, and multi-user task assignment.

## Features

- **Auth** — JWT-based login/register, `httpOnly` cookie sessions, bcrypt password hashing
- **Projects** — full CRUD, private or shared (shared projects can be edited by any logged-in user; only the owner can delete)
- **Tasks** — Kanban board (To Do / In Progress / Done), full CRUD, multi-user assignment
- **Team** — user management (add/edit/delete)
- **Dashboard** — live stats, recent projects/tasks, tasks-by-status chart
- Light/dark mode, responsive layout (mobile/tablet/desktop)

## Tech Stack

- **Next.js 16** (App Router, Turbopack), **TypeScript**, **Tailwind CSS v4**
- **shadcn/ui** (Base UI variant)
- **TanStack Query** — server state & caching
- **React Hook Form** + **Zod** — forms & validation
- **Lucide React** — icons, **Sonner** — toasts, **Recharts** — charts

Backend repo: [task_manager](https://github.com/marvsmarfil80-ux/task_manager) (FastAPI + PostgreSQL + SQLAlchemy + Alembic)

## Getting Started

### 1. Backend must be running first

This app expects a FastAPI backend at `http://localhost:8000`. See the backend repo for setup. Make sure its CORS config allows `http://localhost:3000`.

### 2. Environment variables

Create `.env.local` in the project root:

NEXT_PUBLIC_API_URL=http://localhost:8000


> Use `localhost`, not `127.0.0.1` — the two are treated as different sites by the browser, which breaks cookie-based auth between frontend and backend even on the same machine.

### 3. Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll be redirected to `/login` if you're not authenticated — register a new account or use existing seeded credentials from the backend.

## Project Structure

src/
├── app/
│ ├── (app)/ # Authenticated routes — shared sidebar/topbar layout
│ │ ├── page.tsx # Dashboard
│ │ ├── projects/
│ │ ├── tasks/
│ │ └── users/
│ ├── login/
│ └── register/
├── components/
│ ├── ui/ # shadcn primitives
│ ├── layout/ # Sidebar, Topbar, MobileSidebar
│ ├── dashboard/
│ ├── projects/
│ ├── tasks/
│ └── users/
├── hooks/ # TanStack Query hooks (one per resource)
├── lib/
│ ├── api-client.ts # Single typed fetch wrapper — all API calls go through here
│ └── validations/ # Zod schemas per form
└── types/ # Shared TypeScript types mirroring the backend schemas


## Notes

- All API requests use `credentials: "include"` so the browser sends the auth cookie on every call.
- Form validation schemas in `lib/validations/` are kept in sync with the backend's Pydantic schemas by hand — if the backend changes a field, update both sides.
