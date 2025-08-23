# Copilot Instructions for AI Agents

## Project Overview
- **Frameworks:** React Native (Expo), Expo Router, Tailwind CSS (Nativewind), React Native Reusables
- **Platforms:** iOS, Android, Web (Edge-to-edge enabled)
- **Architecture:**
  - App entry: `app/` directory, with routing via Expo Router
  - UI components: `components/ui/` (button, icon, text)
  - Shared logic: `lib/` (theme, utils)
  - Assets: `assets/images/`
  - Global styles: `global.css`, Tailwind config in `tailwind.config.js`

## Developer Workflows
- **Start Dev Server:**
  - `pnpm dev` (or `npm/yarn/bun dev`) launches Expo Dev Server
  - Use Expo CLI shortcuts: `i` (iOS), `a` (Android), `w` (Web)
- **Add Components:**
  - `npx react-native-reusables/cli@latest add [component]` (see README for details)
- **Deploy:**
  - Use Expo Application Services (EAS) for build, update, and submit

## Key Patterns & Conventions
- **Routing:**
  - File-based routing in `app/` (e.g., `index.tsx`, `_layout.tsx`, `+html.tsx`, `+not-found.tsx`)
- **Styling:**
  - Use Tailwind classes via Nativewind in JSX
  - Global styles in `global.css`
- **Component Usage:**
  - Prefer `components/ui/` for shared UI elements
  - Extend via CLI for new reusable components
- **TypeScript:**
  - Types defined in `expo-env.d.ts`, `nativewind-env.d.ts`, `tsconfig.json`

## Integration Points
- **React Native Reusables:**
  - Core UI library, added/updated via CLI
- **Nativewind:**
  - Tailwind CSS for React Native
- **Expo Router:**
  - Handles navigation and routing

## Example: Adding a Button
```tsx
import { Button } from '../components/ui/button';
<Button className="bg-blue-500 text-white">Click Me</Button>
```

## References
- See `README.md` for full setup, CLI usage, and deployment details
- Key configs: `package.json`, `tailwind.config.js`, `babel.config.js`, `metro.config.js`

---
**For AI agents:**
- Always use the CLI for adding components
- Follow file-based routing conventions in `app/`
- Use Tailwind classes for styling
- Reference shared UI from `components/ui/`
- Validate changes by running the dev server (`pnpm dev`)
