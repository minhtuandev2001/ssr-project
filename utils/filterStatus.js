module.exports = (query) => {
  let filterStatus = [
    {
      name: "All",
      status: "",
      class: "active"
    },
    {
      name: "active",
      status: "active",
      class: ""
    },
    {
      name: "inactive",
      status: "inactive",
      class: ""
    },
  ]
  if (query.status) {
    filterStatus.forEach(item => {
      if (item.status === query.status) {
        item.class = "active"
      } else {
        item.class = ""
      }
    })
  }
  return filterStatus
}