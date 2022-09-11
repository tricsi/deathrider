export const doc = document

export const mobile = navigator.userAgent.toLowerCase().match(/android|iphone|ipad|ipod/)?.shift()

export const fs = async () => doc.fullscreenElement || await doc.body.requestFullscreen()

export function $<T = Element>(query: string, element: Element | Document = doc): T | undefined {
    return element.querySelector(query) as any
}

export function rnd(max: number = 1, seed: number = 0, round: number = 0): number {
    if (max <= 0) {
        return max
    }
    const mod = 233280
    rnd.SEED = (rnd.SEED * 9301 + 49297) % mod
    seed = seed ? rnd.SEED * seed % mod : rnd.SEED
    let value = (seed / mod) * max
    return round ? Math.round(value) : value
}

rnd.SEED = Math.random()
