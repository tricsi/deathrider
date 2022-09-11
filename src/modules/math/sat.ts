import { copy, reverse, scale, set, sub } from "./math"
import { v2dot, v2len, v2m3, v2norm } from "./vec2"

export interface IPolygon {
    p: number[]
    c: number[][]
    e: number[][]
    n: number[][]
}

export interface IResponse {
    a: boolean
    b: boolean
    o: number
    n: number[]
    v: number[]
}

export function createResponse(): IResponse {
    return {
        a: true,
        b: true,
        o: Number.MAX_VALUE,
        n: [0, 0],
        v: [0, 0]
    }
}

export function clearResponse(res: IResponse): IResponse {
    res.a = true
    res.b = true
    res.o = Number.MAX_VALUE
    set(res.n, 0, 0)
    set(res.v, 0, 0)
    return res
}

const LEFT_VORONOI_REGION = -1
const MIDDLE_VORONOI_REGION = 0
const RIGHT_VORONOI_REGION = 1
const TEST_POINT = [0, 0, 0.000001]
const T_RESPONSE = createResponse()
const T_ARRAYS: number[][] = [[], [], [], [], []]
const T_VECTORS: number[][] = []

for (let i = 0; i < 10; i++) T_VECTORS.push([0, 0])

export function createPolygon(p: number[], mat?: Float32Array): IPolygon {
    if (p.length === 4) {
        const [x, y, w, h] = p
        p = [x, y, x + w, y, x + w, y + h, x, y + h]
    }
    if (p.length < 6) {
        return
    }
    const c: number[][] = []
    const e: number[][] = []
    const n: number[][] = []
    for (let i = 0; i < p.length; i += 2) {
        c.push([0, 0])
        e.push([0, 0])
        n.push([0, 0])
    }
    return computePolygon({ p, c, e, n }, mat)
}

export function computePolygon(poly: IPolygon, mat?: Float32Array): IPolygon {
    const { p, c, e, n } = poly
    for (let i = 0; i < p.length; i += 2) {
        const vec = c[i / 2]
        set(vec, p[i], p[i + 1])
        mat && v2m3(vec, mat)
    }
    const len = c.length
    for (let i = 0; i < len; i++) {
        const p1 = c[i]
        const p2 = i < len - 1 ? c[i + 1] : c[0]
        const edge = sub(p2, p1, e[i])
        const norm = set(n[i], edge[1], -edge[0])
        v2norm(norm)
    }
    return poly
}

function voronoiRegion(line: number[], point: number[]) {
    const len2 = v2dot(line, line)
    const dp = v2dot(point, line)
    if (dp < 0) {
        return LEFT_VORONOI_REGION
    }
    if (dp > len2) {
        return RIGHT_VORONOI_REGION
    }
    return MIDDLE_VORONOI_REGION
}

function flattenPointsOn(points: number[][], normal: number[], result: number[]) {
    let min = Number.MAX_VALUE
    let max = -Number.MAX_VALUE
    for (const point of points) {
        const dot = v2dot(point, normal)
        if (dot < min) {
            min = dot
        }
        if (dot > max) {
            max = dot
        }
    }
    result[0] = min
    result[1] = max
}

function isSeparatingAxis(aPoints: number[][], bPoints: number[][], axis: number[], response: IResponse): boolean {
    const rangeA = T_ARRAYS.pop()
    const rangeB = T_ARRAYS.pop()
    flattenPointsOn(aPoints, axis, rangeA)
    flattenPointsOn(bPoints, axis, rangeB)
    if (rangeA[0] > rangeB[1] || rangeB[0] > rangeA[1]) {
        T_ARRAYS.push(rangeA)
        T_ARRAYS.push(rangeB)
        return true
    }
    if (response) {
        let overlap
        if (rangeA[0] < rangeB[0]) {
            response.a = false
            if (rangeA[1] < rangeB[1]) {
                overlap = rangeA[1] - rangeB[0]
                response.b = false
            } else {
                const option1 = rangeA[1] - rangeB[0]
                const option2 = rangeB[1] - rangeA[0]
                overlap = option1 < option2 ? option1 : -option2
            }
        }
        else {
            response.b = false
            if (rangeA[1] > rangeB[1]) {
                overlap = rangeA[0] - rangeB[1]
                response.a = false
            } else {
                const option1 = rangeA[1] - rangeB[0]
                const option2 = rangeB[1] - rangeA[0]
                overlap = option1 < option2 ? option1 : -option2
            }
        }
        const absOverlap = Math.abs(overlap)
        if (absOverlap < response.o) {
            response.o = absOverlap
            copy(response.n, axis)
            if (overlap < 0) {
                reverse(response.n)
            }
        }
    }
    T_ARRAYS.push(rangeA)
    T_ARRAYS.push(rangeB)
    return false
}

export function pointInCircle(p: number[], c: number[]): boolean {
    const [x, y, r] = c
    const differenceV = T_VECTORS.pop()
    sub(p, [x, y], differenceV)
    const radiusSq = r * r
    const distanceSq = v2dot(differenceV, differenceV)
    T_VECTORS.push(differenceV)
    return distanceSq <= radiusSq
}

export function pointInPolygon(p: number[], poly: IPolygon): boolean {
    copy(TEST_POINT, p)
    clearResponse(T_RESPONSE)
    let result = testCirclePolygon(TEST_POINT, poly, T_RESPONSE)
    if (result) {
        result = T_RESPONSE.a
    }
    return result
}

export function testPolygonPolygon(a: IPolygon, b: IPolygon, response?: IResponse): boolean {
    const aPoints = a.c
    const bPoints = b.c
    for (let i = 0; i < aPoints.length; i++) {
        if (isSeparatingAxis(aPoints, bPoints, a.n[i], response)) {
            return false
        }
    }
    for (let i = 0; i < bPoints.length; i++) {
        if (isSeparatingAxis(aPoints, bPoints, b.n[i], response)) {
            return false
        }
    }
    if (response) {
        scale(response.n, response.o, response.v)
    }
    return true
}

export function testCircleCircle(a: number[], b: number[], response?: IResponse): boolean {
    const [ax, ay, ar] = a
    const [bx, by, br] = b
    const differenceV = sub([bx, by], [ax, ay], T_VECTORS.pop())
    const totalRadius = ar + br
    const totalRadiusSq = totalRadius * totalRadius
    const distanceSq = v2dot(differenceV, differenceV)
    if (distanceSq > totalRadiusSq) {
        T_VECTORS.push(differenceV)
        return false
    }
    if (response) {
        const dist = Math.sqrt(distanceSq)
        response.o = totalRadius - dist
        v2norm(differenceV)
        copy(response.n, differenceV)
        scale(differenceV, response.o, response.v)
        response.a = ar <= br && dist <= br - ar
        response.b = br <= ar && dist <= ar - br
    }
    T_VECTORS.push(differenceV)
    return true
}

export function testPolygonCircle(polygon: IPolygon, circle: number[], response?: IResponse): boolean {
    const [x, y, radius] = circle
    const circlePos = set(T_VECTORS.pop(), x, y)
    const radius2 = radius * radius
    const points = polygon.c
    const len = points.length
    const edge = T_VECTORS.pop()
    const point = T_VECTORS.pop()
    for (let i = 0; i < len; i++) {
        const next = i === len - 1 ? 0 : i + 1
        const prev = i === 0 ? len - 1 : i - 1
        let overlap = 0
        let overlapN = null
        copy(edge, polygon.e[i])
        sub(circlePos, points[i], point)
        if (response && v2dot(point, point) > radius2) {
            response.a = false
        }
        const region = voronoiRegion(edge, point)
        if (region === LEFT_VORONOI_REGION) {
            copy(edge, polygon.e[prev])
            const point2 = sub(circlePos, points[prev], T_VECTORS.pop())
            if (voronoiRegion(edge, point2) === RIGHT_VORONOI_REGION) {
                const dist = v2len(point)
                if (dist > radius) {
                    T_VECTORS.push(circlePos)
                    T_VECTORS.push(edge)
                    T_VECTORS.push(point)
                    T_VECTORS.push(point2)
                    return false
                }
                else if (response) {
                    response.b = false
                    overlapN = v2norm(point)
                    overlap = radius - dist
                }
            }
            T_VECTORS.push(point2)
        }
        else if (region === RIGHT_VORONOI_REGION) {
            copy(edge, polygon.e[next])
            sub(circlePos, points[next], point)
            if (voronoiRegion(edge, point) === LEFT_VORONOI_REGION) {
                const dist = v2len(point)
                if (dist > radius) {
                    T_VECTORS.push(circlePos)
                    T_VECTORS.push(edge)
                    T_VECTORS.push(point)
                    return false
                }
                else if (response) {
                    response.b = false
                    overlapN = v2norm(point)
                    overlap = radius - dist
                }
            }
        }
        else {
            const normal = [edge[1], -edge[0]]
            v2norm(normal)
            const dist = v2dot(point, normal)
            const distAbs = Math.abs(dist)
            if (dist > 0 && distAbs > radius) {
                T_VECTORS.push(circlePos)
                T_VECTORS.push(normal)
                T_VECTORS.push(point)
                return false
            }
            else if (response) {
                overlapN = normal
                overlap = radius - dist
                if (dist >= 0 || overlap < 2 * radius) {
                    response.b = false
                }
            }
        }
        if (overlapN && response && Math.abs(overlap) < Math.abs(response.o)) {
            response.o = overlap
            copy(response.n, overlapN)
        }
    }
    if (response) {
        scale(response.n, response.o, response.v)
    }
    T_VECTORS.push(circlePos)
    T_VECTORS.push(edge)
    T_VECTORS.push(point)
    return true
}

export function testCirclePolygon(circle: number[], polygon: IPolygon, response?: IResponse): boolean {
    const result = testPolygonCircle(polygon, circle, response)
    if (result && response) {
        const aInB = response.a
        reverse(response.n)
        reverse(response.v)
        response.a = response.b
        response.b = aInB
    }
    return result
}
