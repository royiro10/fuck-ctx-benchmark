import { AsyncLocalStorage } from 'node:async_hooks';

const asyncLocalStorage = new AsyncLocalStorage<CtxScope>();

export interface CtxScope {
    [key: symbol]: unknown;
}

export class CtxScope {
    static get() {
        const scope = asyncLocalStorage.getStore();
        if (!scope) {
            throw new Error('Scope not found');
        }

        return scope;
    }

    constructor(callback: () => void) {
        const parentScope = asyncLocalStorage.getStore();
        if (parentScope) {
            Object.setPrototypeOf(this, parentScope);
        }

        asyncLocalStorage.run(this, callback);
    }
}

export abstract class CtxVar<T> {
    private readonly name: string
    private readonly symbol: symbol;

    constructor(name: string) {
        this.name = name;
        this.symbol = Symbol(name)
    }

    public set(value: T) {
        const scope = CtxScope.get();

        scope[this.symbol] = value;
    }

    public get(): T {
        if (!this.exists()) {
            throw new Error(`Varialble "${this.name}" not found`);
        }

        const scope = CtxScope.get();

        return scope[this.symbol] as T;
    }

    public exists(): boolean {
        const scope = CtxScope.get();

        return this.symbol in scope;
    }
}
