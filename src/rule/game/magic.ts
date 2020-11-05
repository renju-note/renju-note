import { Game, Point } from '..'

export const magicCodes = (game: Game, between: [number, number]): [number[], number[]] => {
  const [s, e] = between
  if (s < 1 || e < 1 || s > e) return [[], []]
  const [bl, bo] = [~~((e + 1) / 2), ~~((s - 1) / 2)]
  const [wl, wo] = [~~(e / 2), ~~((s - 2) / 2)]
  return [
    magicCodesForPoints(game.blacks, bl, bo),
    magicCodesForPoints(game.whites, wl, wo),
  ]
}

export const magicCodesForPoints = (ps: Point[], limit: number, offset: number): number[] => {
  if (limit > ps.length) return []
  const result: number[] = []
  for (let i = 0; i < limit; i++) {
    const [x, y] = ps[i]
    const current = MAGIC_SQUARE[x - 1][y - 1]
    if (current > Number.MAX_SAFE_INTEGER) break
    const last = result[result.length - 1]
    result.push(last ? last * current : current)
  }
  return result.slice(offset)
}

export const openingCode = (ps: Point[]): number => magicCodesForPoints(ps, 3, 2)[0] ?? 0

export const MAGIC_SQUARE = [
  [1297, 1301, 1303, 1307, 1319, 1321, 1327, 1361, 1367, 1373, 1381, 1399, 1409, 1423, 1427],
  [1291, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997, 1009, 1013],
  [1289, 911, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 1019],
  [1283, 907, 601, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 677, 1021],
  [1279, 887, 599, 359, 191, 193, 197, 199, 211, 223, 227, 229, 431, 683, 1031],
  [1277, 883, 593, 353, 181, 73, 79, 83, 89, 97, 101, 233, 433, 691, 1033],
  [1259, 881, 587, 349, 179, 71, 17, 19, 23, 29, 103, 239, 439, 701, 1039],
  [1249, 877, 577, 347, 173, 67, 13, 2, 3, 31, 107, 241, 443, 709, 1049],
  [1237, 863, 571, 337, 167, 61, 11, 7, 5, 37, 109, 251, 449, 719, 1051],
  [1231, 859, 569, 331, 163, 59, 53, 47, 43, 41, 113, 257, 457, 727, 1061],
  [1229, 857, 563, 317, 157, 151, 149, 139, 137, 131, 127, 263, 461, 733, 1063],
  [1223, 853, 557, 313, 311, 307, 293, 283, 281, 277, 271, 269, 463, 739, 1069],
  [1217, 839, 547, 541, 523, 521, 509, 503, 499, 491, 487, 479, 467, 743, 1087],
  [1213, 829, 827, 823, 821, 811, 809, 797, 787, 773, 769, 761, 757, 751, 1091],
  [1201, 1193, 1187, 1181, 1171, 1163, 1153, 1151, 1129, 1123, 1117, 1109, 1103, 1097, 1093],
]
