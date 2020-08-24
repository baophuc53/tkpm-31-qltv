const db = require("../utils/db");
const config = require("../config/default.json");

module.exports = {
  all: () => db.load(`select * from borrow_book`),
  add: (entity) => db.add("borrow_book", entity),
  del: (condition) => db.del("borrow_book", condition),
};
