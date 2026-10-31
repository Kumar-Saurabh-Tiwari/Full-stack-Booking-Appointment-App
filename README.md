# Booking Appointment App

Simple frontend and backend app for registering users with:

- UserName
- Phone Number
- Email

## Run

```bash
npm install
npm start
```

Open `http://localhost:3000`.

MySQL must be running. Copy `.env.example` to `.env` and add your database settings. The database and `User` table are created automatically.

## API

- `POST /api/users` - Add a user
- `GET /api/users` - Get all users
- `DELETE /api/users/:id` - Delete a user
