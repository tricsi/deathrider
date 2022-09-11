import { PTC } from "../../config";
import { Particle2D } from "../../core/2d/Particle2D";
import { rnd } from "../../modules/utils";

export class Sky extends Particle2D {

    constructor() {
        super(PTC, {
            n: 50,
            h: 120,
            r: Math.PI / 2,
            s: 1,
            f: 5,
            c: (_, l) => [1, 1, rnd(.6) + .3, rnd(.5) + .2],
            t: 64,
            v: 4,
        }, [256, 60]);
        this.start(64)
    }

}
