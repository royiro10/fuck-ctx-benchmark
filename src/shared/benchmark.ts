export interface BenchmarkHandler {
    init(): Promise<void>;
    run(req: string[]): Promise<void>
    name: string
}