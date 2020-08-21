const db = require('../utils/db');
const config = require('../config/default.json');

module.exports = {
    all: () => db.load('select * from sach'),
    countByTheLoai: async Tentheloai => {
        const rows = await db.load(`select count(*) as total from sach,theloai where Theloai = Matheloai and Tentheloai=\"${Tentheloai}\"`)
        return rows[0].total;
    },
    pageByTheLoai: (Tentheloai, offset) => db.load(`select * from sach,theloai where Theloai = Matheloai and Tentheloai=\"${Tentheloai}\" limit ${config.paginate.limit} offset ${offset}`),

    single: async id => {
        ret = await db.load(`select * from sach where Masach = ${id}`);
        return ret[0]
    },
    properties: id => db.load(`select * from properties where Sach =${id}`),
    popular: _ => db.load(`select * from sach
                            where NOW() < sach.EndTime 
                            order by BorrowTime desc limit 5`),
    add: entity => db.add('sach', entity),
    del: id => db.del('sach', { Masach: id }),
    patch: entity => {

        const condition = { Masach: entity.Masach };
        delete entity.Masach;
        return db.patch('sach', entity, condition);
    },
    search: async(key, offset) => {
        return await db.load(`select sach.*,Tentheloai 
                                            from sach left join theloai on sach.Theloai=theloai.Matheloai
                                            where (match(Tensach) against(\"${key}\")) OR (match(Tacgia) against(\"${key}\"))
                                            limit ${config.paginate.limit} offset ${offset}`)
    },
    countBySearch: async key => {
        ret = await db.load(`select count(*) as total
                            from sach left join theloai on sach.Theloai=theloai.Matheloai
                            where (match(Tensach) against(\"${key}\")) OR (match(Tacgia) against(\"${key}\"))`);
        return ret[0].total
    },
    getWinningSachByUser: user => db.load(`select * from sach where EndTime<NOW() and PriceHolder=\"${user}\" and Status=0`),
    getSachByUserCart: user => db.load(`select sach.* from sach,carts where Masach=Sach and User=\"${user}\" and carts.Status=0`),
    getFavoriteSachByUser: user => db.load(`select sach.* from sach,favorites where Masach=Sach and User=\"${user}\"`),
    getSachByUserHistoryBidder: Madocgia => db.load(`select distinct sach.* from sach,sachmuon where Masach=Sach and Bidder=\"${Madocgia}\"`),
    getSachBySeller: user => db.load(`select sach.* from sach where Seller=\"${user}\"`),
    getMaxId: async() => {
        ret = await db.load(`select MAX(Masach) + 1 as ID from sach`);
        return ret[0];
    }

};