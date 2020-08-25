const db = require("../utils/db");
const config = require("../config/default.json");

module.exports = {
    all: ()=>db.load(`select * from params`),
    single:async(id)=>{
        const rows=await db.load(`select * from params where id=${id}`);
        return rows[0];
    },
    patch:(entity)=>{
        const condition = { id: entity.id };
        delete entity.id;
        return db.patch("params", entity, condition);
    }
    ,
    loadParam: async (name)=> {
        param = await db.load(`select * from params where name = \"${name}\"`);
        return param[0];  
    } 
};