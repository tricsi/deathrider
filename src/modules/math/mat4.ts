import { eq } from "./math"

const MAT = m4()

const ZERO = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
]

export function m4(): Float32Array {
    return new Float32Array(ZERO)
}

export function m4set(out: Float32Array, mat: number[] | Float32Array = ZERO): Float32Array {
    out.set(mat)
    return out
}

export function m4project(out: Float32Array, aspect = 1, fov = 45, near = .1, far = 100) {
    const f: number = Math.tan(Math.PI * 0.5 - 0.5 * fov)
    const rangeInv: number = 1.0 / (near - far)
    out.fill(0)
    out[0] = f / aspect
    out[5] = f
    out[10] = (near + far) * rangeInv
    out[11] = -1
    out[14] = near * far * rangeInv * 2
    return out
}

export function m4multiply(out: Float32Array, [
    b00, b01, b02, b03,
    b10, b11, b12, b13,
    b20, b21, b22, b23,
    b30, b31, b32, b33
]: Float32Array): Float32Array {
    const [
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        a30, a31, a32, a33
    ] = out
    out[0] = a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30
    out[1] = a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31
    out[2] = a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32
    out[3] = a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33
    out[4] = a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30
    out[5] = a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31
    out[6] = a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32
    out[7] = a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33
    out[8] = a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30
    out[9] = a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31
    out[10] = a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32
    out[11] = a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33
    out[12] = a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30
    out[13] = a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31
    out[14] = a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32
    out[15] = a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33
    return out
}

export function m4translate(out: Float32Array, vec: number[]): Float32Array {
    if (!eq(vec)) {
        m4set(MAT).set(vec, 12)
        m4multiply(out, MAT)
    }
    return out
}

export function m4scale(out: Float32Array, vec: number[]): Float32Array {
    if (!eq(vec, 1)) {
        m4set(MAT)
        MAT[0] = vec[0]
        MAT[5] = vec[1]
        MAT[10] = vec[2]
        m4multiply(out, MAT)
    }
    return out
}

export function m4rotateX(out: Float32Array, angle: number): Float32Array {
    if (angle) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        m4set(MAT)
        MAT[5] = c
        MAT[6] = s
        MAT[9] = -s
        MAT[10] = c
        m4multiply(out, MAT)
    }
    return out
}

export function m4rotateY(out: Float32Array, angle: number): Float32Array {
    if (angle) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        m4set(MAT)
        MAT[0] = c
        MAT[2] = -s
        MAT[8] = s
        MAT[10] = c
        m4multiply(out, MAT)
    }
    return out
}

export function m4rotateZ(out: Float32Array, angle: number): Float32Array {
    if (angle) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        m4set(MAT)
        MAT[0] = c
        MAT[1] = s
        MAT[4] = -s
        MAT[5] = c
        m4multiply(out, MAT)
    }
    return out
}

export function m4rotate(out: Float32Array, vec: number[]) {
    return m4rotateZ(m4rotateY(m4rotateX(out, vec[0]), vec[1]), vec[2])
}
