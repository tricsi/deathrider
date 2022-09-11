import { raycast } from "../../modules/2d/context";
import pointer from "../../modules/input/pointer";
import { computePolygon, createPolygon, createResponse, IPolygon, IResponse, pointInPolygon, testPolygonPolygon } from "../../modules/math/sat";
import { Node } from "../Node";
import { Node2D } from "./Node2D";

const RES: IResponse = createResponse()
const POLYS = new Set<Poly2D>()

export function physics(node: Node) {
    node.all((next: Poly2D) => {
        for (const prev of POLYS) {
            if (prev.mask & next.layer && testPolygonPolygon(prev.poly, next.poly, RES)) {
                prev.on && prev.on(next, RES)
            }
            if (next.mask & prev.layer && testPolygonPolygon(next.poly, prev.poly, RES)) {
                next.on && next.on(prev, RES)
            }
        }
        POLYS.add(next)
    }, Poly2D)
    POLYS.clear()
}

export const hover = (node: Poly2D, vec: number[] = raycast(pointer)) => pointInPolygon(vec, node.poly);

export class Poly2D extends Node2D {

    poly: IPolygon

    constructor(
        points: number[],
        public layer: number = 1,
        public mask: number = 0,
        public on?: (poly: Poly2D, res: IResponse) => void
    ) {
        super()
        this.poly = createPolygon(points)
    }

    protected compute(): void {
        super.compute()
        computePolygon(this.poly, this.mat)
    }

}
