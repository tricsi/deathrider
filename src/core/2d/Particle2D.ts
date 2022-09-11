import { Node2D } from "./Node2D"
import { SpriteData } from "../../modules/2d/context"
import { drawParticles, ParticleData } from "../../modules/2d/particle"

export class Particle2D extends Node2D {

    time = Number.POSITIVE_INFINITY

    constructor(
        public sprite: SpriteData,
        public props: ParticleData,
        pos: number[] = [0, 0],
        piv: number[] = [0, 0],
        scl: number | number[] = 1,
        rot: number = 0
    ) {
        super(pos, piv, scl, rot)
    }

    start(time = 0) {
        this.time = time
    }

    update(delta: number) {
        this.time += delta
        super.update(delta)
    }

    render() {
        super.render()
        drawParticles(this.mat, this.sprite, this.props, this.time, this.tint)
    }

}
