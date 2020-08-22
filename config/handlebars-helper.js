const hbs_sections = require("express-handlebars-sections");
const numeral = require("numeral");
const moment = require("moment");

module.exports = {
  switch: function (value, options) {
    this.switch_value = value;
    return options.fn(this);
  },
  case: function (value, options) {
    if (value == this.switch_value) {
      return options.fn(this);
    }
  },
  default: function (value, options) {
    return true; ///We can add condition if needs
  },
  section: hbs_sections(),
  Numberformat: (val) => {
    return numeral(val).format("0,0");
  },
  Percentformat: (val) => {
    if (val) return numeral(val).format("0.00%");
    return "__";
  },
  DateTimeFormat: (date) => moment(date).format("hh:mm A "),
  DateFormat:(date)=>moment(date).format("YYYY-MM-DD"),
  DateFormatShow:(date)=>moment(date).format("DD/MM/YYYY"),
};
