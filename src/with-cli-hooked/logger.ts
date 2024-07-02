import { FuckCtx } from "./fuck_ctx";
import { BaseLogger, LogLevel } from "../shared"

export class Logger extends BaseLogger {
  constructor(logFilePath?: string) {
    super(logFilePath)
  }

  log(level: LogLevel, message: string) {
    this._writeLog({
      level,
      message,
      timestamp: new Date().toISOString(),
      flowId: FuckCtx.get("flowId"),
    })
  }
}
