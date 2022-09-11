import { SPEED } from "../../config";
import { Body2D } from "../../core/2d/Body2D";
import { Node2D } from "../../core/2d/Node2D";
import { Poly2D } from "../../core/2d/Poly2D";
import { Sprite2D } from "../../core/2d/Sprite2D";
import { Spawner } from "../../core/Spawner";
import { createSprite } from "../../modules/2d/context";
import { X, Y } from "../../modules/math/math";
import { rnd } from "../../modules/utils";

export default class Block extends Body2D {

    spd = SPEED

    constructor() {
        super()
        this.add(new Poly2D([1, 1, 14, 14], 2))
            .add(new Sprite2D(createSprite("block")))
    }
}

export class Blocks extends Node2D {

    pos = [256, 8]
    size = 272
    pool: Spawner<Block> = new Spawner<Block>(
        () => new Block,
        item => {
            item.pos[X] = 0
            item.pos[Y] = rnd(80)
            this.add(item)
        },
        () => rnd(1) + 1
    )

    del(child: Block): number {
        this.pool.put(child)
        return super.del(child)
    }

    clear() {
        this.each((child: Block) => this.del(child))
    }

    update(delta: number): void {
        this.pool.update(delta)
        super.update(delta)
        this.each((item: Block) => {
            if (item.pos[X] < -this.size) {
                this.del(item)
            }
        })
    }

}
