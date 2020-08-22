const db = require("../utils/db");
const config = require("../config/default.json");

module.exports = {
    loadParam: async (name)=> {
        param = await db.load(`select * from params where name = \"${name}\"`);
        return param[0];  
    }  
};