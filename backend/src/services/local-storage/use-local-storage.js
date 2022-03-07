import { LocalStorage } from 'node-localstorage'

export function useLocalStorage() {
  const localStorage = new LocalStorage('./db')

  function getObject(key) {
    const json = localStorage.getItem(key)

    if (json) {
      return JSON.parse(json)
    }

    return null
  }

  function setObject(key, obj) {
    const objString = JSON.stringify(obj)

    localStorage.setItem(key, objString)
  }

  function deleteObject(key) {
    localStorage.removeItem(key)
  }

  return {
    getObject,
    setObject,
    deleteObject,
  }
}
