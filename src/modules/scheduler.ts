import { on } from "./event"
import { doc } from "./utils";

export type TaskFunc = (delta: number) => void
export type TaskData = [TaskFunc, number, number];

export const Scheduler = { scale: 1, time: now() }
const tasks: TaskData[] = []

function reset() {
    Scheduler.time = now();
}

export function now(): number {
    return performance.now() / 1000
}

export function update() {
    requestAnimationFrame(update)
    const time = now()
    const delta = time - Scheduler.time
    Scheduler.time = time
    for (const [task, fixed] of tasks) {
        let d = delta
        while (d > fixed) {
            task(fixed * Scheduler.scale)
            d -= fixed
        }
        task(d * Scheduler.scale)
    }
}

export function schedule(task: TaskFunc, weight = 0, fps = 0) {
    tasks.push([task, 1 / fps, weight])
    tasks.sort((a, b) => a[2] - b[2])
}

export function unschedule(callback: TaskFunc) {
    for (let i = tasks.length - 1; i >= 0; i--) {
        if (tasks[i][0] === callback) {
            tasks.splice(i, 1)
        }
    }
}

export function delay(sec: number, tween?: (t: number) => void, stop?: () => boolean): Promise<void> {
    return new Promise<void>((resolve) => {
        let time = sec
        const callback = (delta: number) => {
            time -= delta
            if (time <= 0 || (stop && stop())) {
                unschedule(callback)
                tween && tween(1)
                resolve()
            } else {
                tween && tween(1 - time / sec)
            }
        }
        schedule(callback)
        callback(0)
    })
}

on("visibilitychange", () => doc.hidden || reset(), doc)
