import { BaseLogger, LogLevel } from "../shared"
import { fuckCtx } from "./fuckCtx"

export class Logger extends BaseLogger {
    constructor(logFilePath?: string) {
        super(logFilePath)
    }

    log(level: LogLevel, message: string) {
        this._writeLog({
            level,
            message,
            timestamp: new Date().toISOString(),
            flowId: fuckCtx.get().flowId,
        })
    }
}
