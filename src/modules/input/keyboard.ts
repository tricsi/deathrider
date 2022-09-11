import { emit, on } from "../event"
import { doc } from "../utils"

export type InputData = { [code: string]: number }

const input: InputData = {}

function update(e: KeyboardEvent, down: number): boolean {
    const code = e.code
    if (input[code] !== down) {
        input[code] = down
        emit(down ? "down" : "up", code)
    }
    return false
}

on("keydown", (e: KeyboardEvent) => update(e, 1), doc)
    ("keyup", (e: KeyboardEvent) => update(e, 0), doc)

export default input
