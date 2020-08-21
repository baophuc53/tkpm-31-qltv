const db = require('../utils/db');

module.exports = {
    all: () => db.load('select * from category'),
    single: async id => {
        ret = await db.load(`select * from category where id = ${id}`);
        return ret[0]
    },
    getIdByname: async name =>{
        ret = await db.load(`select * from category where name = '${name}'`);
        return ret[0];
    },
    add: entity => db.add('category', entity),
    del: id => db.del('category', { name: id }),
    patch: entity => {
        const condition = { name: entity.name };
        delete entity.name;
        return db.patch('category', entity, condition);
    },

    allWithDetails: _ => {
        const sql = `
      select c.id, c.name, count(p.id) as num_of_book
      from category c left join book p on c.id = p.id
      group by c.id, c.name`;
        return db.load(sql);
    },
};