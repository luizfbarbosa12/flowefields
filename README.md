# Flowerfields

An interactive React and Canvas 2D flower-field animation deployed on Firebase Hosting.

## Requirements

- Node.js 20 or newer
- pnpm 11.13.1

## Development

```bash
pnpm install
pnpm dev
```

The Vite development server prints the local URL after startup.

## Architecture

- `src/app/flower-field/flowerModel.ts` generates deterministic flower data.
- `src/app/flower-field/flowerMotion.ts` contains pure bloom, idle, and clear sampling.
- `src/app/flower-field/flowerRenderer.ts` renders sampled frames to Canvas 2D.
- `src/app/components/FlowerField.tsx` owns the RAF animation lifecycle.
- `src/app/hooks/useAnimationEnvironment.ts` owns resize, visibility, and motion preferences.
- `src/app/components/StaffButton.tsx` provides the accessible casting control.

## Quality Commands

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm validate
```

`pnpm validate` runs the complete local quality gate. Browser E2E tests are intentionally not configured because Playwright installation is unavailable in the current environment.

## Deployment

Firebase Hosting serves the production output from `dist` for project `flowerfields1205`.

Authenticate once with Firebase CLI, then run:

```bash
pnpm deploy
```

The deployment command runs the full validation gate before publishing Hosting. The live site is https://flowerfields1205.web.app.
