const buttonChangeStatus = document.querySelectorAll("[button-change-status]");

if (buttonChangeStatus.length > 0) {
  let formChangeStatus = document.querySelector("#form-change-status");
  let path = formChangeStatus.getAttribute("data-path")
  console.log(path)
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