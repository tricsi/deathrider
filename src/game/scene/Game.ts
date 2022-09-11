import { MUSIC, SPEED } from "../../config";
import { Node2D } from "../../core/2d/Node2D";
import { mixer, play } from "../../modules/audio";
import { IEvent, on } from "../../modules/event";
import { X } from "../../modules/math/math";
import { delay } from "../../modules/scheduler";
import { Bats } from "../prefab/Bat";
import { Blocks } from "../prefab/Block";
import { Bullets } from "../prefab/Bullet";
import { Graves } from "../prefab/Grave";
import { Ground } from "../prefab/Ground";
import { Skull } from "../prefab/Skull";
import { Sky } from "../prefab/Sky";
import { Trees } from "../prefab/tree";
import { Hud } from "./Hud";

export class Game extends Node2D {

    runs = false
    speed = 0
    hud = new Hud
    bats = new Bats
    blocks = new Blocks
    skull = new Skull
    graves = new Graves
    ground = new Ground
    bullets = new Bullets(this.skull.pos)
    theme: AudioBufferSourceNode;

    constructor() {
        super()
        this.add(this.hud)
            .add(this.ground)
            .add(this.skull)
            .add(this.bullets)
            .add(this.graves)
            .add(this.bats)
            .add(this.blocks)
            .add(new Trees)
            .add(new Sky)
        on("all", ([_, name]: IEvent) => play(name))
        on("death", async () => {
            this.skull.death()
            await delay(2, t => {
                this.speed = 1 - t * t
                mixer("music", (1 - t * t) * MUSIC)
            })
            this.theme.stop()
            this.runs = false
        });
        on("down", ([key]: IEvent<string>) => {
            if (!this.runs) {
                this.start()
            } else if (key === "Escape") {
                this.speed = this.speed ? 0 : 1
            } else {
                this.skull.init()
            }
        });
    }

    start() {
        SPEED[X] = -100
        this.hud.start()
        this.skull.start()
        this.blocks.clear()
        this.graves.clear()
        this.bullets.clear()
        this.bats.clear()
        this.speed = 1
        this.runs = true
        mixer("music", MUSIC)
        this.theme = play("theme", true, "music")
    }

    update(delta: number): void {
        SPEED[X] -= delta
        this.bullets.fire = this.skull.up > 0 && this.skull.parent === this
        super.update(delta * this.speed);
    }

}
