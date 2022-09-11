import { drawSprite, SpriteData, WHITE } from "./context"
import { rnd } from "../utils"
import { add, multiply, X, Y } from "../math/math"
import { v2rotate } from "../math/vec2"
import { m3, m3set, m3translate } from "../math/mat3"

export type ParamFactory<T> = (t: number, l:number) => T

export interface ParticleData {
    /** Number of particles */
    n?: number
    /** Gravity X */
    x?: number
    /** Gravity Y */
    y?: number
    /** Emitter width */
    w?: number
    /** Emitter height */
    h?: number
    /** Angle */
    a?: number
    /** Rotate */
    r?: number
    /** Random seed (0 = no random) */
    s?: number
    /** Kill time */
    t?: number
    /** Length */
    l?: number
    /** Velocity */
    v?: number | ParamFactory<number>
    /** Sprite frame */
    f?: number | ParamFactory<number>
    /** Sprite color */
    c?: number[] | ParamFactory<number[]>
    /** Transform update */
    u?: (m: Float32Array, t: number, l:number) => void
}

const MAT = m3()
const VEC = [0, 0]
const POS = [0, 0]

function param<T>(value: T | ParamFactory<T>, t: number, l: number): T {
    return value instanceof Function ? value(t, l) : value
}

export function drawParticles(
    mat: Float32Array,
    sprite: SpriteData,
    { n = 1, x = 0, y = 0, w = 0, h = 0, v = 100, r = 0, a = 0, s = 0, t = 1, l = Number.POSITIVE_INFINITY, f = 0, c, u }: ParticleData,
    time: number,
    tint: number[] = WHITE
) {
    if (time < 0 || time > t + l) {
        return
    }
    const loops = Math.ceil(l / t)
    const seed = rnd.SEED
    rnd.SEED = s
    a = Math.abs(a)
    for (let i = 0; i < n; i++) {
        const min = l ? Math.min(t + l, t) : t
        const shift = s ? rnd(min) : t / n * i
        const now = time - shift
        const loop = Math.floor(now / t + 1)
        const delta = now % t
        const tween = delta / t
        VEC[X] = 0
        VEC[Y] = param(v, tween, loop) * delta
        POS[X] = (x * delta * delta) + (w ? rnd(w, loop) - w / 2 : 0)
        POS[Y] = (y * delta * delta) + (h ? rnd(h, loop) - h / 2 : 0)
        const rotate = r - (s ? rnd(a, loop) : a / n * i) + (a / 2)
        const frame = param(f, tween, loop)
        const color = c ? multiply(param(c, tween, loop), tint) : tint
        m3translate(m3set(MAT, mat), add(v2rotate(VEC, rotate), POS))
        u && u(MAT, tween, loop)
        if (loop && loop <= loops && shift < l) {
            drawSprite(MAT, sprite, frame, color)
        }
    }
    rnd.SEED = seed
}
