# Plánovač chaty

Skupinový kalendár na plánovanie termínov. Každý si označní dni kedy môže / nemôže ísť.

## Nasadenie na Vercel

### 1. GitHub repozitár
- Vytvor nový repozitár na GitHub (napr. `chata-planovac`)
- Nahraj všetky súbory tohto projektu

### 2. Vercel projekt
- Prihlás sa na [vercel.com](https://vercel.com)
- Klikni **Add New → Project**
- Vyber tvoj GitHub repozitár
- Klikni **Deploy** (bez zmien nastavení)

### 3. Postgres databáza
- V dashboarde Vercelu prejdi na tvoj projekt → záložka **Storage**
- Klikni **Create Database → Postgres**
- Pomenuj ju napr. `chata-db`
- Klikni **Connect** — Vercel automaticky nastaví environment premenné

### 4. Redeploy
- Po pripojení databázy klikni na **Deployments → Redeploy**
- Hotovo! Tabuľky sa vytvoria automaticky pri prvej návšteve.

## Štruktúra

```
chata-planovac/
├── api/
│   ├── users.js    ← GET/POST používateľov
│   └── votes.js    ← GET/POST/DELETE hlasov
├── index.html      ← frontend
├── package.json
└── README.md
```

## Ako to funguje

- `/api/users` — ukladá mená a farby účastníkov
- `/api/votes` — ukladá hlasy (môžem/nemôžem) pre každý deň
- Frontend sa každých 30 sekúnd aktualizuje
- Tabuľky v DB sa vytvoria automaticky pri prvom volaní API
