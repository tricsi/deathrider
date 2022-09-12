import { SPEED } from "../../config";
import { Body2D } from "../../core/2d/Body2D";
import { Node2D } from "../../core/2d/Node2D";
import { Poly2D } from "../../core/2d/Poly2D";
import { Sprite2D } from "../../core/2d/Sprite2D";
import { Spawner } from "../../core/Spawner";
import { createSprite } from "../../modules/2d/context";
import { emit } from "../../modules/event";
import { A, add, copy, set, X } from "../../modules/math/math";
import { delay } from "../../modules/scheduler";

export default class Bullet extends Body2D {
    poly = new Poly2D([-3, -4, 6, 6], 4, 10)
    sprite = new Sprite2D(createSprite("fire", 8), [-4, -4])

    constructor() {
        super()
        this.color[A] = 1
        this.add(this.sprite)
            .add(this.poly)
    }

    async hit() {
        emit("hit")
        copy(this.spd, SPEED)
        this.poly.active = false
        await delay(.3, t => {
            const tt = (1 - t) ** 2
            this.scl = tt * 2
            this.color[A] = tt
        });
    }

    reset(pos: number[]) {
        this.scl = 1
        this.color[A] = 1
        set(this.spd, 200, 0)
        add(set(this.pos, 4, 6), pos)
        this.poly.active = true
    }

    update(delta: number): void {
        super.update(delta);
        const sprite = this.sprite
        sprite.frame = (delta * 10 + sprite.frame) % 4
    }

}

export class Bullets extends Node2D {

    pool: Spawner<Bullet>
    fire: boolean = true

    constructor(pos: number[]) {
        super()
        this.pool = new Spawner<Bullet>(() => new Bullet, item => {
            item.reset(pos)
            item.poly.on = async () => {
                await item.hit()
                this.del(item)
            }
            this.add(item)
            emit("fire")
        }, .3)
    }

    del(child: Bullet): number {
        this.pool.put(child)
        return super.del(child)
    }

    clear() {
        this.each((child: Bullet) => this.del(child))
    }

    update(delta: number): void {
        if (this.fire) {
            this.pool.update(delta)
        }
        super.update(delta)
        this.each((item: Bullet) => {
            if (item.pos[X] > 256) {
                this.del(item)
            }
        })
    }

}
