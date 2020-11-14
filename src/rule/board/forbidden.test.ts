import { forbidden } from './forbidden'
import { Square } from './square'

test('overline', () => {
  const square = createSquare(
    6,
    `
    oooo-o
  `
  )
  expect(forbidden(square, [5, 1])).toEqual('overline')
})

test('doubleFour1', () => {
  const square = createSquare(
    5,
    `
    o----
    -o---
    oo-o-
    ---o-
    -----
  `
  )
  expect(forbidden(square, [3, 3])).toEqual('doubleFour')
})

test('doubleFour2', () => {
  const square = createSquare(
    7,
    `
    o-o-o-o
  `
  )
  expect(forbidden(square, [4, 1])).toEqual('doubleFour')
})

test('doubleFour3', () => {
  const square = createSquare(
    8,
    `
    oo-o--oo
  `
  )
  expect(forbidden(square, [5, 1])).toEqual('doubleFour')
})

test('doubleFour4', () => {
  const square = createSquare(
    9,
    `
    ooo---ooo
  `
  )
  expect(forbidden(square, [5, 1])).toEqual('doubleFour')
})

test('notDoubleFour1', () => {
  const square = createSquare(
    6,
    `
    -oo-o-
  `
  )
  expect(forbidden(square, [4, 1])).toBeUndefined()
})

test('notDoubleFour2', () => {
  const square = createSquare(
    5,
    `
    o----
    -o---
    oo-ox
    ---o-
    -----
  `
  )
  expect(forbidden(square, [3, 3])).toBeUndefined()
})

test('doubleThree1', () => {
  const square = createSquare(
    6,
    `
    ------
    ------
    --o---
    -o-o--
    --o---
    ------
  `
  )
  expect(forbidden(square, [3, 3])).toEqual('doubleThree')
})

test('notDoubleThree1', () => {
  const square = createSquare(
    7,
    `
    --o-o--
  `
  )
  expect(forbidden(square, [4, 1])).toBeUndefined()
})

test('notDoubleThree2', () => {
  const square = createSquare(
    9,
    `
    -oo---oo-
  `
  )
  expect(forbidden(square, [5, 1])).toBeUndefined()
})

test('complexDoubleThree3', () => {
  const square = createSquare(
    6,
    `
    ------
    ---oo-
    --x---
    --oo--
    --o-oo
    ------
  `
  )
  expect(forbidden(square, [5, 3])).toBe('doubleThree')
  expect(forbidden(square, [5, 4])).toBeUndefined()
  expect(forbidden(square, [4, 4])).toBeUndefined()
})

const createSquare = (size: number, ascii: string): Square => {
  let square = new Square({ size: size })
  const hlines = ascii.trim().split(/\s+/).reverse()
  for (let y = 1; y <= hlines.length; y++) {
    for (let x = 1; x <= size; x++) {
      const c = hlines[y - 1].charAt(x - 1)
      if (c === 'o') square = square.put(true, [x, y])
      if (c === 'x') square = square.put(false, [x, y])
    }
  }
  return square
}
