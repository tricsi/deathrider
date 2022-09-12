import { PTC } from "../../config"
import { Body2D } from "../../core/2d/Body2D"
import { Particle2D } from "../../core/2d/Particle2D"
import { Poly2D } from "../../core/2d/Poly2D"
import { Sprite2D } from "../../core/2d/Sprite2D"
import { createSprite } from "../../modules/2d/context"
import { emit } from "../../modules/event"
import input from "../../modules/input/keyboard"
import { m3scale } from "../../modules/math/mat3"
import { A, rgba, set, X, Y } from "../../modules/math/math"
import { delay } from "../../modules/scheduler"
import { rnd } from "../../modules/utils"

export class Skull extends Body2D {

    up = 0
    max = 200
    thr = 0
    spin = 0
    life = 0
    poly = new Poly2D([-7, -7, 14, 14], 1, 2)
    head = new Sprite2D(createSprite("skull"), [-8, -8])
    jaw = new Sprite2D(createSprite("jaw", 8), [-2, 0])
    jet = new Particle2D(PTC, {
        n: 15,
        h: 6,
        r: Math.PI / 2,
        s: 1,
        f: 3,
        t: .5,
        c: t => [0, 1 - t, 1, 1 - t],
        v: (t, l) => (1.5 - t) * rnd(50, l) + 25,
        u: (m, t) => m3scale(m, 1.2 - t)
    }, [-7, 0])

    collide = async ({ layer }: Poly2D) => {
        if (layer == 2) {
            emit("bonk")
            this.death()
            if (this.life--) {
                await delay(2)
                this.start(this.life)
            } else {
                emit("death")
            }
        }
    }

    constructor() {
        super()
        const { poly, head, jaw, jet } = this
        poly.on = this.collide
        jet.start()
        this.add(jaw)
            .add(head)
            .add(poly)
            .add(jet)
        this.reset()
    }

    reset() {
        const { acc, spd, pos } = this
        set(acc, 0)
        set(spd, 0, 0)
        set(pos, -8, 64)
        this.thr = 0
        this.rot = 0
        this.spin = 0
    }

    async start(life = 0) {
        this.reset()
        this.life = life
        this.color = life
            ? rgba(1, .8, .3)
            : rgba(1, 1, 1)
        this.jet.active = true
        await delay(1, (t) => {
            this.pos[X] = (1 - ((1 - t) ** 3)) * 52 - 8
            this.color[A] = Math.cos((1 - t) * 20) * .3 + .8
        })
        this.poly.active = true
    }

    init() {
        this.thr = 300
    }

    death() {
        this.init()
        set(this.acc, -100)
        set(this.spd, 0, -this.max)
        this.spin = (rnd() - .5) * 30
        this.spin += Math.sign(this.spin) * 10
        this.jet.active = false
        this.poly.active = false
    }

    update(delta: number) {
        if (this.spin) {
            this.up = 0
            this.rot += this.spin * delta
        } else {
            this.up = input["Space"] | input["Mouse0"]
        }
        const { up, pos, acc, spd, thr } = this
        acc[Y] = up ? -thr : thr
        super.update(delta)
        if (pos[Y] > 122) {
            pos[Y] = 122
            spd[Y] = 0
        }
        if (pos[Y] < 16) {
            pos[Y] = 16
            spd[Y] = 0
        }
        this.jaw.frame = up
    }

}
