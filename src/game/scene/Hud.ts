import { FONT } from "../../config"
import { Node2D } from "../../core/2d/Node2D"
import { Text2D } from "../../core/2d/Text2D"
import { createText } from "../../modules/2d/text"
import { on } from "../../modules/event"
import { set } from "../../modules/math/math"
import { delay } from "../../modules/scheduler"
import { load, save } from "../../modules/store"
import { Popup } from "./Popup"

export class Hud extends Node2D {

    popup = new Popup()
    left = new Text2D(createText(FONT, "", 0), [2, 1])
    right = new Text2D(createText(FONT, "", 0))
    high = 0
    score = 0

    constructor() {
        super()
        this.add(this.left)
            .add(this.right)
            .add(this.popup)
        on("collect", () => this.score++)
        on("death", async () => {
            save("high", Math.max(this.score, this.high))
            await delay(1)
            await this.popup.show()
        })
        this.reset()
    }

    reset() {
        this.score = 0;
        this.high = load("high", 0)
        const text = `BEST ${this.high}`
        this.right.data.t = text
        set(this.right.pos, 254 - text.length * 6, 1)
    }

    async start() {
        this.reset()
        await this.popup.hide()
    }

    update(delta: number): void {
        this.left.data.t = `SOULS ${this.score}`
        super.update(delta)
    }
}
