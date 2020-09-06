import { Line } from './line'

test('BlackFives1', () => {
  const line = new Line({ size: 5, blacks: 0b11111, whites: 0b00000 })
  expect(line.blackProps.five).toEqual([0])
})

test('BlackFives2', () => {
  const line = new Line({ size: 7, blacks: 0b0111110, whites: 0b1000001 })
  expect(line.blackProps.five).toEqual([1])
})

test('BlackFives3', () => {
  const line = new Line({ size: 8, blacks: 0b01111101, whites: 0b00000000 })
  expect(line.blackProps.five).toEqual([2])
})

test('BlackFives4', () => {
  const line = new Line({ size: 6, blacks: 0b111111, whites: 0b000000 })
  expect(line.blackProps.five).toEqual([])
})

test('BlackFives5', () => {
  const line = new Line({ size: 5, blacks: 0b11011, whites: 0b00000 })
  expect(line.blackProps.five).toEqual([])
})

test('WhiteFives1', () => {
  const line = new Line({ size: 7, blacks: 0b0000001, whites: 0b0111110 })
  expect(line.whiteProps.five).toEqual([1])
})

test('WhiteFives2', () => {
  const line = new Line({ size: 15, blacks: 0b000000110001000, whites: 0b011111001100010 })
  expect(line.whiteProps.five).toEqual([9])
})

test('WhiteFives3', () => {
  const line = new Line({ size: 15, blacks: 0b000000110001000, whites: 0b001111001100010 })
  expect(line.whiteProps.five).toEqual([])
})
