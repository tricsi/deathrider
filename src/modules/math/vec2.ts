import { each, scale, X, Y } from "./math"

export const v2dot = ([x1, y1]: number[], [x2, y2]: number[]) => x1 * x2 + y1 * y2

export const v2len2 = (vec: number[]) => v2dot(vec, vec)

export const v2len = (vec: number[]) => Math.sqrt(v2len2(vec))

export function v2prep(out: number[]): number[] {
    const [x, y] = out
    out[X] = y
    out[Y] = -x
    return out
}

export function v2norm(out: number[]): number[] {
    const d = v2len(out)
    return d > 0 ? scale(out, 1 / d) : out
}

export function v2rotate(out: number[], angle: number): number[] {
    const [x, y] = out
    const s = Math.sin(angle)
    const c = Math.cos(angle)
    out[X] = x * c - y * s
    out[Y] = x * s + y * c
    return out
}

export function v2project(out: number[], vec: number[]): number[] {
    const amt = v2dot(out, vec) / v2len2(vec)
    return each(out, vec, v => v * amt) as number[]
}

export function v2projectN(out: number[], vec: number[]): number[] {
    const amt = v2dot(out, vec)
    return each(out, vec, v => v * amt) as number[]
}

export function v2reflect(out: number[], axis: number[]): number[] {
    const [x, y] = out
    scale(v2project(out, axis), 2)
    out[X] -= x
    out[Y] -= y
    return out
}

export function v2reflectN(out: number[], axis: number[]): number[] {
    const [x, y] = out
    scale(v2projectN(out, axis), 2)
    out[X] -= x
    out[Y] -= y
    return out
}

export function v2m3(out: number[], mat: Float32Array): number[] {
    const [x, y] = out
    out[X] = mat[0] * x + mat[3] * y + mat[6]
    out[Y] = mat[1] * x + mat[4] * y + mat[7]
    return out
}
