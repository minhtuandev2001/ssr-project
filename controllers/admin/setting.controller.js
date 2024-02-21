const SettingGenneral = require("../../models/settings-general.model")

// [GET] /admin/setting/general 
const general = async (req, res) => {
  const settingGeneral = await SettingGenneral.findOne({})
  res.render(`admin/pages/settings/general`, {
    titlePage: "Cài đặt chung",
    settingGeneral: settingGeneral
  })
}

// [POST] /admin/settings/general 
const generalPatch = async (req, res) => {
  try {
    const existSettingGeneral = await SettingGenneral.findOne({})
    // kiểm tra tồn tại settingGenneral chưa
    if (existSettingGeneral) {
      await SettingGenneral.updateOne({ _id: existSettingGeneral.id }, req.body)
    } else {
      const settingGeneral = new SettingGenneral(req.body)
      await settingGeneral.save()
    }
    req.flash("success", "Cập nhật thành công!")
  } catch (error) {
    console.log(error)
    req.flash("success", "Cập nhật thất bại!")
  }
  res.redirect("back")
}

module.exports = {
  general,
  generalPatch
}