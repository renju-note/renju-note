import { whiteWonByFive, blackWonByFive } from './linePattern'

test('whiteWonByFive', () => {
  const res = whiteWonByFive({ size: 7, bs: 0b0000001, ws: 0b0111110 })
  expect(res).toEqual([true, 1])
})

test('blackWonByFive1', () => {
  const res = blackWonByFive({ size: 5, bs: 0b11111, ws: 0b00000 })
  expect(res).toEqual([true, 0])
})

test('blackWonByFive2', () => {
  const res = blackWonByFive({ size: 7, bs: 0b0111110, ws: 0b1000001 })
  expect(res).toEqual([true, 1])
})

test('blackWonByFive3', () => {
  const res = blackWonByFive({ size: 8, bs: 0b01111101, ws: 0b00000000 })
  expect(res).toEqual([true, 2])
})

test('blackWonByFive4', () => {
  const res = blackWonByFive({ size: 6, bs: 0b111111, ws: 0b000000 })
  expect(res).toEqual([false, undefined])
})

test('blackWonByFive5', () => {
  const res = blackWonByFive({ size: 5, bs: 0b11011, ws: 0b00000 })
  expect(res).toEqual([false, undefined])
})
