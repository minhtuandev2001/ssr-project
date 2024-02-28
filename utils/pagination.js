module.exports = (objectPagination, query, countDocument) => {
  if (query.page) {
    objectPagination.currentPage = Number(query.page)
  }
  objectPagination.skip = (objectPagination.currentPage - 1) * 4
  const totalPage = Math.ceil(countDocument / objectPagination.limit)
  objectPagination.totalPage = totalPage

  return objectPagination;
}