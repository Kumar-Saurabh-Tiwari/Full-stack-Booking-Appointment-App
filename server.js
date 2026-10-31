require("dotenv").config();

const express = require("express");
const userRoutes = require("./routes/userRoutes");
const { initializeDatabase } = require("./db");

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json());
app.use(express.static(__dirname));
app.use("/api/users", userRoutes);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: "Something went wrong on the server." });
});

initializeDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Could not initialize the database.", error);
    process.exitCode = 1;
  });
