import { CENTER, FONT } from "../../config";
import { Node2D } from "../../core/2d/Node2D";
import { Text2D } from "../../core/2d/Text2D";
import { createText } from "../../modules/2d/text";
import { A } from "../../modules/math/math";
import { delay } from "../../modules/scheduler";
import { Overlay } from "./Overlay";

export class Popup extends Node2D {

    over = new Text2D(createText(FONT, "GAME OVER"), [0, 0], [32, 4], 2)
    press = new Text2D(createText(FONT, "PRESS TO START"), [0, 20], [49, 4])

    constructor() {
        super(CENTER);
        this.over.active = false
        this.add(this.over)
            .add(this.press)
            .add(new Overlay(.7))
    }

    async show() {
        this.over.active = true
        await delay(.3, t => {
            this.scl = (1 - t) * .1 + 1
            this.color[A] = t
        })
    }

    async hide() {
        await delay(.3, t => {
            this.scl = t * .1 + 1
            this.color[A] = 1 - t
        })
    }

}
