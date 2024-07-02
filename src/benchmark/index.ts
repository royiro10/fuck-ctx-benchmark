import { BenchmarkHandler, CLIService, ILogger, LogLevel, RL_INSTANCE, removeDirectoryRecursive } from "../shared"

import { REQUESTS } from "./requests";
import { calcBenchmarkMetric, formatMetric } from "./metric";
import { DependencyInjection, Logger, getService } from "./utils";

import { AsyncHookBenchmark } from "../my-impl";
import { WithCliHookedBenchmark } from "../with-cli-hooked";

export async function main() {
    const getCliService = (deps: ConstructorParameters<typeof CLIService>) => getService(DependencyInjection.NEW_EVERY_TIME, deps)

    const loggers = {
        _: new Logger(`Benchmark`),
        [WithCliHookedBenchmark.name]: new Logger(`${WithCliHookedBenchmark.name}-metrics`),
        [AsyncHookBenchmark.name]: new Logger(`${AsyncHookBenchmark.name}-metrics`)
    }

    const benchmarkOptions = { count: 15, verbose: true }
    const benchmarkTasks = [runBenchmark, runBenchmarkParallel, runBenchmarkWithBackgroundTasks, runBenchmarkParallelWithBackgroundTasks]

    console.log(`warming up`)
    const WARMUP_TIMEOUT_MS = 2 * 1000

    let c = 2.3
    for (; c < 10;) {
        c = Math.atan2(260, 39) * Math.pow(c, 0.89) + 1
    }
    await new Promise(res => setTimeout(res, WARMUP_TIMEOUT_MS))
    c = 2.3
    for (; c < 10;) {
        c = Math.atan2(260, 39) * Math.pow(c, 0.89) + 1
    }

    const withCliHookedBenchmark = new WithCliHookedBenchmark(getCliService)
    const asyncHookBenchmark = new AsyncHookBenchmark(getCliService)

    for (const benchmarkTask of benchmarkTasks) {
        await executeBenchmark(benchmarkTask, withCliHookedBenchmark, { ...benchmarkOptions, logger: loggers[WithCliHookedBenchmark.name] })
        await executeBenchmark(benchmarkTask, asyncHookBenchmark, { ...benchmarkOptions, logger: loggers[AsyncHookBenchmark.name] })
    }

    loggers._.log(LogLevel.INFO, `cleanup`)
    RL_INSTANCE.close();

    loggers._.log(LogLevel.INFO, `done`)
}

type BenchMarkTimes = Array<number>
type BenchMarkTask = (handler: BenchmarkHandler, logger: ILogger) => Promise<BenchMarkTimes>

async function executeBenchmark(benchMarkTask: BenchMarkTask, handler: BenchmarkHandler, opts: { count?: number, verbose?: boolean, logger?: ILogger }): Promise<BenchMarkTimes> {
    const count = opts.count ?? 1
    const verbose = opts.verbose ?? false
    const logger = opts.logger ?? console;

    logger.log(LogLevel.INFO, `execute benchmark ${count} times`)
    const accumalatedTimes = []

    for (let i = 0; i < count; i++) {
        const times = await benchMarkTask(handler, logger)

        if (verbose) {
            logger.log(LogLevel.INFO, `${handler.name} Metrics (${i}):`)

            const metrics = calcBenchmarkMetric(times)
            logger.log(LogLevel.INFO, formatMetric(metrics) + "\n")
        }

        accumalatedTimes.push(...times)

        /* cleaning files in between run to keep benchmark environemnt clean */
        // ['./do', './go', './stop'].forEach((directory) => {
        await removeDirectoryRecursive(['./do', './go', './stop']);
        // });
    }

    logger.log(LogLevel.INFO, `${handler.name} Metrics (summery):`)

    logger.log(LogLevel.INFO, `*`.repeat(20))

    const metrics = calcBenchmarkMetric(accumalatedTimes)
    logger.log(LogLevel.INFO, formatMetric(metrics))

    logger.log(LogLevel.INFO, `*`.repeat(20) + '\n')

    return accumalatedTimes
}

async function runBenchmark(benchmark: BenchmarkHandler, logger: ILogger): Promise<BenchMarkTimes> {
    logger.log(LogLevel.INFO, `run benchmark: ${benchmark.name}`)
    const times: Array<number> = [];

    await benchmark.init()

    for (const req of REQUESTS) {
        const start = performance.now()
        await benchmark.run(req)
        times.push(performance.now() - start)
    }

    return times
}

async function runBenchmarkParallel(benchmark: BenchmarkHandler, logger: ILogger): Promise<BenchMarkTimes> {
    logger.log(LogLevel.INFO, `run benchmark in parallel: ${benchmark.name}`)
    const times: BenchMarkTimes = [];

    await benchmark.init()

    const tasks = REQUESTS.map(req => async () => {
        const start = performance.now()
        benchmark.run(req)
        times.push(performance.now() - start)
    })

    await Promise.all(tasks.map(exec => exec()))

    return times
}

async function runBenchmarkWithBackgroundTasks(benchmark: BenchmarkHandler, logger: ILogger): Promise<BenchMarkTimes> {
    logger.log(LogLevel.INFO, `run benchmark with background tasks: ${benchmark.name}`)
    const times: Array<number> = [];

    await benchmark.init()

    let counter = 0
    const backGroundTask = async () => {
        await new Promise(res => setTimeout(res, 3))
        while (Math.sin(counter) * 90 < Math.cos(90) * counter)
            counter = Math.pow(counter, 2 / 3)
    }

    let shouldStop = false;
    (async () => {
        while (!shouldStop) await backGroundTask()
    })()


    for (const req of REQUESTS) {
        const start = performance.now()
        await benchmark.run(req)
        times.push(performance.now() - start)
    }

    shouldStop = true

    return times
}


async function runBenchmarkParallelWithBackgroundTasks(benchmark: BenchmarkHandler, logger: ILogger): Promise<BenchMarkTimes> {
    logger.log(LogLevel.INFO, `run benchmark in parallel with background tasks: ${benchmark.name}`)
    const times: Array<number> = [];

    await benchmark.init()

    let counter = 0
    const backGroundTask = async () => {
        await new Promise(res => setTimeout(res, 3))
        counter = Math.pow(counter, 2 / 3)
    }

    let shouldStop = false;
    (async () => {
        while (!shouldStop) await backGroundTask()
    })()

    const tasks = REQUESTS.map(req => async () => {
        const start = performance.now()
        benchmark.run(req)
        times.push(performance.now() - start)
    })

    await Promise.all(tasks.map(exec => exec()))

    shouldStop = true

    return times
}
