export class Pool<T> {

    protected items: T[] = []

    constructor(protected factory: () => T) {
    }

    get(init?: (item: T) => void): T {
        let item = this.items.pop()
        if (!item) {
            item = this.factory()
        }
        init && init(item)
        return item
    }

    put(item: T) {
        this.items.push(item)
    }

}
