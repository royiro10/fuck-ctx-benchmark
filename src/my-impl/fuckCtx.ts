import { CtxVar } from "./asyncScope"

export interface Ctx {
    flowId: string,
}

export class FuckCtx extends CtxVar<Ctx> {
    constructor() {
        super(FuckCtx.name)
    }
}

export const fuckCtx = new FuckCtx()
