import { CENTER, FONT } from "../../config";
import { Node2D } from "../../core/2d/Node2D";
import { Sprite2D } from "../../core/2d/Sprite2D";
import { Text2D } from "../../core/2d/Text2D";
import { createSprite } from "../../modules/2d/context";
import { createText } from "../../modules/2d/text";
import { audio, music, sound, SoundProps, wave } from "../../modules/audio";
import { off, on } from "../../modules/event";
import { A, set } from "../../modules/math/math";
import { delay } from "../../modules/scheduler";
import { doc } from "../../modules/utils";
import { Game } from "./Game";
import { Overlay } from "./Overlay";

export class Loader extends Node2D {

    logo = new Sprite2D(createSprite("logo"), [0, 0], [32, 12], 2)
    layer = new Node2D()
    txt = new Text2D(createText(FONT), [0, 20])

    constructor() {
        super(CENTER)
        this.text = "PRESS TO START"
        this.add(this.logo)
            .add(this.layer)
        this.layer
            .add(this.txt)
            .add(new Overlay)
        on("click keydown", this.load, doc)
        this.init()
    }

    set text(value: string) {
        this.txt.data.t = value
        set(this.txt.piv, value.length * 3.5, 4)
    }

    async init() {
        this.txt.color[A] = 0
        await delay(.5, t => {
            this.logo.scl = (1 - t) ** 2 * 20 + 2
            this.logo.color[A] = t * t
        })
        await delay(.2, t => {
            this.txt.color[A] = t
        })
    }

    load = async () => {
        off("click keydown", this.load, doc)
        this.text = "LOADING..."
        const mid: SoundProps = ["sawtooth", .3, [1, .5]]
        const chip: SoundProps = [wave((n) => 4 / (n * Math.PI) * Math.sin(Math.PI * n * .18)), .3, [1, .3]]
        const cord: SoundProps = [[1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1], .3, [.5, 1, .5]]
        await audio(22050)
        await sound("hit", ["custom", .1, [.5, 0]], 220)
        await sound("fire", ["custom", .3, [.2, .4, 0]], [440, 110])
        await sound("bonk", ["sine", 0.3, [2, 0.4, 0]], [110, 15, 0])
        await sound("collect", ["sine", 0.3, [2, 0]], [110, 220])
        await music("theme", [
            [mid, "8|8|12e4e3,1gb4gb3,1,1gb4gb3,1,12e4e3,4|2|4e4,2g4,1e4,1g4,4gb4,4f4,4e4,2g4,1e4,1g4,1gb4,1,1gb4,1,4f4|2|12e4e3,1gb4gb3,1,1gb4gb3,1,12e4e3,4", .2],
            [cord, "8|4|8a2e3,4e3b3,2eb3bb3,2d3a3|12", .2],
            [chip, "1a1,1e2,1c2,1e2,1a1,1e2,1c2,1e2,1a1,1eb2,1b1,1eb2,1a1,1f2,1bb1,1f2|14", .2]
        ]);
        this.parent.add(new Game)
        await delay(.5, t => {
            set(this.logo.pos, 0, t ** 4 * -60)
            this.logo.scl = (1 - t * t) + 1
            this.layer.color[A] = 1 - t
        })
        this.del(this.layer)
    }

}
