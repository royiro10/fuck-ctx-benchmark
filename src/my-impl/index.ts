import { BenchmarkHandler, CLIService } from "src/shared"
import { CtxScope } from "./asyncScope"
import { Logger } from "./logger";
import { fuckCtx } from "./fuckCtx";
export class AsyncHookBenchmark implements BenchmarkHandler {
    public name = AsyncHookBenchmark.name;

    private getCliService: (deps: ConstructorParameters<typeof CLIService>) => CLIService;
    private cliDeps: ConstructorParameters<typeof CLIService>

    constructor(getCliService: (deps: ConstructorParameters<typeof CLIService>) => CLIService) {
        this.getCliService = getCliService
        this.cliDeps = [
            new Logger(`${AsyncHookBenchmark.name}.log`)
        ]
    }

    public init(): Promise<void> {
        return new Promise(res => {
            new CtxScope(() => {
                fuckCtx.set({ flowId: crypto.randomUUID() })

                this.getCliService(this.cliDeps)
                    .init()
                    .then(res)
            })
        })
    }

    public run(req: string[]): Promise<void> {
        return new Promise(res => {
            new CtxScope(() => {
                fuckCtx.set({ flowId: crypto.randomUUID() })

                this.getCliService(this.cliDeps)
                    .run(req)
                    .then(res)
            })
        })
    }
}