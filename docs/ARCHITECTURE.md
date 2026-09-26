# Architecture

             React + Vite
                  ↓
            REST API
                  ↓
            Node.js (Express)
                  ↓
               Prisma
                  ↓
             PostgreSQL

## Component Architecture

- Frontend components are physically separated by domain feature to avoid merge conflicts.
- Backend routing routes strictly flow: `Router -> Controller -> Service -> DB`
