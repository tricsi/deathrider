import { drawSprite, SpriteData } from "../../modules/2d/context";
import { Node2D } from "./Node2D";

export class Sprite2D extends Node2D {

    frame = 0

    constructor(
        public data: SpriteData,
        pos: number[] = [0, 0],
        piv: number[] = [0, 0],
        scl: number | number[] = 1,
        rot: number = 0
    ) {
        super(pos, piv, scl, rot)
    }

    render(): void {
        super.render()
        drawSprite(this.mat, this.data, this.frame, this.tint)
    }

}
