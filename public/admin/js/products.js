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
/*
* th1 : tất cả checkbox đều chưa check -> nhấn checkall -> check hết tất cả
* th2 : tất cả checkbox đều đã check -> nhấn checkall -> uncheck hết tất cả
* th3 : một số checkbox đã được check -> nhấn checkall
* th4 : tất cả checkbox đều check -> checkall tự động được check
*/
// checkbox multi
const checkboxMulti = document.querySelector("[checkbox-multi]")
if (checkboxMulti) {
  const inputCheckAll = document.querySelector("input[name='checkall']")
  const inputsId = document.querySelectorAll("input[name='id']")
  inputCheckAll.addEventListener("click", () => {
    if (inputCheckAll.checked) {
      inputsId.forEach(input => input.checked = true)
    } else {
      inputsId.forEach(input => input.checked = false)
    }
  })
  inputsId.forEach(input => {
    input.addEventListener("click", () => {
      const countCheck = checkboxMulti.querySelectorAll("input[name='id']:checked").length
      if (countCheck === inputsId.length) {
        inputCheckAll.checked = true
      } else {
        inputCheckAll.checked = false
      }
    })
  })
}
// end checkbox multi

// form checkbox multi 
const formChangeMulti = document.querySelector("[ form-change-multi-status]")
if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();
    const checkboxMulti = document.querySelector("[checkbox-multi]")
    const inputsChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");
    if (inputsChecked.length > 0) {
      let ids = []
      const inputIds = document.querySelector("input[name='ids']")
      inputsChecked.forEach(input => {
        ids.push(input.value)
      })
      inputIds.value = ids.join(', ')
      formChangeMulti.submit()
    } else {
      alert('vui lòng chọn ít nhất 1 bản ghi')
    }
  })
}
// end form checkbox multi 