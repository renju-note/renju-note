export const N_LINES = 15

export type Point = [number, number]

export const equal = (a: Point, b: Point): boolean => a[0] === b[0] && a[1] === b[1]
