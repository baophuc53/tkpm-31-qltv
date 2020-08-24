const db = require("../utils/db");
const config = require("../config/default.json");

module.exports = {
  all: () => db.load(`select * from book`),
  add: (entity) => db.add("book", entity),
  patch: (entity) => {
    const condition = { id: entity.id };
    delete entity.id;
    return db.patch("book", entity, condition);
  },
  del: (condition) => db.del("book", condition),
  single: async (id) => {
    res = await db.load(`select * from book where id=${id}`);
    return res[0];
  },
  search: (param) =>db.load(`select * from  book where match(name) against(\"${param}\") 
                              or match (author) against (\"${param}\")`)
};
