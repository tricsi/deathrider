import { SPEED } from "../../config";
import { Body2D } from "../../core/2d/Body2D";
import { Node2D } from "../../core/2d/Node2D";
import { Poly2D } from "../../core/2d/Poly2D";
import { Sprite2D } from "../../core/2d/Sprite2D";
import { Spawner } from "../../core/Spawner";
import { createSprite } from "../../modules/2d/context";
import { emit } from "../../modules/event";
import { set, X } from "../../modules/math/math";
import { delay } from "../../modules/scheduler";
import { rnd } from "../../modules/utils";

const ACC = [0, 300]

export default class Bat extends Body2D {

    piv = [8, 8]
    poly = new Poly2D([1, 1, 14, 14], 2, 4)
    sprite = new Sprite2D(createSprite("bat", 16))

    constructor() {
        super()
        this.add(this.poly)
            .add(this.sprite)
    }

    async hit() {
        this.acc = ACC
        this.poly.active = false
        await delay(1, t => {
            this.scl = (1 - t) * 1.2
            this.rot = t * 10
        })
    }

    reset() {
        this.scl = 1
        this.rot = 0
        this.acc = SPEED
        this.poly.active = true
        set(this.pos, 0, 0)
        set(this.spd, -150, (rnd() - .5) * 50)
    }

    update(delta: number): void {
        super.update(delta);
        const sprite = this.sprite
        sprite.frame = (delta * 10 + sprite.frame) % 4
    }

}

export class Bats extends Node2D {

    pos = [256, 18]
    size = 272
    pool: Spawner<Bat> = new Spawner<Bat>(
        () => new Bat,
        item => {
            item.reset()
            set(item.pos, 0, rnd(60))
            item.poly.on = async () => {
                emit("collect")
                await item.hit()
                this.del(item)
            }
            this.add(item)
        },
        () => rnd(2) + 3
    )

    del(child: Bat): number {
        this.pool.put(child)
        return super.del(child)
    }

    clear() {
        this.each((child: Bat) => this.del(child))
    }

    update(delta: number): void {
        this.pool.update(delta)
        super.update(delta)
        this.each((item: Bat) => {
            if (item.pos[X] < -this.size) {
                this.del(item)
            }
        })
    }

}
