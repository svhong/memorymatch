import { useEffect, useRef, useState } from "react";

// Owns the <audio> element. Browsers block autoplay, so if the first play()
// is rejected we retry on the user's first interaction with the page.
export function useBackgroundMusic(src) {
  const audioRef = useRef(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audioRef.current = audio;

    const start = () => audio.play().catch(() => {});
    audio.play().catch(() => {
      window.addEventListener("pointerdown", start, { once: true });
    });

    return () => {
      window.removeEventListener("pointerdown", start);
      audio.pause();
    };
  }, [src]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  return { muted, toggleMute: () => setMuted((m) => !m) };
}
