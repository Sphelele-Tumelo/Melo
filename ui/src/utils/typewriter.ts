// utils/typewriter.ts

export function createTypewriter(onUpdate: (revealedText: string) => void) {
  let buffer = "";
  let revealed = "";
  let isRunning = false;
  let isFinished = false;
  let isStopped = false;

  const CHARS_PER_TICK = 8;   // was 3 — reveal bigger chunks per tick
  const TICK_MS = 8;          // was 12 — fire more often

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

    setTimeout(tick, TICK_MS);
  }

  function push(chunk: string) {
    if (isStopped) return;
    buffer += chunk;
    if (!isRunning) {
      isRunning = true;
      tick();
    }
  }

  function finish() {
    isFinished = true;
  }

  function stop() {
    isStopped = true;
    buffer = "";
  }

  function isDone() {
    return isFinished && buffer.length === 0;
  }

  return { push, finish, stop, isDone };
}