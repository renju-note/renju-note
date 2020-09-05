import { Line } from './line'

test('BlackFives1', () => {
  const line = new Line(5, 0b11111, 0b00000)
  expect(line.blackProps.fives).toEqual([0])
})

test('BlackFives2', () => {
  const line = new Line(7, 0b0111110, 0b1000001)
  expect(line.blackProps.fives).toEqual([1])
})

test('BlackFives3', () => {
  const line = new Line(8, 0b01111101, 0b00000000)
  expect(line.blackProps.fives).toEqual([2])
})

test('BlackFives4', () => {
  const line = new Line(6, 0b111111, 0b000000)
  expect(line.blackProps.fives).toEqual([])
})

test('BlackFives5', () => {
  const line = new Line(5, 0b11011, 0b00000)
  expect(line.blackProps.fives).toEqual([])
})

test('WhiteFives1', () => {
  const line = new Line(7, 0b0000001, 0b0111110)
  expect(line.whiteProps.fives).toEqual([1])
})

test('WhiteFives2', () => {
  const line = new Line(15, 0b000000110001000, 0b011111001100010)
  expect(line.whiteProps.fives).toEqual([9])
})

test('WhiteFives3', () => {
  const line = new Line(15, 0b000000110001000, 0b001111001100010)
  expect(line.whiteProps.fives).toEqual([])
})
