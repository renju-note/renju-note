import { newBoard } from './board'

test('newBoard', () => {
  const result = newBoard()
  expect(result.vLines).toEqual(orthogonalLines)
  expect(result.hLines).toEqual(orthogonalLines)
  expect(result.aLines).toEqual(diagonalLines)
  expect(result.dLines).toEqual(diagonalLines)
})

const orthogonalLines = [
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
]
const diagonalLines = [
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
]
