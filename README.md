# Doc-Doc

AI-powered skin glow and hair growth wellness assistant with a futuristic neon dashboard, daily task tracking, analytics, reminders, and an AI wellness coach.

## Structure

- `client/` React + Vite frontend
- `server/` Node + Express + Prisma backend

## Run locally

1. Install dependencies in both apps.
2. Configure `server/.env` and `client/.env`.
3. Start the backend and frontend dev servers.

## API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/tasks/today`
- `PATCH /api/tasks/update`
- `GET /api/tasks/history`
- `GET /api/analytics/weekly`
- `GET /api/analytics/monthly`
- `GET /api/analytics/streak`
- `POST /api/ai/chat`
- `GET /api/ai/history`

## Notes

- AI calls use Ollama with `mistral` by default.
- The assistant is intentionally framed as a wellness coach, not a medical provider.

## Deployment

- Frontend: Vercel
- Backend: Render
- Database: Neon PostgreSQL

### Environment variables

Frontend:

- `VITE_API_URL`

Backend:

- `PORT`
- `DATABASE_URL`
- `JWT_SECRET`
- `OLLAMA_URL`
- `OLLAMA_MODEL`
- `APP_TIMEZONE`
- `CORS_ORIGIN`
