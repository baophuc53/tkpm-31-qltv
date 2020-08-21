const hbs_sections = require('express-handlebars-sections');
const numeral = require('numeral')
const moment = require('moment')

module.exports = {
    section: hbs_sections(),
    Numberformat: val => {
        return numeral(val).format('0,0')
    },
    Percentformat: val => {
        if (val)
            return numeral(val).format('0.00%');
        return "__";
    },
    DateTimeFormat: date => moment(date).format('hh:mm A DD/MM/YYYY'),
    EndTimeFormat: date => {
        if ((date - new Date()) < 0)
            return 'Sản Phẩm đã kết thúc';
        day = new Date(date - new(Date));
        ret = 'Còn ';
        if (day.getUTCFullYear() > 1970)
            return (ret += day.getUTCFullYear() - 1970 + ' năm ');

        if (day.getUTCMonth() > 1)
            return (ret += day.getUTCMonth() - 1 + ' tháng ');
        if (day.getUTCDate() > 1)
            return (ret += day.getUTCDate() - 1 + ' ngày ');
        if (day.getUTCHours() > 0)
            ret += day.getUTCHours() + ' giờ ';
        if (day.getUTCMinutes() > 0)
            ret += day.getUTCMinutes() + ' phút ';
        ret += day.getUTCSeconds() + ' giây ';
        return ret;
    }
}