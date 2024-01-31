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
const formChangeMulti = document.querySelector("[form-change-multi-status]")
if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();
    const checkboxMulti = document.querySelector("[checkbox-multi]")
    const inputsChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");

    const typeChange = e.target.elements.type.value;
    if (typeChange === "delete-all") {
      const isConfirm = confirm("Bạn xác nhận muốn xóa các sản phẩm sau đây?")
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
      alert('vui lòng chọn ít nhất 1 bản ghi')
    }
  })
}
// end form checkbox multi 
// button delete item product
const buttonDeleteProducts = document.querySelectorAll("[button-delete]");
if (buttonDeleteProducts.length > 0) {
  const formDeleteProduct = document.querySelector("[id='form-delete-product']")
  const path = formDeleteProduct.getAttribute("data-path")
  buttonDeleteProducts.forEach(button => {
    button.addEventListener("click", () => {
      const isConfirm = confirm("Bạn xác nhận xóa sản phẩm này ?")
      if (isConfirm) {
        const id = button.getAttribute("data-id")
        const action = path + `/${id}/?_method=DELETE`
        formDeleteProduct.action = action
        formDeleteProduct.submit()
      }
    })
  })
}
// end button delete item product
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
// upload image
const uploadImage = document.querySelector("[upload-image]")
if (uploadImage) {
  const uploadInput = uploadImage.querySelector("[upload-image-input]")
  const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]")
  const buttonClearPreview = uploadImage.querySelector("[button-clear-preview]")
  uploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0]
    if (file) {
      uploadImagePreview.setAttribute('src', URL.createObjectURL(file))
    }
  })
  buttonClearPreview.addEventListener('click', () => {
    uploadInput.value = ""
    uploadImagePreview.setAttribute('src', "")
  })
}
// end upload image

// sort products
const sort = document.querySelector("[sort]")
if (sort) {
  let url = new URL(window.location.href);
  const sortSelect = sort.querySelector("[sort-select]")
  const sortClear = sort.querySelector("[sort-clear]")
  // sort
  sortSelect.addEventListener("change", (e) => {
    const [sortKey, sortValue] = e.target.value.split('-')
    url.searchParams.set('sortKey', sortKey)
    url.searchParams.set('sortValue', sortValue)
    // chuyển hướng trang 
    window.location.href = url.href
  })
  // clear sort
  sortClear.addEventListener('click', () => {
    url.searchParams.delete('sortKey')
    url.searchParams.delete('sortValue')
    window.location.href = url.href
  })
  const sortKey = url.searchParams.get('sortKey')
  const sortValue = url.searchParams.get('sortValue')
  if (sortKey && sortValue) {
    const stringSort = `${sortKey}-${sortValue}`
    const optionSelected = sortSelect.querySelector(`option[value='${stringSort}']`)
    optionSelected.setAttribute('selected', true)
  }
}
// end sort products