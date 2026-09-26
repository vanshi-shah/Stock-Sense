# Design System Guidelines

Before creating any UI:

1. Read DESIGN_SYSTEM.md
2. Reuse existing components
3. Follow typography
4. Follow spacing
5. Follow color tokens
6. Follow responsive rules
7. Do not create duplicate components

## Colors
- We use standard `shadcn/ui` color variables (e.g., `bg-background`, `text-primary`, `border-border`).
- Do not hardcode colors unless absolutely necessary.

## Typography
- Use Inter font by default.
- Headers: `text-2xl font-bold tracking-tight`
- Subtext: `text-sm text-muted-foreground`

## Components
- Component gallery available at `/components` route.
- Always check there before building a new button, input, or card.
