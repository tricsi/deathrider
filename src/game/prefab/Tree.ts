
import { Particle2D } from "../../core/2d/Particle2D";
import { createSprite } from "../../modules/2d/context";
import { m3scale, m3translate } from "../../modules/math/mat3";
import { rnd } from "../../modules/utils";

export class Trees extends Particle2D {

    constructor() {
        super(createSprite("tree"), {
            n: 7,
            r: Math.PI / 2,
            s: Math.random(),
            t: 40,
            v: 8,
            u: (m, _, l) => {
                const s = rnd(.5, l) + 1
                const f = Math.sign(rnd() - .5) || 1
                m3scale(m3translate(m, [0, -40 * s]), [s * f, s])
            }
        }, [256, 130]);
        this.start(40)
    }

}
