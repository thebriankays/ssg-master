// Linear interpolation
export const lerp = (v0: number, v1: number, t: number) => v0 * (1 - t) + v1 * t

// Get pyramidal index
// Returns an array of decreasing index values in a pyramid shape, starting from the specified index with the highest value
export const getPiramidalIndex = (array: any[], index: number) =>
  array.map((_, i) =>
    index === i ? array.length : array.length - Math.abs(index - i)
  )