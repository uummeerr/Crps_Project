"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";

// How fast the silent background clip plays. Keep it at 1.25 or below.
const LOOP_SPEED = 1.25;

// The clinic film. Behind the play button, a short silent clip (`loop`) plays
// on repeat while the frame is on screen. Pressing play swaps it for the full
// film (`src`) with sound and its normal controls; the full film is not
// downloaded before that.
//
// `loop` is a separate small file cut from the full film (0:03 to 0:25), so
// visitors do not download the whole film for the background. To cut it again:
//   ffmpeg -ss 3 -to 25 -i video.mp4 -an -vf scale=1280:-2 -c:v libx264 -crf 26 -movflags +faststart video-loop.mp4
export default function Film({ src, loop, poster, title, label }) {
  const frameRef = useRef(null);
  const videoRef = useRef(null);
  const loopRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  // Play the background clip only while the frame is in view. With "reduce
  // motion" turned on it stays on the still photo.
  useEffect(() => {
    const frame = frameRef.current;
    const clip = loopRef.current;
    if (!frame || !clip || playing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    clip.muted = true;
    clip.defaultPlaybackRate = LOOP_SPEED;
    clip.playbackRate = LOOP_SPEED;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) clip.play().catch(() => {});
        else clip.pause();
      },
      { threshold: 0.15 },
    );
    observer.observe(frame);
    return () => {
      observer.disconnect();
      clip.pause();
    };
  }, [playing, loop]);

  function play() {
    setPlaying(true);
    videoRef.current?.play().catch(() => setPlaying(false));
  }

  return (
    <div className="film" data-reveal="scale" ref={frameRef}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        preload="none"
        playsInline
        controls={playing}
        onEnded={() => setPlaying(false)}
      />
      {loop && !playing ? (
        <video
          ref={loopRef}
          src={loop}
          poster={poster}
          preload="none"
          muted
          loop
          playsInline
          disablePictureInPicture
          tabIndex={-1}
          aria-hidden="true"
        />
      ) : null}
      {playing ? null : (
        <button type="button" className="film-cover" onClick={play} aria-label={`Play: ${title}`}>
          <span className="film-play" aria-hidden="true">
            <Play />
          </span>
          <span className="film-caption">
            <strong>{title}</strong>
            <span>{label}</span>
          </span>
        </button>
      )}
    </div>
  );
}
