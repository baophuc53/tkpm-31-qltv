const db = require("../utils/db");
const config = require("../config/default.json");

module.exports = {
  single: async (username) => {
    user = await db.load(`select * from user where username=\"${username}\"`);
    return user[0];
  },
};
