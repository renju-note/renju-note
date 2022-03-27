/* eslint-disable */
// https://github.com/webpack-contrib/worker-loader/issues/176
const ctx: Worker = self as any

interface SolveArguments {
  mode: 'vcf' | 'vct'
  turn: boolean
  limit: number
  blacks: [number, number][]
  whites: [number, number][]
}

ctx.onmessage = async (event: MessageEvent) => {
  const quintet = await import('@renju-note/quintet')
  const { mode, limit, blacks, whites, turn } = event.data as SolveArguments
  const blackCodes = new Uint8Array(blacks.map(([x, y]) => quintet.encode_xy(x, y)))
  const whiteCodes = new Uint8Array(whites.map(([x, y]) => quintet.encode_xy(x, y)))
  const modeCode = mode == 'vcf' ? 0 : 16; // 0 = VCF, 16 = VCTDFPN
  const rawSolution = quintet.solve(modeCode, limit, blackCodes, whiteCodes, turn, limit);
  console.log(rawSolution)
  const solution =
    rawSolution === undefined
      ? []
      : Array.from(rawSolution).map(code => [quintet.decode_x(code), quintet.decode_y(code)])
  ctx.postMessage({ solution, turn })
}

export default {}
