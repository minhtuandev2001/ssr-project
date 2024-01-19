module.exports = (objectPagination, query, countProducts) => {
  if (query.page) {
    objectPagination.currentPage = Number(query.page)
  }
  objectPagination.skip = (objectPagination.currentPage - 1) * 4
  const totalPage = Math.ceil(countProducts / 4)
  objectPagination.totalPage = totalPage

  return objectPagination
}