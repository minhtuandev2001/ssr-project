// permissions 
const tablePermissions = document.querySelector("[table-premisstions]")
if (tablePermissions) {
  const buttonSubmit = document.querySelector("[button-submit]")

  buttonSubmit.addEventListener("click", () => {
    let permissions = []
    const rows = tablePermissions.querySelectorAll("[data-name]")
    rows.forEach((row) => {
      const name = row.getAttribute("data-name")
      const inputs = row.querySelectorAll("input")
      if (name === "id") {
        inputs.forEach((input) => {
          const id = input.value
          permissions.push({
            id: id,
            permissions: []
          })
        })
      } else {
        inputs.forEach((input, index) => {
          const checked = input.checked
          if (checked) {
            permissions[index].permissions.push(name)
          }
        })
      }
    })
    const formChangeSubmit = document.querySelector("#form-change-permissions")
    const inputDataChangePermissions = formChangeSubmit.querySelector("input[name='permissions']")
    inputDataChangePermissions.value = JSON.stringify(permissions)
    formChangeSubmit.submit()
  })
}
// end permissions

// permissions data default
const dataRoles = document.querySelector("[dataRoles]")
if (dataRoles) {
  let datas = JSON.parse(dataRoles.getAttribute("dataRoles"))
  datas.forEach((item, index) => {
    const permissions = item.permissions
    permissions.forEach(permission => {
      const row = tablePermissions.querySelector(`tr[data-name=${permission}]`)
      const inputCheckboxs = row.querySelectorAll('input')
      inputCheckboxs[index].checked = true
    })
  })
}
// end permissions data default