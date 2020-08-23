const db = require('../utils/db');

module.exports = {
    all:()=>db.load("select * from category"),
    add:(entity)=>db.add('category',entity),
    single:async (id) => {
        cat = await db.load(`select * from category where id=\"${id}\"`);
        return cat[0];
    },
    del: CatId => db.del('category', {id: CatId}),
    patch: entity => {
        const condition = { id: entity.id };
        delete entity.id;
        return db.patch('category', entity, condition);
    },
};