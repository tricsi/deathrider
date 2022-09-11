import { m3, m3scale, m3set, m3translate } from "../math/mat3"
import { drawSprite, SpriteData } from "./context"
import { set } from "../math/math"

export interface TilemapData {
    /** Map width */
    w: number
    /** Map height */
    h: number
    /** Map data */
    d: number[]
    /** Flip data */
    f: number[]
}

const MAT = m3()
const VEC = [0, 0]

export function createTilemap(map: string, w: number, h: number): TilemapData {
    const d = new Array(w * h).fill(-1)
    const f = new Array(w * h).fill(0)
    let i = 0
    let j = 0
    while (i < map.length) {
        let tile = map.charAt(i++)
        let flip = "|-+".indexOf(tile) + 1
        let count = 1
        if (flip) {
            tile = map.charAt(i++)
        }
        if (tile.match(/[A-Z]/)) {
            tile = tile.toLowerCase()
        } else {
            count = parseInt(map.charAt(i++), 36) + 1
        }
        if (tile !== "0") {
            d.fill(parseInt(tile, 36) - 10, j, j + count)
            f.fill(flip, j, j + count)
        }
        j += count
    }
    return { w, h, d, f }
}

export function drawTilemap(mat: Float32Array, sprite: SpriteData, map: TilemapData, tint?: number[]) {
    const { w, h } = sprite
    map.d.forEach((frame, idx) => {
        if (frame >= 0) {
            const x = idx % map.w
            const y = Math.floor(idx / map.w)
            const flip = map.f[idx]
            m3translate(m3set(MAT, mat), set(VEC, x * w, y * h))
            if (flip) {
                m3scale(MAT, set(VEC, flip & 1 ? -1 : 1, flip & 2 ? -1 : 1))
            }
            drawSprite(MAT, sprite, frame, tint)
        }
    })
}
