import { useEffect, useRef, useState } from "react";

// Owns the <audio> element. Browsers block autoplay, so if the first play()
// is rejected we retry on the user's first interaction with the page.
export function useBackgroundMusic(src) {
  const audioRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  useEffect(() => {
    // `active` guards against an effect that has already been cleaned up
    // (e.g. React StrictMode's double mount): a rejected play() promise from
    // a discarded Audio must not register a listener that later starts an
    // orphaned track which the mute button can't reach.
    let active = true;
    const audio = new Audio(src);
    audio.loop = true;
    audio.muted = mutedRef.current;
    audioRef.current = audio;

    const start = () => {
      if (active) audio.play().catch(() => {});
    };
    audio.play().catch(() => {
      if (active) window.addEventListener("pointerdown", start, { once: true });
    });

    return () => {
      active = false;
      window.removeEventListener("pointerdown", start);
      audio.pause();
    };
  }, [src]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  return { muted, toggleMute: () => setMuted((m) => !m) };
}
