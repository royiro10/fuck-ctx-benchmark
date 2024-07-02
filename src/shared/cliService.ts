import { randomUUID, createHash } from "crypto";
import * as fs from "fs/promises";
import * as readline from "readline";
import { ILogger, LogLevel } from "./logger";

export const RL_INSTANCE = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export class CLIService {
  private logger: ILogger;
  private rl: readline.Interface;

  constructor(logger: ILogger) {
    this.logger = logger;
    this.rl = RL_INSTANCE;
  }

  async handleInput(command: string, input: string) {
    this.logger.log(LogLevel.INFO, `Handling input for command: ${command}`);

    if (input) {
      await this.saveInput(command, input);
      return;
    }

    this.logger.log(LogLevel.WARN, `Missing input prompting user`);

    input = await this.questionAsync("Please enter the input: ");
    this.logger.log(LogLevel.INFO, `User entered input: ${input}`);
    await this.saveInput(command, input);
    this.rl.close();
  }

  questionAsync(query: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(query, (input) => resolve(input));
    });
  }

  async saveInput(command: string, input: string) {
    const folderPath = `./${command}`;
    this.logger.log(LogLevel.INFO, `Checking if folder exists: ${folderPath}`);

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    this.logger.log(
      LogLevel.DEBUG,
      `Generated timestamp for filename: ${timestamp}`
    );

    const uuid = randomUUID();
    this.logger.log(LogLevel.DEBUG, `Generated random UUID: ${uuid}`);

    const hash = createHash("sha256")
      .update(`${timestamp}-${uuid}`)
      .digest("hex");
    this.logger.log(
      LogLevel.DEBUG,
      `Generated hash for file from: ${hash} (ts:${timestamp}, uuid:${uuid})`
    );

    const filePath = `${folderPath}/input-${hash}.txt`;
    this.logger.log(LogLevel.INFO, `Generated file path: ${filePath}`);

    this.logger.log(LogLevel.INFO, `Writing input to file: ${filePath}`);
    await fs.writeFile(filePath, input);

    this.logger.log(LogLevel.INFO, `Input saved to ${filePath}`);
  }

  async init() {
    const dirs = ["./go", "./do", "./stop"];
    this.logger.log(
      LogLevel.INFO,
      `Start Init process for: [${dirs.join(", ")}]`
    );

    for (const folderPath of dirs) {
      try {
        await fs.access(folderPath);
        this.logger.log(LogLevel.INFO, `Folder already exists: ${folderPath}`);
      } catch (err) {
        this.logger.log(
          LogLevel.WARN,
          `Folder does not exist. Creating folder: ${folderPath}`
        );
        await fs.mkdir(folderPath);
      }
    }

    this.logger.log(LogLevel.INFO, `Init successfully`);
  }

  async run(args: string[]) {
    const command = args[0];
    this.logger.log(LogLevel.INFO, `Received command: ${command}`);

    const input = args[1];
    this.logger.log(LogLevel.INFO, `Received input: ${input}`);

    if (["do", "go", "stop"].includes(command)) {
      this.logger.log(LogLevel.INFO, `Command is valid: ${command}`);
      await this.handleInput(command, input);
    } else {
      this.logger.log(
        LogLevel.ERROR,
        'Unknown command. Please use "do", "go", or "stop".'
      );
      this.rl.close();
    }

    this.logger.log(LogLevel.INFO, "CLI tool execution finished");
  }
}
