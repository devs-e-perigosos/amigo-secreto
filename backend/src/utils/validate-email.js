const AT = '@'

export function validateEmail(email) {
  return !email.includes(AT)
}
