import input from "./keyboard"
import { emit, on } from "../event"
import { doc } from "../utils"

const pointer: number[] = [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]

function update(e?: MouseEvent | Touch, down?: number) {
    if (e) {
        pointer[0] = e.clientX
        pointer[1] = e.clientY
        emit("pointer", pointer)
    }
    if (down !== undefined) {
        const target = "Mouse" + (e instanceof MouseEvent ? e.button : 0)
        input[target] = down
        emit(down ? "down" : "up", target)
    }
}

on("contextmenu", (e: MouseEvent) => e.preventDefault(), doc)
    ("mousemove", (e: MouseEvent) => update(e), doc)
    ("mousedown", (e: MouseEvent) => update(e, 1), doc)
    ("mouseup", (e: MouseEvent) => update(e, 0), doc)
    ("touchstart", (e: TouchEvent) => update(e.touches[0], 1), doc)
    ("touchmove", (e: TouchEvent) => update(e.touches[0]), doc)
    ("touchend", (e: TouchEvent) => update(e.touches[0], 0), doc)

export default pointer
