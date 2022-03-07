import { useLocalStorage } from '../services/local-storage/use-local-storage.js'

export function startDB() {
  const localStorage = useLocalStorage()

  if (localStorage.getObject('amigos') == null) {
    localStorage.setObject('amigos', { nextId: 1, amigos: [] })
  }
}
