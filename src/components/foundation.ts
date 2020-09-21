import { BOARD_SIZE, Point } from '../rule'

export const N = BOARD_SIZE
export const C = 40 // cell size
export const INDICES = new Array(N).fill(null).map((_, i) => i + 1)

export const xChar = (x: number) => 'ABCDEFGHIJKLMNO'.charAt(x - 1)

export const pStr = ([x, y]: Point): string => `${xChar(x)}${y}`
