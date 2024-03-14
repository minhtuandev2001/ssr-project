// button status lọc all, active, inactive 
const buttonStatus = document.querySelectorAll("[button-status]");
if (buttonStatus.length > 0) {
  let url = new URL(window.location.href);
  buttonStatus.forEach(button => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status")
      if (status) {
        url.searchParams.set("status", status)
        url.searchParams.delete("page")
      } else {
        url.searchParams.delete("status")
      }
      // chuyển hướng trang
      window.location.href = url.href
    })
  })
}
// end button status

// change status của đối tượng
const buttonChangeStatus = document.querySelectorAll("[button-change-status]");

if (buttonChangeStatus.length > 0) {
  let formChangeStatus = document.querySelector("#form-change-status");
  let path = formChangeStatus.getAttribute("data-path")
  buttonChangeStatus.forEach(button => {
    button.addEventListener("click", () => {
      const statusCurrent = button.getAttribute("data-status")
      const id = button.getAttribute("data-id")

      let statusChange = statusCurrent === "active" ? "inactive" : "active";

      const action = path + `/${statusChange}/${id}?_method=PATCH`;
      formChangeStatus.setAttribute("action", action);
      formChangeStatus.submit();
    })
  })
}
// end change status của đối tượng

// pagination
const buttonPagination = document.querySelectorAll("[button-pagination]")
if (buttonPagination) {
  let url = new URL(window.location.href);
  buttonPagination.forEach(button => {
    button.addEventListener("click", (e) => {
      let page = button.getAttribute("button-pagination")
      url.searchParams.set("page", page)
      window.location.href = url.href
    })
  })
}
// end pagination

// menu icon responsive mobile 
const siderIcon = document.querySelector('[sider-icon]');
if (siderIcon) {
  const menuSider = document.querySelector('.sider')
  siderIcon.addEventListener('click', () => {
    const visible = siderIcon.getAttribute("visible")
    if (visible === "0") {
      // hiển thị menu
      menuSider.style.left = "0px"
      siderIcon.setAttribute("visible", "1")
    } else {
      menuSider.style.left = "-200px"
      siderIcon.setAttribute("visible", "0")
    }
  })
}
// end menu icon responsive mobile 