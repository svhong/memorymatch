import { useCallback, useEffect, useRef, useState } from "react";

// Owns the background-music <audio>.
//
// Browsers block autoplay, and a game embedded in a larger page shouldn't start
// playing music before the visitor has touched it. So nothing plays on mount:
// the game calls `start()` on the player's first interaction with the game.
// There are no window-level listeners, so nothing can leak out of the game.
export function useBackgroundMusic(src, { enabled = true } = {}) {
  const audioRef = useRef(null);
  const mutedRef = useRef(false);
  const [muted, setMuted] = useState(false);

  // Declared before the effect that creates the audio, so a freshly created
  // element picks up the current mute state.
  useEffect(() => {
    mutedRef.current = muted;
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  useEffect(() => {
    if (!enabled) return;
    const audio = new Audio(src);
    audio.loop = true;
    audio.muted = mutedRef.current;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [src, enabled]);

  const start = useCallback(() => {
    audioRef.current?.play().catch(() => {});
  }, []);

  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  return { muted, toggleMute, start };
}
