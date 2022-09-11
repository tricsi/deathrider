import { add, scale } from "../../modules/math/math"
import { v2len, v2norm } from "../../modules/math/vec2"
import { Node2D } from "./Node2D"

const VEC = [0, 0]

export class Body2D extends Node2D {

    spd: number[] = [0, 0]
    acc: number[] = [0, 0]
    max: number = Number.MAX_VALUE

    update(delta: number): void {
        const { max, spd, acc, pos } = this
        add(spd, scale(acc, delta, VEC))
        v2len(spd) > max && scale(v2norm(spd), max)
        add(pos, scale(spd, delta, VEC))
        super.update(delta)
    }

}
