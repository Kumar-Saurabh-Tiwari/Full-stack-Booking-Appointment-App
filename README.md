# Simple user registration app

A plain HTML, CSS, and JavaScript booking appointment app backed by a small Express and MySQL API. It supports registering, listing, and deleting users.

## Run it

1. Install MySQL and make sure it is running.
2. Copy `.env.example` to `.env` and update the database values if needed.
3. Run `npm install`.
4. Run `npm start`.
5. Open `http://localhost:3000`.

The server creates the configured database and the `User` table automatically. The default database is `booking_app`; no manual SQL is required. Each user has a `username`, `phone`, and `email`.

API endpoints:

- `POST /api/users` creates a user.
- `GET /api/users` returns all users.
- `DELETE /api/users/:id` deletes one user.

The frontend uses `express.json()` on the backend, so body-parser is not needed.
