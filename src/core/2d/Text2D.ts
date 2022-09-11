import { drawText, TextData } from "../../modules/2d/text"
import { Node2D } from "./Node2D"

export class Text2D extends Node2D {

    constructor(
        public data: TextData,
        pos = [0, 0],
        piv = [0, 0],
        scl = 1,
        rot = 0
    ) {
        super(pos, piv, scl, rot)
    }

    render() {
        super.render()
        drawText(this.mat, this.data, this.tint)
    }

}
