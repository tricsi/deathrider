import { PTC } from "../../config";
import { Sprite2D } from "../../core/2d/Sprite2D";
import { rgba } from "../../modules/math/math";

export class Overlay extends Sprite2D {

    constructor(alpha = 1) {
        super(PTC, [0, 0], [1.5, 1.5], [100, 50])
        this.color = rgba(0, 0, 0, alpha)
    }

}
