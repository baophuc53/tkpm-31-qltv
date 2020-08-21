const db = require('../utils/db');

module.exports = {
    all: () => db.load('select * from nguoi dung'),
    singleByUserName: async username => {
        const rows = await db.load(`select * from nguoidung where Username = '${username}'`);
        if (rows.length === 0)
            return null;
        return rows[0];
    },
    singleByEmail: async email => {
        const rows = await db.load(`select * from nguoidung where Email = '${email}'`);
        if (rows.length === 0)
            return null;
        return rows[0];
    },
    add: entity => db.add('nguoidung', entity),
    patch: entity => {
        const condition = { Username: entity.Username };
        delete entity.Username;
        return db.patch('nguoidung', entity, condition);
    }
    
}