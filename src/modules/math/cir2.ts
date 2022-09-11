import { copy, sub } from "./math"
import { v2len } from "./vec2"

const VEC = [0, 0]

function distance(vec1: number[], vec2: number[]): number {
    return v2len(sub(copy(VEC, vec1), vec2))
}

export function c2v2(cir: number[], vec: number[]): boolean {
    return distance(cir, vec) <= cir[2]
}

export function c2c2(cir1: number[], cir2: number[]): boolean {
    return distance(cir1, cir2) <= cir1[2] + cir2[2]
}
