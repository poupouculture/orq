// debounce.ts
export function debounce<A = unknown, R = void>(
  fn: (args?: A) => R,
  ms: number,
  immediate?: boolean
): [(args?: A) => Promise<R>, () => void] {
  let timer: NodeJS.Timeout | null;

  const debouncedFunc = (args?: A): Promise<R> =>
    new Promise((resolve) => {
      if (timer) {
        clearTimeout(timer);
      }
      immediate && !timer && fn(args);
      timer = setTimeout(() => {
        resolve(fn(args));
        teardown();
        timer = null;
      }, ms);
    });

  const teardown = () => timer && clearTimeout(timer);

  return [debouncedFunc, teardown];
}
