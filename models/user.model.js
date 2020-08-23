const db = require("../utils/db");
const config = require("../config/default.json");

module.exports = {
  all:()=>db.load("select * from user"),
  single: async (username) => {
    user = await db.load(`select * from user where username=\"${username}\"`);
    return user[0];
  },
};
