let id = 0

export const generate = () => {
  const genId = id
  id++
  return genId
}

export const reset = () => {
  id = 0
}
