import { Point, N_LINES } from '..'

export const magicCodes = (moves: Point[]): number[] => {
  const movesVariants = variants(moves)
  const codesVariants = []
  for (let i = 0; i < movesVariants.length; i++) {
    codesVariants[i] = mCodes(movesVariants[i])
  }
  const result = []
  for (let j = 0; j < moves.length; j++) {
    result[j] = Math.min(
      codesVariants[0][j],
      codesVariants[1][j],
      codesVariants[2][j],
      codesVariants[3][j],
      codesVariants[4][j],
      codesVariants[5][j],
      codesVariants[6][j],
      codesVariants[7][j],
    )
  }
  return result
}

export const magicCode = (blacks: Point[], whites: Point[]): number => {
  const blacksVariants = variants(blacks)
  const whitesVariants = variants(whites)
  return Math.min(
    mCode(blacksVariants[0], whitesVariants[0]),
    mCode(blacksVariants[1], whitesVariants[1]),
    mCode(blacksVariants[2], whitesVariants[2]),
    mCode(blacksVariants[3], whitesVariants[3]),
    mCode(blacksVariants[4], whitesVariants[4]),
    mCode(blacksVariants[5], whitesVariants[5]),
    mCode(blacksVariants[6], whitesVariants[6]),
    mCode(blacksVariants[7], whitesVariants[7]),
  )
}

const variants = (ps: Point[]): Point[][] => {
  return [
    variantN(ps, 0),
    variantN(ps, 1),
    variantN(ps, 2),
    variantN(ps, 3),
    variantN(ps, 4),
    variantN(ps, 5),
    variantN(ps, 6),
    variantN(ps, 7),
  ]
}

const variantN = (ps: Point[], n: number) => {
  switch (n) {
    case 0:
      return variant(ps, 0, false)
    case 1:
      return variant(ps, 0, true)
    case 2:
      return variant(ps, 90, false)
    case 3:
      return variant(ps, 90, true)
    case 4:
      return variant(ps, 180, false)
    case 5:
      return variant(ps, 180, true)
    case 6:
      return variant(ps, 270, false)
    case 7:
      return variant(ps, 270, true)
    default:
      return ps
  }
}

const variant = (ps: Point[], degree: 0 | 90 | 180 | 270, mirror: boolean): Point[] => {
  const result: Point[] = []
  for (let i = 0; i < ps.length; i++) {
    const p: Point = mirror ? [ps[i][1], ps[i][0]] : ps[i]
    switch (degree) {
      case 0:
        result[i] = p
        break
      case 90:
        result[i] = [p[1], N_LINES + 1 - p[0]]
        break
      case 180:
        result[i] = [N_LINES + 1 - p[0], N_LINES + 1 - p[1]]
        break
      case 270:
        result[i] = [N_LINES + 1 - p[1], p[0]]
        break
      default:
        result[i] = p
    }
  }
  return result
}

const mCodes = (moves: Point[]): number[] => {
  const result: number[] = []
  let last = 1
  for (let i = 0; i < moves.length; i++) {
    const current = mp(moves[i], i % 2 === 0)
    result[i] = Math.min(last * current, Number.MAX_SAFE_INTEGER)
    last = result[i]
  }
  return result
}

const mCode = (blacks: Point[], whites: Point[]): number => {
  let ret = 1
  for (let i = 0; i < blacks.length; i++) {
    ret *= mp(blacks[i], true)
  }
  for (let i = 0; i < whites.length; i++) {
    ret *= mp(whites[i], false)
  }
  return ret
}

const mp = ([x, y]: Point, black: boolean): number => black ? MAGIC_SQUARE[x - 1][y - 1] ** 2 : MAGIC_SQUARE[x - 1][y - 1]

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
