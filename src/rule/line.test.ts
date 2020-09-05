import { findWhiteFive, findBlackFive } from './line'

test('findWhiteFive1', () => {
  const res = findWhiteFive({ size: 7, blacks: 0b0000001, whites: 0b0111110 })
  expect(res).toEqual([1])
})

test('findWhiteFive2', () => {
  const res = findWhiteFive({ size: 15, blacks: 0b000000110001000, whites: 0b011111001100010 })
  expect(res).toEqual([9])
})

test('findWhiteFive3', () => {
  const res = findWhiteFive({ size: 15, blacks: 0b000000110001000, whites: 0b001111001100010 })
  expect(res).toEqual([])
})

test('findBlackFive1', () => {
  const res = findBlackFive({ size: 5, blacks: 0b11111, whites: 0b00000 })
  expect(res).toEqual([0])
})

test('findBlackFive2', () => {
  const res = findBlackFive({ size: 7, blacks: 0b0111110, whites: 0b1000001 })
  expect(res).toEqual([1])
})

test('findBlackFive3', () => {
  const res = findBlackFive({ size: 8, blacks: 0b01111101, whites: 0b00000000 })
  expect(res).toEqual([2])
})

test('findBlackFive4', () => {
  const res = findBlackFive({ size: 6, blacks: 0b111111, whites: 0b000000 })
  expect(res).toEqual([])
})

test('findBlackFive5', () => {
  const res = findBlackFive({ size: 5, blacks: 0b11011, whites: 0b00000 })
  expect(res).toEqual([])
})
