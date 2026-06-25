# Contributing to svelte-voidmorphism

Thank you for your interest in contributing! This document outlines the process for contributing to this project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/svelte-voidmorphism.git`
3. Install dependencies: `npm install`
4. Start the dev server: `npm run dev`

## Development

- The library source is in `src/lib/`
- The demo/docs site is in `src/routes/`
- Tests are co-located with source files as `*.test.ts`

### Adding a New Transition

1. Create a new file in `src/lib/transitions/` (e.g., `myTransition.ts`)
2. Export a transition function and its options interface
3. Add the export to `src/lib/transitions/index.ts`
4. Add a demo entry in `src/routes/+page.svelte`
5. Write tests in a co-located `*.test.ts` file
6. Document it in `README.md`

### Transition Function Signature

```ts
import type { TransitionConfig } from 'svelte/transition';

export interface MyTransitionOptions {
  duration?: number;
  easing?: (t: number) => number;
  // ... custom options
}

export function myTransition(
  node: Element,
  options: MyTransitionOptions = {}
): TransitionConfig {
  return {
    duration: options.duration ?? 600,
    easing: options.easing,
    css: (t: number) => {
      // Return CSS string based on progress t (0 to 1)
      return `opacity: ${t}; transform: scale(${t});`;
    }
  };
}
```

## Testing

```bash
npm test          # Run tests once
npm run test:watch # Run tests in watch mode
npm run test:coverage # Run with coverage report
```

## Type Checking

```bash
npm run check
```

## Building

```bash
npm run package  # Build the library for npm
```

## Pull Request Process

1. Create a feature branch: `git checkout -b feature/my-new-transition`
2. Make your changes and commit: `git commit -m 'feat: add myNewTransition'`
3. Push to your fork: `git push origin feature/my-new-transition`
4. Open a Pull Request

### Commit Convention

We use [conventional commits](https://www.conventionalcommits.org/):

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation changes
- `refactor:` code refactoring
- `test:` test changes
- `chore:` build/tooling changes

## Code Style

- Use TypeScript for all new files
- Follow the existing code style (tabs, single quotes)
- Export interfaces for all option types
- Document options with JSDoc comments
- No external dependencies — transitions should use pure CSS

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
