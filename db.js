const mysql = require("mysql2/promise");

const config = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_NAME || "booking_app",
};

const pool = mysql.createPool({
  ...config,
  waitForConnections: true,
  connectionLimit: 10,
});

async function initializeDatabase() {
  const setupConnection = await mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
  });

  await setupConnection.query(
    `CREATE DATABASE IF NOT EXISTS \`${config.database}\``
  );
  await setupConnection.end();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS User (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(80) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      email VARCHAR(120) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const [columns] = await pool.query(
    "SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'User'",
    [config.database]
  );
  const existingColumns = new Set(columns.map((column) => column.COLUMN_NAME));
  if (!existingColumns.has("username")) {
    await pool.query("ALTER TABLE User ADD COLUMN username VARCHAR(80)");
  }
  if (!existingColumns.has("phone")) {
    await pool.query("ALTER TABLE User ADD COLUMN phone VARCHAR(20)");
  }
  if (!existingColumns.has("email")) {
    await pool.query("ALTER TABLE User ADD COLUMN email VARCHAR(120)");
  }
  if (existingColumns.has("name")) {
    await pool.query("ALTER TABLE User MODIFY COLUMN name VARCHAR(80) NULL");
  }
  if (existingColumns.has("rating")) {
    await pool.query("ALTER TABLE User MODIFY COLUMN rating TINYINT NULL");
  }
}

module.exports = { pool, initializeDatabase };
