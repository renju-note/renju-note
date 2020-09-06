import { Board } from './board'

test('newBoard', () => {
  const board = new Board()
  expect(board.stripes.vertical.type_).toBe('vertical')
  expect(board.stripes.vertical.lines).toMatchObject(orthogonalLines)
  expect(board.stripes.horizontal.type_).toBe('horizontal')
  expect(board.stripes.horizontal.lines).toMatchObject(orthogonalLines)
  expect(board.stripes.ascending.type_).toBe('ascending')
  expect(board.stripes.ascending.lines).toMatchObject(diagonalLines)
  expect(board.stripes.descending.type_).toBe('descending')
  expect(board.stripes.descending.lines).toMatchObject(diagonalLines)
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
