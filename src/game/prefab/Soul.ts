import { Body2D } from "../../core/2d/Body2D"
import { Node2D } from "../../core/2d/Node2D"
import { Poly2D } from "../../core/2d/Poly2D"
import { Sprite2D } from "../../core/2d/Sprite2D"
import { Spawner } from "../../core/Spawner"
import { createSprite } from "../../modules/2d/context"
import { emit } from "../../modules/event"
import { set, X, Y } from "../../modules/math/math"
import { delay } from "../../modules/scheduler"
import { rnd } from "../../modules/utils"

export class Soul extends Body2D {

    piv = [8, 8]
    spd = [0, -30]
    poly = new Poly2D([2, 2, 12, 12], 8, 5)
    sprite = new Sprite2D(createSprite("soul", 16))

    constructor() {
        super()
        this.add(this.poly)
            .add(this.sprite)
        this.reset()
    }

    async hit() {
        this.poly.active = false
        await delay(.3, t => this.scl = (1 - t) ** 4)
    }

    reset() {
        this.scl = 1
        this.poly.active = true
        set(this.pos, 0, 0)
    }

    update(delta: number): void {
        super.update(delta);
        const sprite = this.sprite
        sprite.frame = (delta * 10 + sprite.frame) % 4
    }

}

export class Souls extends Node2D {
    size = 128
    pool = new Spawner<Soul>(
        () => new Soul,
        item => {
            item.reset()
            item.poly.on = async () => {
                emit("collect")
                await item.hit()
                this.del(item)
                this.pool.reset()
            }
            this.add(item)
        },
        () => rnd(1),
        1
    )

    clear() {
        this.each((child: Soul) => this.del(child))
    }

    del(child: Soul): number {
        this.pool.put(child)
        return super.del(child)
    }

    update(delta: number): void {
        this.pool.update(delta)
        super.update(delta)
        this.each((item: Soul) => {
            if (item.pos[Y] <= -this.size) {
                this.del(item)
            }
        })
    }
}
