import { CARD_BACK } from "../cards";

export default function Card({ card, onClick }) {
  const className = [
    "card",
    card.flipped && "flipped",
    card.matched && "matched",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className} onClick={() => onClick(card.id)}>
      <img src={card.url} className="front" alt="" />
      <img src={CARD_BACK} className="back" alt="" />
    </div>
  );
}
