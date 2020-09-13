import { Square } from './square'

test('new', () => {
  const s = new Square({ size: 15 })
  expect(s.facets[0][0]).toBe('vertical')
  expect(s.facets[0][1]).toMatchObject(orthogonalLines)
  expect(s.facets[1][0]).toBe('horizontal')
  expect(s.facets[1][1]).toMatchObject(orthogonalLines)
  expect(s.facets[2][0]).toBe('ascending')
  expect(s.facets[2][1]).toMatchObject(diagonalLines)
  expect(s.facets[3][0]).toBe('descending')
  expect(s.facets[3][1]).toMatchObject(diagonalLines)
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
