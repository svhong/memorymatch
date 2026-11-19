import { memo } from "react";
import { CARD_BACK } from "../assets";
import styles from "../MemoryGame.module.css";

function Card({ card, onClick }) {
  const className = [
    styles.card,
    card.flipped && styles.flipped,
    card.matched && styles.matched,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={className}
      onClick={() => onClick(card.id)}
      disabled={card.matched}
      aria-label={card.flipped ? "Face-up card" : "Face-down card"}
      data-card=""
      data-flipped={card.flipped}
      data-matched={card.matched}
    >
      <img
        src={card.url}
        className={styles.front}
        alt=""
        draggable={false}
        data-face="front"
      />
      <img src={CARD_BACK} className={styles.back} alt="" draggable={false} />
    </button>
  );
}

// Only the cards whose state changed re-render when one is flipped.
export default memo(Card);
