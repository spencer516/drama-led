export function range(start: number, length: number): number[] {
  return Array.from({ length }, (_, index) => index + start);
}

export function invariant(
  condition: any,
  message: string,
): asserts condition {
  if (condition) {
    return;
  }

  throw new Error(`Invariant failed: ${message}`);
}

export function startEventLoop(callback: () => void, frequency: number): () => void {
  console.log('Starting event loop: %d', performance.now());
  let intervalID = setInterval(tick, frequency);

  function tick() {
    console.log('Tick: %d', performance.now());
    callback();
  }

  return () => {
    console.log('Canceling event loop!: %d', performance.now());
    clearInterval(intervalID);
  }
}