module.exports = (objectPagination, query, countDocument, skip = 4) => {
  if (query.page) {
    objectPagination.currentPage = Number(query.page)
  }
  objectPagination.skip = (objectPagination.currentPage - 1) * skip
  const totalPage = Math.ceil(countDocument / objectPagination.limit)
  objectPagination.totalPage = totalPage

  return objectPagination;
}