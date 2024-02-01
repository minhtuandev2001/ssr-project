module.exports = (objectPagination, query, countDocument) => {
  if (query.page) {
    objectPagination.currentPage = Number(query.page)
  }
  objectPagination.skip = (objectPagination.currentPage - 1) * 4
  const totalPage = Math.ceil(countDocument / 4)
  objectPagination.totalPage = totalPage

  return objectPagination
}