import { BaseLogger, CLIService, LogLevel } from "../shared"

export const DependencyInjection = {
    SINGLETON: `singleton`,
    NEW_EVERY_TIME: `new`
} as const

export type DependencyInjection = (typeof DependencyInjection)[keyof typeof DependencyInjection]

export const singletonInstances: Record<string, any> = {}

export function getService(depStrategy: DependencyInjection, deps: ConstructorParameters<typeof CLIService>): CLIService {
    switch (depStrategy) {
        case DependencyInjection.NEW_EVERY_TIME: return new CLIService(...deps)
        case DependencyInjection.SINGLETON: {
            if (!singletonInstances[CLIService.name]) {
                singletonInstances[CLIService.name] = new CLIService(...deps)
            }

            return singletonInstances[CLIService.name]
        }
        default:
            throw new Error(`unkown dependecy injection pattarn. actual: ${depStrategy}, expected: ${Object.values(DependencyInjection).join(" | ")}`)
    }
}

export class Logger extends BaseLogger {
    constructor(name: string) {
        super(`./${name}.log`)
    }

    public log(level: LogLevel, message: string): void {
        this._writeLog({ message, timestamp: new Date().toISOString(), level })
    }
}
