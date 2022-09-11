import { SPEED } from "../../config"
import { Node2D } from "../../core/2d/Node2D"
import { createSprite } from "../../modules/2d/context"
import { createTilemap, drawTilemap} from "../../modules/2d/tilemap"
import { X } from "../../modules/math/math"

export class Ground extends Node2D
{

    pos = [0, 128]
    map = createTilemap("a9", 9, 1)
    sprite = createSprite("ground", 32, 16, 1)

    update(delta: number): void {
        this.pos[X] = (SPEED[X] * delta + this.pos[X]) % this.sprite.w
        super.update(delta)
    }

    render(): void {
        drawTilemap(this.mat, this.sprite, this.map)
    }
}
