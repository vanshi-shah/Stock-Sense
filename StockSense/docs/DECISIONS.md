# Decisions

This file tracks important architecture and tool decisions to prevent the AI from introducing random dependencies later.

## [Date]
- **Decision:** Use PostgreSQL + Prisma for DB, custom JWT for Auth in Node.js.
- **Reason:** Supabase is not allowed for this hackathon. PostgreSQL ensures full control and compatibility with Prisma.
