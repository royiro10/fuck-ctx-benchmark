import { createNamespace } from "cls-hooked";

const ns = createNamespace("fuck-ctx");

function get(key: string) {
  if (ns && ns.active) {
    return ns.get(key);
  }
}

function set(key: string, value: any) {
  if (ns && ns.active) {
    return ns.set(key, value);
  }
}

function run(fn: () => void) {
  ns.run(() => fn());
}

export const FuckCtx = {
  get,
  set,
  run,
};
