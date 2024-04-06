const bcrypt = require("bcrypt");

async function hashPassword(password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  hashPassword,
};
