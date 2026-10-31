const { pool } = require("../db");

function validateUser(body) {
  const username = typeof body.username === "string" ? body.username.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";

  if (!username || username.length > 80) {
    return { error: "Username is required and must be 80 characters or fewer." };
  }
  if (!phone || phone.length > 20) {
    return { error: "Phone number is required and must be 20 characters or fewer." };
  }
  if (!email || email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "A valid email is required." };
  }

  return { username, phone, email };
}

async function createUser(req, res, next) {
  try {
    const user = validateUser(req.body);
    if (user.error) {
      return res.status(400).json({ error: user.error });
    }

    const [result] = await pool.execute(
      "INSERT INTO User (username, phone, email) VALUES (?, ?, ?)",
      [user.username, user.phone, user.email]
    );
    const [rows] = await pool.execute(
      "SELECT id, username, phone, email, created_at FROM User WHERE id = ?",
      [result.insertId]
    );

    return res.status(201).json(rows[0]);
  } catch (error) {
    return next(error);
  }
}

async function getUsers(req, res, next) {
  try {
    const [rows] = await pool.query(
      "SELECT id, username, phone, email, created_at FROM User ORDER BY id DESC"
    );
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    const userId = Number(req.params.id);
    if (!Number.isInteger(userId) || userId < 1) {
      return res.status(400).json({ error: "User ID must be a positive number." });
    }

    const [result] = await pool.execute("DELETE FROM User WHERE id = ?", [userId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = { createUser, getUsers, deleteUser };
