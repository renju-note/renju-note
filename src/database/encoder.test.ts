import { MAGIC_SQUARE } from './encoder'

const genPrimes = (n: number): number[] => {
  const primes = []
  // eslint-disable-next-line no-labels
  OUTER: for (let i = 2; primes.length < n; i++) {
    for (let j = 0; j < primes.length; j++) {
      // eslint-disable-next-line no-labels
      if (i % primes[j] === 0) continue OUTER
    }
    primes.push(i)
  }
  return primes
}

const primesSquare = (n: number): number[][] | undefined => {
  if (n % 2 !== 1) return undefined
  const result = new Array(n).fill(null).map(_ => new Array(n).fill(0))
  const primes = genPrimes(n ** 2)
  let l = 1
  let i = 0
  let [x, y] = [(n - 1) / 2, (n - 1) / 2]
  result[x][y] = primes[i]
  i++
  while (l < n) {
    l += 2
    y++ // up 1
    // right
    for (; x < (n - l) / 2 + l; x++) {
      result[x][y] = primes[i]
      i++
    }
    x--
    i--
    // down
    for (; y >= (n - l) / 2; y--) {
      result[x][y] = primes[i]
      i++
    }
    y++
    i--
    // left
    for (; x >= (n - l) / 2; x--) {
      result[x][y] = primes[i]
      i++
    }
    x++
    i--
    // up
    for (; y < (n - l) / 2 + l; y++) {
      result[x][y] = primes[i]
      i++
    }
    y--
  }
  return result
}

test('MAGIC_SQUARE', () => {
  const M = primesSquare(15)
  expect(MAGIC_SQUARE).toEqual(M)
})
