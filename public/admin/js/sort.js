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