import { m3, m3rotate, m3scale, m3set, m3translate } from "../../modules/math/mat3"
import { set, sub } from "../../modules/math/math"
import { Node } from "../Node"

const VEC = [0, 0]

export class Node2D extends Node {

    mat: Float32Array = m3()

    constructor(
        public pos: number[] = [0, 0],
        public piv: number[] = [0, 0],
        public scl: number | number[] = 1,
        public rot: number = 0
    ) {
        super()
    }

    protected pmat(parent = this.parent): Float32Array | undefined {
        return parent instanceof Node2D ? parent.mat : parent ? this.pmat(parent.parent) : undefined
    }

    protected compute() {
        super.compute()
        const { mat, pos, piv, scl, rot } = this
        m3translate(m3scale(m3rotate(m3translate(m3set(mat, this.pmat()), pos), rot as number), scl), sub(set(VEC, 0, 0), piv))
    }

}
