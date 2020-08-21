const sachModel = require('../models/book.model');
const config = require('../config/default.json');
module.exports = {
    showSachByCat: async(req, res) => {
        const catName = req.params.name;
        const limit = config.paginate.limit;

        const page = req.query.page || 1;
        if (page < 1) page = 1;
        const offset = (page - 1) * config.paginate.limit;

        const [total, rows] = await Promise.all([
            sachModel.countByCat(catName),
            sachModel.pageByCat(catName, offset)
        ]);

        rows.forEach(j => {
            
        });

        // const total = await sachModel.countByCat(catId);
        let nPages = Math.floor(total / limit);
        if (total % limit > 0) nPages++;
        const page_numbers = [];
        for (i = 1; i <= nPages; i++) {
            page_numbers.push({
                value: i,
                isCurrentPage: i === +page
            })
        }

        // const rows = await sachModel.pageByCat(catId, offset);
        res.render('sach', {
            title: catName,
            catName,
            sachs: rows,
            empty: rows.length === 0,
            page_numbers,
            prev_value: +page - 1,
            next_value: +page + 1,
        });
    }

}