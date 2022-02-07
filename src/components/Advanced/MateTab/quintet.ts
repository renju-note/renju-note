/* eslint-disable */
// https://github.com/webpack-contrib/worker-loader/issues/176
const ctx: Worker = self as any

interface SolveArguments {
  kind: 'vcf' | 'vct'
  blacks: [number, number][]
  whites: [number, number][]
  turn: boolean
  depthLimit: number
}

ctx.onmessage = async (event: MessageEvent) => {
  const quintet = await import('@renju-note/quintet')
  const { kind, blacks, whites, turn, depthLimit } = event.data as SolveArguments
  const blackCodes = new Uint8Array(blacks.map(([x, y]) => quintet.encode_xy(x, y)))
  const whiteCodes = new Uint8Array(whites.map(([x, y]) => quintet.encode_xy(x, y)))
  const rawSolution =
    kind == 'vct'
      ? quintet.solve_vct(blackCodes, whiteCodes, turn, depthLimit)
      : quintet.solve_vcf(blackCodes, whiteCodes, turn, depthLimit)
  const solution =
    rawSolution === undefined
      ? []
      : Array.from(rawSolution).map(code => [quintet.decode_x(code), quintet.decode_y(code)])
  ctx.postMessage({ solution, turn })
}

export default {}
