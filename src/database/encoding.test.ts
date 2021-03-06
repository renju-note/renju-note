import { Point } from '../rule'
import { encodeMoves } from './encoding'

test('encoding1', () => {
  const moves: Point[] = [
    [8, 8],
    [8, 9],
    [10, 10],
  ] // D3
  expect(encodeMoves(moves)).toMatchObject(['7.4000/', '6.8000/4000/', '5.400/1.6000/'])
})
