import * as fs from "fs"

export const LogLevel = {
    DEBUG: `Debug`,
    INFO: `Information`,
    WARN: `Warning`,
    ERROR: `Error`,
} as const;

export type LogLevel = typeof LogLevel[keyof typeof LogLevel]


export interface ILogger {
    log: (level: LogLevel, message: string) => void
}

export abstract class BaseLogger implements ILogger {
    private logFilePath: string

    constructor(logFilePath = "logs.log") {
        this.logFilePath = logFilePath;
        this.initializeLogFile();
    }

    public abstract log(level: LogLevel, message: string): void;

    private initializeLogFile() {
        // Check if the log file exists, create it if it doesn't
        if (!fs.existsSync(this.logFilePath)) {
            fs.writeFileSync(this.logFilePath, "");
        }
    }

    protected _doWriteLog(logMsg: any) {
        this.writeTextLog(logMsg)
    }

    /* disabled log file to keep service's log file at a noraml size */
    protected _writeLog(logMsg: any) {
        console.log(JSON.stringify(logMsg));
        // this.writeTextLog(logMsg)
    }

    private writeJsonLog(logMsg: any) {
        fs.appendFileSync(this.logFilePath, JSON.stringify(logMsg) + "\n");
    }

    private writeTextLog(logMsg: any) {
        const { timestamp, level, message, ...other } = logMsg;
        const textMsg = `time=${timestamp} level=${level} msg="${message}" ${Object.entries(other).map(([k, v]) => `${k}=${v}`).join(" ")}`;
        fs.appendFileSync(this.logFilePath, textMsg + "\n");
    }
}