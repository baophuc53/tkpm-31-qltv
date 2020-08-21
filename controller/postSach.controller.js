const sachModel = require('../models/book.model');
const theloaiModel = require('../models/theloai.model');

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

module.exports = {
    postSach: async (req, res) => {
        const entity = req.body;
        entity.Seller = req.session.authUser;
        var now = new Date();
        entity.StartTime = now;
        entity.EndTime = now.addDays(7);
        const theloai = await theloaiModel.getIdByCatName(entity.CatName);
        entity.Theloai = theloai.CatId;
        entity.SachID = (await sachModel.getMaxId()).ID;
        delete entity.CatName;
        const add = sachModel.add(entity);
    }

}