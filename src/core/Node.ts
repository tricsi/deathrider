import { rgba, copy, multiply } from "../modules/math/math"

export class Node {

    tint: number[] = rgba(1, 1, 1)
    color: number[] = rgba(1, 1, 1)
    parent: Node = null
    children: Node[] = []
    active = true

    del(child: Node): number {
        const index = this.children.indexOf(child)
        if (index >= 0) {
            this.children.splice(index, 1)
            child.parent = null
        }
        return index
    }

    add(child: Node, index: number = -1): Node {
        const children = this.children
        if (child.parent !== this) {
            child.parent?.del(child)
        }
        if (children.indexOf(child) < 0) {
            index < 0 || index >= children.length
                ? children.push(child)
                : children.splice(index, 0, child)
            child.parent = this
        }
        return this
    }

    all(callback: (node: Node) => void, type?: Function) {
        this.each(node => node.all(callback, type))
        if (!type || this instanceof type) {
            callback(this)
        }
    }

    each(callback: (child: Node, i: number) => void) {
        for (let i = this.children.length - 1; i >= 0; i--) {
            const child = this.children[i]
            if (child && child.active) {
                callback(child, i)
            }
        }
    }

    render() {
        this.each(child => child.render())
    }

    update(delta: number) {
        this.compute()
        this.each(child => child.update(delta))
    }

    protected compute() {
        const { color, tint, parent } = this
        this.parent ? multiply(parent.tint, color, tint) : copy(tint, color)
    }

}
