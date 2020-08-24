const db = require("../utils/db");
const config = require("../config/default.json");

module.exports = {
  all: () => db.load(`select * from borrow`),
  allWithReaderName: () =>
    db.load(
      `select borrow.*, fullname from borrow, reader where borrow.reader = reader.id`
    ),
  add: (entity) => db.add("borrow", entity),
  single: async (id) => {
    borrow = await db.load(`select * from borrow where id=\"${id}\"`);
    return borrow[0];
  },
  singleWithReaderName: async (id) => {
    borrow = await db.load(`select borrow.*, fullname from borrow, reader where borrow.id=\"${id}\" 
                                    and borrow.reader = reader.id`);
    return borrow[0];
  },

  borrowBooksById: (id) =>
    db.load(`select book.* from borrow_book ,book
                                where book.id=borrow_book.book and borrow_book.borrow=\"${id}\"`),

  patch: (entity) => {
    const condition = { id: entity.id };
    delete entity.id;
    return db.patch("borrow", entity, condition);
  },
};
