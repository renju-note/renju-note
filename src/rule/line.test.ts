import { newOrthogonalLines, newDiagonalLines } from './line'

test('newOrthogonalLines', () => {
  const result = newOrthogonalLines()
  expect(result).toEqual([
    { size: 15, ws: 0b0, bs: 0b0 },
    { size: 15, ws: 0b0, bs: 0b0 },
    { size: 15, ws: 0b0, bs: 0b0 },
    { size: 15, ws: 0b0, bs: 0b0 },
    { size: 15, ws: 0b0, bs: 0b0 },
    { size: 15, ws: 0b0, bs: 0b0 },
    { size: 15, ws: 0b0, bs: 0b0 },
    { size: 15, ws: 0b0, bs: 0b0 },
    { size: 15, ws: 0b0, bs: 0b0 },
    { size: 15, ws: 0b0, bs: 0b0 },
    { size: 15, ws: 0b0, bs: 0b0 },
    { size: 15, ws: 0b0, bs: 0b0 },
    { size: 15, ws: 0b0, bs: 0b0 },
    { size: 15, ws: 0b0, bs: 0b0 },
    { size: 15, ws: 0b0, bs: 0b0 },
  ])
})

test('newDiagonalLines', () => {
  const result = newDiagonalLines()
  expect(result).toEqual([
    { size: 1, ws: 0b0, bs: 0b0 },
    { size: 2, ws: 0b0, bs: 0b0 },
    { size: 3, ws: 0b0, bs: 0b0 },
    { size: 4, ws: 0b0, bs: 0b0 },
    { size: 5, ws: 0b0, bs: 0b0 },
    { size: 6, ws: 0b0, bs: 0b0 },
    { size: 7, ws: 0b0, bs: 0b0 },
    { size: 8, ws: 0b0, bs: 0b0 },
    { size: 9, ws: 0b0, bs: 0b0 },
    { size: 10, ws: 0b0, bs: 0b0 },
    { size: 11, ws: 0b0, bs: 0b0 },
    { size: 12, ws: 0b0, bs: 0b0 },
    { size: 13, ws: 0b0, bs: 0b0 },
    { size: 14, ws: 0b0, bs: 0b0 },
    { size: 15, ws: 0b0, bs: 0b0 },
    { size: 14, ws: 0b0, bs: 0b0 },
    { size: 13, ws: 0b0, bs: 0b0 },
    { size: 12, ws: 0b0, bs: 0b0 },
    { size: 11, ws: 0b0, bs: 0b0 },
    { size: 10, ws: 0b0, bs: 0b0 },
    { size: 9, ws: 0b0, bs: 0b0 },
    { size: 8, ws: 0b0, bs: 0b0 },
    { size: 7, ws: 0b0, bs: 0b0 },
    { size: 6, ws: 0b0, bs: 0b0 },
    { size: 5, ws: 0b0, bs: 0b0 },
    { size: 4, ws: 0b0, bs: 0b0 },
    { size: 3, ws: 0b0, bs: 0b0 },
    { size: 2, ws: 0b0, bs: 0b0 },
    { size: 1, ws: 0b0, bs: 0b0 },
  ])
})
