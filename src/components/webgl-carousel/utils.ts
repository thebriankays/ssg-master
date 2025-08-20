export const lerp = (start: number, end: number, amt: number) => {
  return (1 - amt) * start + amt * end
}

export const getPiramidalIndex = (array: any[], index: number) => {
  return array.map((_, i) =>
    index === i ? array.length : array.length - Math.abs(index - i)
  )
}