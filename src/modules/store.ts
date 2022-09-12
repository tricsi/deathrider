const prefix = 'deathrider_'
const defaultStore: Storage = localStorage

export function save<T = any>(name: string, value?: T, store: Storage = defaultStore) {
    value !== undefined
        ? store.setItem(prefix + name, JSON.stringify(value))
        : store.removeItem(prefix + name)
}

export function load<T = any>(name: string, defaultValue: T = null, store: Storage = defaultStore): T {
    try {
        const value = store.getItem(prefix + name)
        if (value) {
            return JSON.parse(value) as T
        }
    } catch (_) { }
    return defaultValue
}

