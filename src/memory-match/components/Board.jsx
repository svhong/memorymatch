import Card from "./Card";
import styles from "../MemoryGame.module.css";

export default function Board({ cards, onCardClick }) {
  return (
    <div className={styles.board}>
      {cards.map((card) => (
        <Card key={card.id} card={card} onClick={onCardClick} />
      ))}
    </div>
  );
}
