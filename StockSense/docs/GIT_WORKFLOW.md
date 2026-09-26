# Git Workflow

To prevent merge conflicts during the 24 hours:

## Ownership
- **Member 1**: Owns `backend/`
- **Member 2**: Owns `frontend/src/components/`, `frontend/src/layouts/`, core UI.
- **Member 3**: Owns specific `frontend/src/pages/<feature>/` folders and integration services.

## Routing File
- **ONLY ONE PERSON** is allowed to modify the main router file (`frontend/src/App.tsx` or `routes.tsx`). Coordinate verbally before pushing changes to it.

## Branching
- Use feature branches (`feature/auth`, `feature/dashboard`).
- Merge often, but always test the build before pushing.
