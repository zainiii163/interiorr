# Frontend presentation layer

React SPA — see `/docs/ARCHITECTURE.md` for full structure.

## Layers

```
pages/ → components/ → hooks/ → context/ → services/api.js → backend
```

## Commands

```bash
npm install
cp .env.example .env
npm run dev     # http://localhost:5173
```

## Routes

- Public site: `/`, `/services`, `/projects`, etc.
- Admin CMS: `/admin/*` (protected)
