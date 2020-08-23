const db = require("../utils/db");
const config = require("../config/default.json");

module.exports = {
    all: ()=>db.load(`select * from params`),
    loadParam: async (name)=> {
        param = await db.load(`select * from params where name = \"${name}\"`);
        return param[0];  
    } 
};