import { SPEED } from "../../config";
import { Body2D } from "../../core/2d/Body2D";
import { Node2D } from "../../core/2d/Node2D";
import { Poly2D } from "../../core/2d/Poly2D";
import { Sprite2D } from "../../core/2d/Sprite2D";
import { Spawner } from "../../core/Spawner";
import { createSprite } from "../../modules/2d/context";
import { X, Y } from "../../modules/math/math";
import { rnd } from "../../modules/utils";
import { Souls } from "./Soul";

export class Grave extends Body2D {

    piv = [8, 8]
    spd = SPEED
    souls = new Souls

    constructor() {
        super()
        this.souls.pos = [8, 0]
        this.add(new Poly2D([2, 1, 12, 14], 2))
            .add(new Sprite2D(createSprite("grave")))
            .add(this.souls)
    }
}

export class Graves extends Node2D {

    pos = [264, 121]
    size = 272
    pool = new Spawner<Grave>(
        () => new Grave,
        item => {
            item.pos[X] = 0
            item.pos[Y] = rnd(1, 0, 1)
            this.add(item)
        },
        () => rnd(2) + 1
    )

    del(child: Grave): number {
        child.souls.clear()
        this.pool.put(child)
        return super.del(child)
    }

    clear() {
        this.each((child: Grave) => this.del(child))
    }

    update(delta: number): void {
        this.pool.update(delta)
        super.update(delta)
        this.each((item: Grave) => {
            if (item.pos[X] < -this.size) {
                this.del(item)
            }
        })
    }

}
