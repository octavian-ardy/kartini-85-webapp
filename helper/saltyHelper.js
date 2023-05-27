const crypto = require("node:crypto");

function generateSalt() {
  return crypto.randomBytes(16).toString("hex");
}

function generateHashedPassword(pass, salt) {
  return crypto.pbkdf2Sync(pass, salt, 1000, 64, "sha512").toString("hex");
}

module.exports = { generateSalt, generateHashedPassword };
