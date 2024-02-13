// show alert
const alertSuccess = document.querySelector("[show-alert]")
if (alertSuccess) {
  const time = Number(alertSuccess.getAttribute("data-time"))
  setTimeout(() => {
    alertSuccess.classList.add("hidden-alert")
    setTimeout(() => {
      alertSuccess.remove()
    }, 1000)
  }, time);
}
// end show alert