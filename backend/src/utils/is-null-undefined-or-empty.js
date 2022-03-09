export function isNullUndefinedOrEmpty(text) {
  if (text === null || text === undefined || text === '') {
    return true
  }

  return false
}
