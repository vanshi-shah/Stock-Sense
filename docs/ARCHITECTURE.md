# Architecture

              React + Vite
                   ↓
              Supabase MCP 
         (Database, Auth, API)
                   ↓
              PostgreSQL 

## Component Architecture

- **Frontend:** React + Vite, Tailwind CSS, shadcn/ui.
- **Backend & Database:** Supabase MCP handling Auth, Database (PostgreSQL).
- **State Management:** React Context / Zustand or React Query for fetching data from Supabase.
- Frontend components are physically separated by domain feature to avoid merge conflicts.
- **Data Flow:** UI components -> Supabase Client -> PostgreSQL (with RLS for security).
