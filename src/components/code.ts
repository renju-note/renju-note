import { Point } from '../rule'

export const xCode = (x: number) => 'ABCDEFGHIJKLMNO'.charAt(x - 1)

export const yCode = (x: number) => x.toString()

export const code = ([x, y]: Point): string => `${xCode(x)}${yCode(y)}`
