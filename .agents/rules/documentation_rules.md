# Documentation Maintenance Rules

When working in this project, you MUST prioritize and maintain the documentation located in the `docs/` directory (`DEMO_FLOW.md`, `DECISIONS.md`, `DATABASE.md`, `ARCHITECTURE.md`, `API_CONTRACT.md`, etc.).

## 1. Always Read the Docs First
- Before implementing features, making architectural changes, or altering the database/API, always check and follow the guidelines established in the respective `docs/` files.
- Treat the `docs/` folder as the ultimate source of truth for the project's state and intent.

## 2. Continuously Update the Docs
- Whenever you make changes to the API, Database Schema, Architecture, or Demo Flow, you MUST automatically update the corresponding markdown file in the `docs/` directory to reflect the new state.
- Do not let code and documentation drift out of sync.

## 3. Document Major Decisions
- If you make a significant technical choice or design decision, add a brief entry explaining the rationale to `docs/DECISIONS.md`.
