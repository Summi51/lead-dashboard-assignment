const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../middleware/auth");

const ADMIN_EMAIL = "admin@futeservices.com";
const ADMIN_PASSWORD = "admin123";


function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "8h" });
  return res.json({ token, user: { email } });
}

module.exports = { login };
