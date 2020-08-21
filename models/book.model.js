const db = require('../utils/db');
const config = require('../config/default.json');

module.exports = {
    all: () => db.load('select * from book'),
    countBycategory: async category => {
        const rows = await db.load(`select count(*) as total from book,category where category = book.id and category.name=\"${category}\"`)
        return rows[0].total;
    },
    pageBycategory: (category, offset) => db.load(`select * from book,category where category = book.id and category.name=\"${category}\" limit ${config.paginate.limit} offset ${offset}`),

    single: async id => {
        ret = await db.load(`select * from book where id = ${id}`);
        return ret[0]
    },
    properties: id => db.load(`select * from properties where book =${id}`),
    add: entity => db.add('book', entity),
    del: id => db.del('book', { id: id }),
    patch: entity => {

        const condition = { id: entity.id };
        delete entity.id;
        return db.patch('book', entity, condition);
    },
    search: async(key, offset) => {
        return await db.load(`select book.*,category.name 
                                            from book left join category on book.category=category.id
                                            where (match(name) against(\"${key}\")) OR (match(author) against(\"${key}\"))
                                            limit ${config.paginate.limit} offset ${offset}`)
    },
    countBySearch: async key => {
        ret = await db.load(`select count(*) as total
                            from book left join category on book.category=category.id
                            where (match(name) against(\"${key}\")) OR (match(author) against(\"${key}\"))`);
        return ret[0].total
    },
    getMaxId: async() => {
        ret = await db.load(`select MAX(id) + 1 as ID from book`);
        return ret[0];
    }

};