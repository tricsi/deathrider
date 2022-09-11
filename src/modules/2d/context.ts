import sheet from "../../asset/texture"
import texture from "../../asset/texture.png"
import vertShader from "./shader/2D.vert"
import fragShader from "./shader/2D.frag"
import { m3, m3project, m3scale } from "../math/mat3"
import { rgba, multiply, set, X, Y } from "../math/math"
import { bindBuffer, compileShader, createProgram, createTexture, setAttribute, setUniform } from "../webgl2"
import { on } from "../event"
import { $ } from "../utils"

export interface SpriteData {
    /** Sprite name */
    n: string
    /** Width */
    w: number
    /** Height */
    h: number
    /** Extrude */
    e: number
}

export const BLACK = rgba()
export const WHITE = rgba(1, 1, 1)

const SIZE = 4096
const VEC = [0, 0]
const GL = $<HTMLCanvasElement>("canvas").getContext("webgl2")
const PRG = createProgram(GL, compileShader(GL, GL.VERTEX_SHADER, vertShader), compileShader(GL, GL.FRAGMENT_SHADER, fragShader))
const IDX = new Uint16Array(SIZE * 6)
const UV = new Float32Array(SIZE * 8)
const POS = new Float32Array(SIZE * 8)
const TINT = new Float32Array(SIZE * 16)
const PROJ = m3()
const RES = [GL.canvas.width, GL.canvas.height]
const IMG = new Image()
const FRAMES: any = sheet.frames

let COUNT = 0

const contextBounds = () => GL.canvas.getBoundingClientRect()

export function createContext(onLoad: () => void) {
    GL.enable(GL.BLEND)
    GL.clearColor(0, 0, 0, 1)
    GL.blendFunc(GL.ONE, GL.ONE_MINUS_SRC_ALPHA)
    GL.useProgram(PRG)
    for (let i = 0; i < IDX.length; i++) {
        IDX[i] = Math.floor(i / 6) * 4 + [0, 1, 2, 2, 1, 3][i % 6]
    }
    bindBuffer(GL, "idx", IDX, GL.ELEMENT_ARRAY_BUFFER)
    on("load", () => {
        GL.bindTexture(GL.TEXTURE_2D, createTexture(GL, IMG))
        on("resize", resizeContext, window)
        resizeContext()
        onLoad()
    }, IMG)
    IMG.src = texture
}

export function renderContext(clear = true) {
    setUniform(GL, PRG, "uProj", PROJ as Float32Array)
    bindBuffer(GL, "aUv", UV)
    setAttribute(GL, PRG, "aUv", 2)
    bindBuffer(GL, "aPos", POS)
    setAttribute(GL, PRG, "aPos", 2)
    bindBuffer(GL, "aTint", TINT)
    setAttribute(GL, PRG, "aTint", 4)
    clear && GL.clear(GL.COLOR_BUFFER_BIT)
    GL.drawElements(GL.TRIANGLES, COUNT * 6, GL.UNSIGNED_SHORT, 0)
    COUNT = 0
}

function resizeContext() {
    const canvas = GL.canvas as HTMLCanvasElement
    const [w, h] = RES
    let { width, height } = contextBounds()
    width *= devicePixelRatio
    height *= devicePixelRatio
    canvas.width = width
    canvas.height = height
    m3project(PROJ, width, height)
    m3scale(PROJ, set(VEC, width / w, height / h))
    GL.viewport(0, 0, width, height)
}

function addMesh({ w, h }: SpriteData, [a00, a01, a02, a10, a11, a12, a20, a21]: Float32Array) {
    POS.set([
        a20, a21,
        a00 * w + a20, a01 * w + a21,
        a10 * h + a20, a11 * h + a21,
        a00 * w + a10 * h + a20, a01 * w + a11 * h + a21
    ], COUNT * 8)
}

function addUv({ n, w, h, e }: SpriteData, frame: number = 0) {
    const [sw, sh] = sheet.size
    const m = e ? e * 2 : sheet.margin
    const p = m / sw
    let [x, y] = FRAMES[n]
    x = (x + e) / sw
    y = (y + e) / sh
    w /= sw
    h /= sh
    x += (w + p) * Math.floor(frame)
    UV.set([
        x, y,
        x + w, y,
        x, y + h,
        x + w, y + h
    ], COUNT * 8)
}

function addTint(tint: number[] = WHITE) {
    for (let i = 0; i < 4; i++) {
        TINT.set(tint, COUNT * 16 + i * 4)
    }
}

export function createSprite(n: string, w: number = FRAMES[n][2], h: number = FRAMES[n][3], e: number = 0): SpriteData {
    return { n, w, h, e }
}

export function drawSprite(mat: Float32Array, sprite: SpriteData, frame?: number, tint?: number[]) {
    if (COUNT < SIZE && sprite.n in sheet.frames) {
        addMesh(sprite, mat)
        addUv(sprite, frame)
        addTint(tint)
        COUNT++
    }
}

export function raycast(pos: number[]): number[] {
    const [w, h] = RES
    const { x, y, width, height } = contextBounds()
    return multiply([pos[X] - x, pos[Y] - y], set(VEC, w / width, h / height))
}
