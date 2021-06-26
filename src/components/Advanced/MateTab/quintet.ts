/* eslint-disable */
// https://github.com/webpack-contrib/worker-loader/issues/176
const ctx: Worker = self as any

interface SolveArguments {
  blacks: Uint8Array
  whites: Uint8Array
  turn: boolean
  depthLimit: number
}

ctx.onmessage = async (event: MessageEvent) => {
  const quintet = await import('@renju-note/quintet')
  const { blacks, whites, turn, depthLimit } = event.data as SolveArguments
  const rawSolution = quintet.solve_vcf(blacks, whites, turn, depthLimit)
  ctx.postMessage({ rawSolution })
}

export default {}
