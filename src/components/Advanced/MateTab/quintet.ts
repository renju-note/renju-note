/* eslint-disable */
// https://github.com/webpack-contrib/worker-loader/issues/176
const ctx: Worker = self as any

interface SolveArguments {
  blacks: [number, number][]
  whites: [number, number][]
  turn: boolean
  depthLimit: number
}

ctx.onmessage = async (event: MessageEvent) => {
  const quintet = await import('@renju-note/quintet')
  const { blacks, whites, turn, depthLimit } = event.data as SolveArguments
  const blackCodes = new Uint8Array(blacks.map(([x, y]) => quintet.encode_xy(x - 1, y - 1)))
  const whiteCodes = new Uint8Array(whites.map(([x, y]) => quintet.encode_xy(x - 1, y - 1)))
  const rawSolution = quintet.solve_vcf(blackCodes, whiteCodes, turn, depthLimit)
  const solution =
    rawSolution === undefined
      ? []
      : Array.from(rawSolution).map(code => [
          quintet.decode_x(code) + 1,
          quintet.decode_y(code) + 1,
        ])
  ctx.postMessage({ solution })
}

export default {}
