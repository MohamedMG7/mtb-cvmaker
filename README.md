# MTB-cvMaker

MTB-cvMaker is a free and open-source CV/resume builder built with `React` and `TypeScript`.

The goal is simple: give people a high-quality resume tool without subscriptions, locked exports, or paywalled templates.

## Current Features

- Local-first editing with autosave in the browser
- Live preview while editing
- Multiple templates, including a Cambridge-inspired academic layout
- Export to `PDF`
- Export to `DOCX`
- Import and export resume data as `JSON`
- Core resume sections plus advanced sections like certifications, awards, publications, volunteer work, languages, references, and custom sections

## Tech Stack

- `React`
- `TypeScript`
- `Vite`
- `Zustand`
- `Zod`
- `Dexie`
- `docx`
- `@react-pdf/renderer`

## Getting Started

### Requirements

- `Node.js` 20+ recommended
- `npm`

### Install

```bash
npm install
```

### Run the app

```bash
npm run dev
```

By default, the Vite dev server runs on:

```txt
http://localhost:5173
```

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Project Goals

- Make CV creation free and accessible
- Keep the product advanced but easy to use
- Support polished templates and reliable exports
- Stay privacy-friendly and local-first by default
- Build in public as an open-source project

## Project Docs

- Product requirements: `PRD.md`
- Technical plan: `TECHNICAL_PRD.md`
- Implementation checklist: `TASKLIST.md`
- Community standards: `CODE_OF_CONDUCT.md`

## Project Structure

```txt
src/
  app/
  features/
    editor/
    export/
    persistence/
    preview/
  lib/
    schema/
```

## Export Notes

- `PDF` export is generated as a direct download with real text and clickable links
- Each template owns its own PDF renderer so export layout can stay close to the preview design
- `DOCX` export currently includes a Cambridge-style export path
- Resume data is stored locally in the browser unless the user exports it

## Contributing

Contributions are welcome.

Good areas to help with:

- new templates
- export fidelity improvements
- drag-and-drop section ordering
- accessibility improvements
- tests
- documentation

Before contributing, please read `CODE_OF_CONDUCT.md`.

## Roadmap Highlights

- Better multi-page PDF handling and export fidelity
- Additional template variants
- More editor controls for ordering and layout density
- Improved testing and contributor tooling

## License

This project is licensed under `MIT`, as declared in `package.json`.
