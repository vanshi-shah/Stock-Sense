# Frontend Guidelines

## Structure

```text
src/
├── components/   # Shared generic UI (Button, Card)
├── pages/        # Feature-specific pages (separated by domain)
│   ├── landing/
│   ├── dashboard/
│   └── featureA/
├── services/     # API calls
├── hooks/        # Custom React hooks
├── layouts/      # Dashboard and Page layouts
└── routes/       # React Router setup
```

## AI Instructions
- AI must NOT modify files in a feature folder unless explicitly asked to do so.
- Read `DESIGN_SYSTEM.md` before generating new UI.
