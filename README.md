# Uber Charge+ (Vite + React + Tailwind)

A minimal local demo of the Uber Charge+ UI you shared.

## Prereqs
- Node.js LTS (>= 18)
- npm or pnpm/yarn
- IntelliJ IDEA (Ultimate recommended) with the **Node.js** plugin

## Run locally
```bash
npm install
npm run dev
```
The dev server opens on http://localhost:5173

## Open in IntelliJ
1. **File → Open...** and select this folder.
2. IntelliJ detects `package.json`. Click **Run 'dev'** or open **Terminal** and run `npm run dev`.
3. Optionally create a **Run Configuration → npm** for the `dev` script.

## Notes
- TailwindCSS is preconfigured (`tailwind.config.js`, `postcss.config.js`, `src/index.css`).
- Icons come from `lucide-react`.
- The UI uses mock data; replace with real charging APIs later.
