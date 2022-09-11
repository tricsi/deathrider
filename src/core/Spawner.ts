import { Pool } from "./Pool"

type Param = () => number;

export class Spawner<T> extends Pool<T> {

    protected time = 0
    protected count = 0

    constructor(
        protected factory: () => T,
        protected init: (item: T) => void,
        public frq: number | Param = 0,
        public limit: number = 0
    ) {
        super(factory)
        this.reset()
    }

    reset() {
        this.time = this.frq instanceof Function ? this.frq() : this.frq
    }

    get(init?: (item: T) => void): T {
        let item = null
        if (!this.limit || this.count < this.limit) {
            item = super.get(init)
            this.count++
        }
        return item
    }

    put(item: T) {
        if (this.count > 0) {
            super.put(item)
            this.count--
        }
    }

    update(delta: number) {
        if (this.frq <= 0) {
            return
        }
        this.time -= delta
        if (this.time < 0) {
            this.reset()
            this.get(this.init)
        }
    }

}
