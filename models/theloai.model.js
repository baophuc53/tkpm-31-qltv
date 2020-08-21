const db = require('../utils/db');

module.exports = {
    all: () => db.load('select * from theloai'),
    single: async id => {
        ret = await db.load(`select * from theloai where Matheloai = ${id}`);
        return ret[0]
    },
    getIdByCatName: async Tentheloai =>{
        ret = await db.load(`select * from theloai where Tentheloai = '${Tentheloai}'`);
        return ret[0];
    },
    add: entity => db.add('theloai', entity),
    del: id => db.del('theloai', { Tentheloai: id }),
    patch: entity => {
        const condition = { Tentheloai: entity.Tentheloai };
        delete entity.Tentheloai;
        return db.patch('theloai', entity, condition);
    },

    allWithDetails: _ => {
        const sql = `
      select c.Matheloai, c.Tentheloai, count(p.Masach) as num_of_sachs
      from theloai c left join sachs p on c.Matheloai = p.Matheloai
      group by c.Matheloai, c.CatName`;
        return db.load(sql);
    },
};