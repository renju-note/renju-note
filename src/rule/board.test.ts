import { Board } from './board'

test('newBoard', () => {
  const board = new Board({ size: 15 })
  expect(board.facets[0].kind).toBe('vertical')
  expect(board.facets[0].lines).toMatchObject(orthogonalLines)
  expect(board.facets[1].kind).toBe('horizontal')
  expect(board.facets[1].lines).toMatchObject(orthogonalLines)
  expect(board.facets[2].kind).toBe('ascending')
  expect(board.facets[2].lines).toMatchObject(diagonalLines)
  expect(board.facets[3].kind).toBe('descending')
  expect(board.facets[3].lines).toMatchObject(diagonalLines)
})

const orthogonalLines = [
  { size: 15, whites: 0b0, blacks: 0b0 },
  { size: 15, whites: 0b0, blacks: 0b0 },
  { size: 15, whites: 0b0, blacks: 0b0 },
  { size: 15, whites: 0b0, blacks: 0b0 },
  { size: 15, whites: 0b0, blacks: 0b0 },
  { size: 15, whites: 0b0, blacks: 0b0 },
  { size: 15, whites: 0b0, blacks: 0b0 },
  { size: 15, whites: 0b0, blacks: 0b0 },
  { size: 15, whites: 0b0, blacks: 0b0 },
  { size: 15, whites: 0b0, blacks: 0b0 },
  { size: 15, whites: 0b0, blacks: 0b0 },
  { size: 15, whites: 0b0, blacks: 0b0 },
  { size: 15, whites: 0b0, blacks: 0b0 },
  { size: 15, whites: 0b0, blacks: 0b0 },
  { size: 15, whites: 0b0, blacks: 0b0 },
]
const diagonalLines = [
  { size: 1, whites: 0b0, blacks: 0b0 },
  { size: 2, whites: 0b0, blacks: 0b0 },
  { size: 3, whites: 0b0, blacks: 0b0 },
  { size: 4, whites: 0b0, blacks: 0b0 },
  { size: 5, whites: 0b0, blacks: 0b0 },
  { size: 6, whites: 0b0, blacks: 0b0 },
  { size: 7, whites: 0b0, blacks: 0b0 },
  { size: 8, whites: 0b0, blacks: 0b0 },
  { size: 9, whites: 0b0, blacks: 0b0 },
  { size: 10, whites: 0b0, blacks: 0b0 },
  { size: 11, whites: 0b0, blacks: 0b0 },
  { size: 12, whites: 0b0, blacks: 0b0 },
  { size: 13, whites: 0b0, blacks: 0b0 },
  { size: 14, whites: 0b0, blacks: 0b0 },
  { size: 15, whites: 0b0, blacks: 0b0 },
  { size: 14, whites: 0b0, blacks: 0b0 },
  { size: 13, whites: 0b0, blacks: 0b0 },
  { size: 12, whites: 0b0, blacks: 0b0 },
  { size: 11, whites: 0b0, blacks: 0b0 },
  { size: 10, whites: 0b0, blacks: 0b0 },
  { size: 9, whites: 0b0, blacks: 0b0 },
  { size: 8, whites: 0b0, blacks: 0b0 },
  { size: 7, whites: 0b0, blacks: 0b0 },
  { size: 6, whites: 0b0, blacks: 0b0 },
  { size: 5, whites: 0b0, blacks: 0b0 },
  { size: 4, whites: 0b0, blacks: 0b0 },
  { size: 3, whites: 0b0, blacks: 0b0 },
  { size: 2, whites: 0b0, blacks: 0b0 },
  { size: 1, whites: 0b0, blacks: 0b0 },
]
