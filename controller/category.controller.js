const bookModel = require('../models/book.model');
const config = require('../config/default.json');
module.exports = {
    showbookByCat: async(req, res) => {
        const name = req.params.name;
        const limit = config.paginate.limit;

        const page = req.query.page || 1;
        if (page < 1) page = 1;
        const offset = (page - 1) * limit;

        const [total, rows] = await Promise.all([
            bookModel.countByCat(name),
            bookModel.pageByCat(name, offset)
        ]);

        // const total = await bookModel.countByCat(id);
        let nPages = Math.floor(total / limit);
        if (total % limit > 0) nPages++;
        const page_numbers = [];
        for (i = 1; i <= nPages; i++) {
            page_numbers.push({
                value: i,
                isCurrentPage: i === +page
            })
        }
        res.render('booklist', {
            title: name,
            name,
            book: rows,
            empty: rows.length === 0,
            page_numbers,
            curr_value: +page,
            prev_value: +page - 1,
            next_value: +page + 1,
        });
    }

}