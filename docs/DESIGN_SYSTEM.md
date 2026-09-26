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
- **Primary (Deep Charcoal)**: `#292B2A`
- **Secondary (Warm Sand)**: `#B7A58A`
- **Accent (Aged Copper)**: `#A66A4C`
- **Background (Warm Ivory)**: `#F5F2EC`
- **Card**: `#EAE6DE`
- **Text**: `#252525`
- **Muted**: `#73716C`

## Typography
- Use **Outfit** for headings and **Inter** for body text.
- Headers: `text-2xl font-bold tracking-tight`
- Subtext: `text-sm text-muted-foreground`

## Spacing
- `4px`   → tiny internal spacing
- `8px`   → icon ↔ text
- `12px`  → compact elements
- `16px`  → normal element spacing
- `24px`  → card padding / component gaps
- `32px`  → section separation
- `48px`  → major section separation
- `64px`  → page-level separation

## Components
- Component gallery available at `/components` route.
- Always check there before building a new button, input, or card.
