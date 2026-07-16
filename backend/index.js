const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const leadRoutes = require("./routes/leads");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
require("dotenv").config();

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

app.use("/api", authRoutes);
app.use("/api/leads", leadRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong on the server." });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
