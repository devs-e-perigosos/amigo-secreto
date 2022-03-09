export function isNotUniqueByField(array, requested, field) {
  return array.some(object => object[field] === requested)
}
