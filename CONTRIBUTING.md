# Contributing to MTB-cvMaker

Thanks for your interest in contributing to MTB-cvMaker.

This project aims to be a free, open-source, high-quality CV builder, and contributions of different sizes are welcome.

## Before You Start

- Read `README.md` for local setup
- Read `CODE_OF_CONDUCT.md` before participating in the community
- Check existing issues or open a new one before starting large changes

## Local Setup

Install dependencies:

```bash
npm install
```

Run the app locally:

```bash
npm run dev
```

The dev server runs on Vite's default local port, usually `http://localhost:5173`.

## Development Workflow

1. Fork the repository
2. Create a branch for your change
3. Make your changes
4. Run checks locally
5. Open a pull request with a clear description

## Checks

Before submitting a pull request, run:

```bash
npm run lint
npm run build
```

## Good Contribution Areas

- new resume templates
- export fidelity improvements for `PDF` and `DOCX`
- accessibility improvements
- responsive UX polish
- section editing improvements
- tests and documentation
- bug fixes and schema migration improvements

## Pull Request Guidelines

- Keep pull requests focused and scoped
- Explain what changed and why
- Include screenshots or recordings for UI changes when possible
- Avoid unrelated refactors in the same PR
- Follow the existing code style and project structure

## Design and Product Notes

- Preserve the existing product direction unless the change intentionally improves it
- Keep the interface simple first, advanced second
- Export quality is a core feature, so changes affecting preview or export should be tested carefully
- For template work, maintain consistency between editor data, preview output, and export behavior

## Reporting Bugs

When reporting a bug, include:

- what you expected
- what happened instead
- steps to reproduce
- screenshots if relevant
- browser and OS details if the issue is UI or export related

## Suggesting Features

Feature requests are welcome. Please include:

- the problem you want to solve
- the user benefit
- a rough idea of the expected behavior

## Questions

If something is unclear, open an issue so discussion can happen in public and help future contributors too.
