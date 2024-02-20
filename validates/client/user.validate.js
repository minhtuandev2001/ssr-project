
const registerPost = (req, res, next) => {
  if (!req.body.fullName) {
    req.flash("error", "Hãy nhập tên của bạn")
    res.redirect('back')
    return
  }
  if (!req.body.email) {
    req.flash("error", "Hãy nhập email của bạn")
    res.redirect('back')
    return
  }
  if (!req.body.password) {
    req.flash("error", "Hãy nhập password của bạn")
    res.redirect('back')
    return
  }
  next();
}
const loginPost = (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", "Hãy nhập email của bạn")
    res.redirect('back')
    return
  }
  if (!req.body.password) {
    req.flash("error", "Hãy nhập password của bạn")
    res.redirect('back')
    return
  }
  next();
}

const forgotPasswordPost = (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", "Hãy nhập email của bạn")
    res.redirect('back')
    return
  }
  next();
}

const otpPasswordPost = (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", "Hãy nhập email của bạn")
    res.redirect('back')
    return
  }
  if (!req.body.otp) {
    req.flash("error", "Hãy nhập mã otp")
    res.redirect('back')
    return
  }
  next();
}

module.exports = {
  registerPost,
  loginPost,
  forgotPasswordPost,
  otpPasswordPost
}