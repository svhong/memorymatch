import { memo } from "react";
import { CARD_BACK } from "../cards";

function Card({ card, onClick }) {
  const className = [
    "card",
    card.flipped && "flipped",
    card.matched && "matched",
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
    >
      <img src={card.url} className="front" alt="" draggable={false} />
      <img src={CARD_BACK} className="back" alt="" draggable={false} />
    </button>
  );
}

// Only the cards whose state changed re-render when one is flipped.
export default memo(Card);
