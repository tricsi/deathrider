export type IEvent<T = any> = [T, string]
export type Listener = (event?: IEvent) => void
export type Listeners = Map<string, Set<Listener>>

const defaultListeners: Listeners = new Map<string, Set<Listener>>()

function parse(event: string) {
    return event.replace(/[^-_\w]+/, " ").trim().split(" ").filter(v => !!v)
}

export function on(
    event: string,
    listener: Listener | EventListenerOrEventListenerObject,
    listeners: any = defaultListeners
) {
    for (const name of parse(event)) {
        listeners instanceof Map
            ? listeners.get(name)?.add(listener) || listeners.set(name, new Set<Listener>().add(listener as Listener))
            : listeners.addEventListener(name, listener, false)
    }
    return on
}

export function off(
    event: string,
    listener: Listener | EventListenerOrEventListenerObject,
    listeners: any = defaultListeners
) {
    for (const name of parse(event)) {
        listeners instanceof Map
            ? listeners.get(name)?.delete(listener)
            : listeners.removeEventListener(name, listener, false)
    }
    return off
}

export function emit(
    name: string,
    data?: any,
    listeners: any = defaultListeners
) {
    const event: IEvent = [data, name]
    listeners.get("all")?.forEach((listener: Listener) => listener(event))
    listeners.get(name)?.forEach((listener: Listener) => listener(event))
    return emit
}
