export function isNullUndefinedOrEmpty(requested) {
  if (requested === null || requested === undefined || requested === '') {
    return true
  }

  return false
}
