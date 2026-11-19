import { useMemoryGame } from "./hooks/useMemoryGame";
import { useBackgroundMusic } from "./hooks/useBackgroundMusic";
import { MUSIC } from "./assets";
import Board from "./components/Board";
import StatsPanel from "./components/StatsPanel";
import WinModal from "./components/WinModal";
import styles from "./MemoryGame.module.css";

/**
 * Memory Match. Drop it into any element; it fills that element's size.
 *
 * @param {object}  props
 * @param {string}  [props.className] extra class for the outer box
 * @param {object}  [props.style]     extra inline style for the outer box
 * @param {boolean} [props.music=true] set false to disable background music
 */
export default function MemoryGame({ className, style, music = true }) {
  const game = useMemoryGame();
  const { muted, toggleMute, start } = useBackgroundMusic(MUSIC, {
    enabled: music,
  });

  return (
    <section
      className={[styles.root, className].filter(Boolean).join(" ")}
      style={style}
      aria-label="Memory Match"
      // First touch inside the game starts the music (autoplay is blocked until then).
      onPointerDown={start}
    >
      <div
        className={`${styles.flash}${game.won ? ` ${styles.blind}` : ""}`}
        aria-hidden="true"
      />
      <div className={styles.layout}>
        <Board cards={game.won ? [] : game.cards} onCardClick={game.flipCard} />
        <StatsPanel
          gamesPlayed={game.gamesPlayed}
          matches={game.matches}
          totalPairs={game.totalPairs}
          attempts={game.attempts}
          accuracy={game.accuracy}
          muted={muted}
          onToggleMute={toggleMute}
          onReset={game.reset}
          onDemo={game.demoWin}
        />
      </div>
      {game.won && <WinModal muted={muted} onClose={game.reset} />}
    </section>
  );
}
