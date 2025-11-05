# E‑Commerce Platform (Node + SQLite + Stripe)

A modern, responsive e‑commerce starter with:
- Products CRUD (admin)
- Auth (JWT, bcrypt)
- Orders (COD + Stripe Checkout)
- SQLite (file-based, no external DB needed)
- Vanilla HTML/CSS/JS frontend

## Quick start

1) Install Node.js 18+.

2) Extract the zip. Open a terminal in the project root and install dependencies:

```bash
npm i
```

3) Copy env and start:

```bash
cp backend/.env.example backend/.env
# edit backend/.env, set JWT_SECRET and STRIPE_SECRET_KEY (test key)
npm run start
```


4) Admin login details
- Admin login: `admin@eshop.test` / `admin123`

## Notes

- Products are stored in SQLite at `backend/data.sqlite`.
- Stripe is optional: COD works without it. For Stripe test payments, use card `4242 4242 4242 4242`.
- Deploy to a single Node host (Railway, Render, VPS). This server serves the frontend statically and API on the same origin.
