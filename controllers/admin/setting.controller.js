const SettingGenneral = require("../../models/settings-general.model")

// [GET] /admin/setting/general 
const general = async (req, res) => {
  const settingGeneral = await SettingGenneral.findOne({})
  res.render(`admin/pages/settings/general`, {
    siderTitle: "setting",
    titlePage: "General settings",
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
    req.flash("success", "Update successful!")
  } catch (error) {
    console.log(error)
    req.flash("success", "Update failed!")
  }
  res.redirect("back")
}

module.exports = {
  general,
  generalPatch
}