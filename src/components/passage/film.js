// The frames of the scroll film, fetched as needed and painted on a canvas.
//
// A film is a folder of numbered frames: 0000.webp, 0001.webp, and so on.
// They are fetched a few at a time, the ones nearest the frame being shown
// first: a coarse pass (every 8th frame), then the gaps. Until a frame has
// arrived the nearest one that has is painted instead, so the picture is
// never blank and only sharpens in time as the rest come in.
//
//   const film = createFilm(canvas, { base: "/passage/d", count: 294, onFirstFrame, onError });
//   film.start();        begin fetching
//   film.show(120.4);    paint the frame nearest to this position
//   film.resize();       the canvas changed size
//   film.destroy();

const PARALLEL = 6;
const name = (index) => `${String(index).padStart(4, "0")}.webp`;
// 0 for every 8th frame, 1 for every 4th, 2 for every 2nd, 3 for the rest.
const pass = (index) => (index % 8 === 0 ? 0 : index % 4 === 0 ? 1 : index % 2 === 0 ? 2 : 3);

export function createFilm(canvas, { base, count, onFirstFrame, onError }) {
  const context = canvas.getContext("2d", { alpha: false });
  const frames = new Array(count).fill(null); // each loaded <img>, in order
  const waiting = new Set(frames.keys());
  let fetching = 0;
  let failed = 0;
  let wanted = 0;
  let painted = -1;
  let paintFrame = 0;
  let started = false;
  let stopped = false;
  let any = false;

  function nearestLoaded(index) {
    for (let distance = 0; distance < count; distance += 1) {
      if (frames[index - distance]) return index - distance;
      if (frames[index + distance]) return index + distance;
    }
    return -1;
  }

  function paint() {
    paintFrame = 0;
    const index = nearestLoaded(wanted);
    if (index < 0 || index === painted) return;
    const image = frames[index];
    // Fill the canvas, cropping whatever does not fit ("cover").
    const scale = Math.max(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;
    context.drawImage(image, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
    painted = index;
  }
  function requestPaint() {
    if (!paintFrame && !stopped) paintFrame = requestAnimationFrame(paint);
  }

  function fetchMore() {
    while (!stopped && fetching < PARALLEL && waiting.size) {
      let next = -1;
      let best = Infinity;
      waiting.forEach((index) => {
        const score = pass(index) * count + Math.abs(index - wanted);
        if (score < best) {
          best = score;
          next = index;
        }
      });
      waiting.delete(next);
      fetching += 1;
      const image = new Image();
      image.decoding = "async";
      image.onload = () => {
        fetching -= 1;
        if (stopped) return;
        frames[next] = image;
        if (!any) {
          any = true;
          onFirstFrame?.();
        }
        requestPaint();
        fetchMore();
      };
      image.onerror = () => {
        fetching -= 1;
        failed += 1;
        // Nothing has loaded and several tries have failed: give up, so the
        // page stays as it is without the film.
        if (!any && failed >= 3) {
          stopped = true;
          onError?.();
          return;
        }
        fetchMore();
      };
      image.src = `${base}/${name(next)}`;
    }
  }

  function resize() {
    // Sharp enough on dense screens without drawing more than is needed.
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = Math.round(canvas.clientWidth * ratio);
    const height = Math.round(canvas.clientHeight * ratio);
    if (!width || !height || (width === canvas.width && height === canvas.height)) return;
    canvas.width = width;
    canvas.height = height;
    painted = -1;
    requestPaint();
  }

  return {
    start() {
      if (started) return;
      started = true;
      resize();
      fetchMore();
    },
    show(position) {
      wanted = Math.max(0, Math.min(count - 1, Math.round(position)));
      requestPaint();
    },
    resize,
    destroy() {
      stopped = true;
      cancelAnimationFrame(paintFrame);
      waiting.clear();
    },
  };
}
