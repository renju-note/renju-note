import { findWhiteFive, findBlackFive } from './line'

test('findWhiteFive1', () => {
  const res = findWhiteFive({ size: 7, bs: 0b0000001, ws: 0b0111110 })
  expect(res).toEqual([1])
})

test('findWhiteFive2', () => {
  const res = findWhiteFive({ size: 15, bs: 0b000000110001000, ws: 0b011111001100010 })
  expect(res).toEqual([9])
})

test('findWhiteFive3', () => {
  const res = findWhiteFive({ size: 15, bs: 0b000000110001000, ws: 0b001111001100010 })
  expect(res).toEqual([])
})

test('findBlackFive1', () => {
  const res = findBlackFive({ size: 5, bs: 0b11111, ws: 0b00000 })
  expect(res).toEqual([0])
})

test('findBlackFive2', () => {
  const res = findBlackFive({ size: 7, bs: 0b0111110, ws: 0b1000001 })
  expect(res).toEqual([1])
})

test('findBlackFive3', () => {
  const res = findBlackFive({ size: 8, bs: 0b01111101, ws: 0b00000000 })
  expect(res).toEqual([2])
})

test('findBlackFive4', () => {
  const res = findBlackFive({ size: 6, bs: 0b111111, ws: 0b000000 })
  expect(res).toEqual([])
})

test('findBlackFive5', () => {
  const res = findBlackFive({ size: 5, bs: 0b11011, ws: 0b00000 })
  expect(res).toEqual([])
})
