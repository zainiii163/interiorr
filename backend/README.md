# Backend application layer

Express REST API — see `/docs/ARCHITECTURE.md` for full structure.

## Layers

```
routes/ → middleware/ → controllers/ → services/ → models/ → MongoDB
```

## Commands

```bash
npm install
cp .env.example .env
npm run seed    # requires MongoDB
npm run dev     # http://localhost:5000
```

## API

Base: `http://localhost:5000/api/v1`

Health: `GET /health`
