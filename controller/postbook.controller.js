const bookModel = require('../models/book.model');
const categoryModel = require('../models/category.model');

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

module.exports = {
    postbook: async (req, res) => {
        const entity = req.body;
        entity.Seller = req.session.authUser;
        var now = new Date();
        entity.StartTime = now;
        entity.EndTime = now.addDays(7);
        const category = await categoryModel.getIdByname(entity.name);
        entity.category = category.id;
        entity.id = (await bookModel.getMaxId()).ID;
        delete entity.name;
        const add = bookModel.add(entity);
    }

}