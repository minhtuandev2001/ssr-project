const priceNewDiscountProducts = (datas) => {
  const newDatas = datas.map(item => {
    item.priceNew = ((item.price * (100 - item.discountPercentage)) / 100).toFixed(2)
    return item;
  })
  return newDatas
}

const priceNewDiscountProduct = (product) => {
  const newPrice = (((100 - product.discountPercentage) * product.price) / 100).toFixed(2);
  return newPrice
}

module.exports = {
  priceNewDiscountProducts,
  priceNewDiscountProduct
}