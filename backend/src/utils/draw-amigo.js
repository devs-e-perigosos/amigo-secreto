import { getRandomAmigoIndex } from './index.js'

export function drawAmigo(sorteio, _, index, amigos) {
  let drawnAmigoIndex

  const drawnAmigos = Object.values(sorteio)

  do {
    drawnAmigoIndex = getRandomAmigoIndex(amigos.length)
    if (
      index === amigos.length - 2 &&
      !drawnAmigos.includes(amigos.length - 1)
    ) {
      drawnAmigoIndex = amigos.length - 1
    }
  } while (drawnAmigoIndex === index || drawnAmigos.includes(drawnAmigoIndex))

  return [...sorteio, drawnAmigoIndex]
}
