import Card from "./Card";

export default function Board({ cards, onCardClick }) {
  return (
    <div id="gameArea">
      {cards.map((card) => (
        <Card key={card.id} card={card} onClick={onCardClick} />
      ))}
    </div>
  );
}
