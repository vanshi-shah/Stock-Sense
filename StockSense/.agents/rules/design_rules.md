# Design & Aesthetics Rules

When working on the frontend of this project, you MUST adhere to the following design standards. These apply to all AI code generation, UI tweaks, and new components added by any teammate:

## 1. Prioritize Visual Excellence
- **Rich Aesthetics**: The user should be wowed at first glance. Use best practices in modern web design to create a stunning first impression.
- **Premium Feel**: Avoid creating simple, basic "minimum viable products". Ensure the design feels premium and state-of-the-art.
- **Curated Colors**: Avoid generic HTML colors (e.g., plain red, blue, green). Always use curated, harmonious color palettes, specifically the HSL CSS variables established in `index.css`.
- **Modern Typography**: Use modern, clean typography (e.g., Inter, Roboto, or Outfit) and maintain proper heading hierarchy.

## 2. Dynamic & Interactive Design
- **Micro-Animations**: Add subtle micro-animations and smooth CSS transitions (`transition-all duration-200`) on interactive elements (buttons, cards, toggles).
- **Hover Effects**: An interface should feel responsive and alive. Achieve this with scale effects, subtle border glows, or background brightness changes on hover.
- **Glassmorphism & Depth**: Utilize subtle shadows, backdrop blurs (where appropriate), and clean borders to establish visual hierarchy.

## 3. Dual-Theme Compliance
- **Never Hardcode Colors**: Do not use hardcoded Tailwind color utilities (e.g., `bg-white`, `text-black`, `bg-gray-100`).
- **Use Semantic Tokens**: Always use semantic background and foreground utilities (e.g., `bg-background`, `bg-card`, `text-foreground`, `border-border`) so that all new components automatically support the Side-by-Side Dual Theme view (Light/Dark mode) perfectly.
