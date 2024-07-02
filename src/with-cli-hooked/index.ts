import { BenchmarkHandler, CLIService } from "../shared"
import { FuckCtx } from "./fuck_ctx";
import { Logger } from "./logger";

export class WithCliHookedBenchmark implements BenchmarkHandler {
    public name = WithCliHookedBenchmark.name;

    private getCliService: (deps: ConstructorParameters<typeof CLIService>) => CLIService;
    private cliDeps: ConstructorParameters<typeof CLIService>

    constructor(getCliService: (deps: ConstructorParameters<typeof CLIService>) => CLIService) {
        this.getCliService = getCliService
        this.cliDeps = [
            new Logger(`${WithCliHookedBenchmark.name}.log`)
        ]
    }

    public init(): Promise<void> {
        return new Promise(res => {
            FuckCtx.run(() => {
                FuckCtx.set("flowId", crypto.randomUUID());

                this.getCliService(this.cliDeps)
                    .init()
                    .then(res)
            })
        })
    }

    public run(req: string[]): Promise<void> {
        return new Promise(res => {
            FuckCtx.run(() => {
                FuckCtx.set("flowId", crypto.randomUUID());

                this.getCliService(this.cliDeps)
                    .run(req)
                    .then(res)
            })
        })
    }
}
