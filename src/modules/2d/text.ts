import { m3, m3set, m3translate } from "../math/mat3"
import { drawSprite, SpriteData } from "./context"
import { set } from "../math/math"

export interface TextData extends SpriteData {
    /** Text */
    t: string
    /** Letter spacing */
    l?: number
    /** Line gap */
    g?: number
}

const ABC = "+-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ,.!?$"
const MAT = m3()
const VEC = [0, 0]

export function createText(font: SpriteData, t = "", l = 1, g = 1): TextData {
    return { ...font, t, l, g }
}

export function drawText(mat: Float32Array, text: TextData, tint?: number[]) {
    m3set(MAT, mat)
    const { t, w, h, l = 1, g = 1 } = text
    for (const line of t.split("\n")) {
        for (let j = 0; j < line.length; j++) {
            const frame = ABC.indexOf(line.charAt(j).toUpperCase())
            if (frame >= 0) {
                drawSprite(MAT, text, frame, tint)
            }
            m3translate(MAT, set(VEC, w + l, 0))
        }
        m3translate(MAT, set(VEC, 0, h + g))
    }
}
