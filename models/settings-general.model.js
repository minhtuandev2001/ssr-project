const mongoose = require("mongoose");

const settingGenneralSchema = mongoose.Schema({
  websiteName: { type: String },
  logo: { type: String },
  phone: { type: String },
  email: { type: String },
  address: { type: String },
  coppyright: { type: String },
  map: { type: String }
}, {
  timestamps: true
})

const SettingGenneral = mongoose.model("SettingGenneral", settingGenneralSchema, "settings-genneral")
module.exports = SettingGenneral