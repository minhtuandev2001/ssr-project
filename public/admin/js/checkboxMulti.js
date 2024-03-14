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
const formChangeMulti = document.querySelector("[form-change-multi-status]")
if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();
    const checkboxMulti = document.querySelector("[checkbox-multi]")
    const inputsChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");

    const typeChange = e.target.elements.type.value;
    if (typeChange === "delete-all") {
      const isConfirm = confirm("You confirm you want to delete these records?")
      if (!isConfirm) {
        return;
      }
    }
    if (inputsChecked.length > 0) {
      let ids = []
      const inputIds = document.querySelector("input[name='ids']")
      inputsChecked.forEach(input => {
        if (typeChange === "change-position") {
          const position = input.closest("tr").querySelector("input[name='position']").value;
          ids.push(`${input.value}-${position}`)
        } else {
          ids.push(input.value)
        }
      })
      inputIds.value = ids.join(', ')
      formChangeMulti.submit()
    } else {
      alert('Please select at least 1 record')
    }
  })
}
// end form checkbox multi 