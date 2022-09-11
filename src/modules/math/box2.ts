
export function b2v2([bx, by, bw, bh]: number[], [x, y]: number[]): boolean {
    return bx <= x && bx + bw >= x && by <= y && by + bh >= y;
}

export function b2b2([ax, ay, aw, ah]: number[], [bx, by, bw, bh]: number[]): boolean {
    return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

export function b2contains([ax, ay, aw, ah]: number[], [bx, by, bw, bh]: number[]): boolean {
    return ax <= bx && ax + aw >= bx + bw && ay <= by && ay + ah >= by + bh;
}

export function b2add(out: number[], [bx, by, bw, bh]: number[]): number[] {
    const [ ax, ay, aw, ah ] = out;
    out[0] = Math.min(ax, bx);
    out[1] = Math.min(ay, by);
    out[2] = Math.max(ax + aw, bx + bw) - out[0];
    out[3] = Math.max(ay + ah, by + bh) - out[1];
    return out;
}

export function b2intersect([Ax, Ay, Aw, Ah]: number[], [Bx, By, Bw, Bh]: number[], out: number[] = []): number[] {
    let AX = Ax + Aw,
        AY = Ay + Ah,
        BX = Bx + Bw,
        BY = By + Bh;
    out[0] = Ax < Bx ? Bx : Ax;
    out[1] = Ay < By ? By : Ay;
    out[2] = (AX < BX ? AX : BX) - out[0];
    out[3] = (AY < BY ? AY : BY) - out[1];
    return out;
}
