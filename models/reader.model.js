const db = require("../utils/db");
const config = require("../config/default.json");

module.exports = {
    all: ()=>db.load(`select * from reader`),
    add:(entity)=>db.add('reader',entity),
    single:async (id) => {
        reader = await db.load(`select * from reader where id=\"${id}\"`);
        return reader[0];
    },
    patch:(entity)=>{
        const condition={id:entity.id}
        delete entity.id
        return db.patch('reader',entity,condition)
    }
};