import { Point } from 'renjukit'
import { encodeAccumulatedMoves } from './encoding'

test('encoding1', () => {
  const moves: Point[] = [
    [7, 7],
    [7, 8],
    [9, 9],
  ] // D3
  expect(encodeAccumulatedMoves(moves)).toMatchObject(['7.4000/', '6.8000/4000/', '5.400/1.6000/'])
})
