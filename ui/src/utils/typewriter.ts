export function createTypewriter(
  onUpdate: (text: string) => void,
  onDrained?: () => void,
) {
  let buffer = "";
  let revealed = "";
  let running = false;
  let finished = false;
  let stopped = false;
  let drainedCalled = false;

  function frame() {
    if (stopped) return;

    if (buffer.length === 0) {
      running = false;
      if (finished && !drainedCalled) {
        drainedCalled = true;
        onDrained?.();
      }
      return;
    }

    // Far behind -> reveal more per frame; live trickle -> steady 2 chars
    const n = Math.max(2, Math.ceil(buffer.length / 20));
    revealed += buffer.slice(0, n);
    buffer = buffer.slice(n);
    onUpdate(revealed);

    requestAnimationFrame(frame);
  }

  function ensureRunning() {
    if (!running && !stopped) {
      running = true;
      requestAnimationFrame(frame);
    }
  }

  return {
    push(chunk: string) {
      if (stopped) return;
      buffer += chunk;
      ensureRunning();
    },
    finish() {
      finished = true;
      ensureRunning();
    },
    stop() {
      stopped = true;
      buffer = "";
      running = false;
    },
  };
}