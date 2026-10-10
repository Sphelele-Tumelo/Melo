// utils/typewriter.ts

export function createTypewriter(onUpdate: (revealedText: string) => void) {
  let buffer = "";
  let revealed = "";
  let isRunning = false;
  let isFinished = false;
  let isStopped = false;

  const CHARS_PER_TICK = 8;
  const TICK_MS = 8;

  function tick() {
    if (isStopped) return;

    if (buffer.length === 0) {
      isRunning = false;
      return;
    }

    const next = buffer.slice(0, CHARS_PER_TICK);
    buffer = buffer.slice(CHARS_PER_TICK);
    revealed += next;

    onUpdate(revealed);

    if (buffer.length === 0) {
      isRunning = false;
      if (!isFinished) {
        return;
      }
      return;
    }

    setTimeout(tick, TICK_MS);
  }

  function push(chunk: string) {
    if (isStopped || isFinished) return;
    buffer += chunk;
    if (!isRunning) {
      isRunning = true;
      tick();
    }
  }

  function finish() {
    isFinished = true;

    if (isStopped || buffer.length === 0) {
      return;
    }

    if (!isRunning) {
      isRunning = true;
      tick();
    }
  }

  function stop() {
    isStopped = true;
    isRunning = false;
    buffer = "";
    revealed = "";
    isFinished = false;
  }

  function isDone() {
    return isFinished && buffer.length === 0 && !isRunning;
  }

  return { push, finish, stop, isDone };
}