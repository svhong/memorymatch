import { useEffect, useState } from "react";
import Board from "./components/Board";
import StatsPanel from "./components/StatsPanel";
import WinModal from "./components/WinModal";
import AboutPage from "./components/AboutPage";
import { useMemoryGame } from "./hooks/useMemoryGame";
import { useBackgroundMusic } from "./hooks/useBackgroundMusic";
import "./App.css";

function Game() {
  const game = useMemoryGame();
  const { muted, toggleMute } = useBackgroundMusic("images/bgm.mp3");

  return (
    <>
      <div className={`theBlinder${game.won ? " blind" : ""}`} />
      <Board cards={game.won ? [] : game.cards} onCardClick={game.flipCard} />
      <StatsPanel
        gamesPlayed={game.gamesPlayed}
        matches={game.matches}
        attempts={game.attempts}
        accuracy={game.accuracy}
        muted={muted}
        onToggleMute={toggleMute}
        onReset={game.reset}
        onDemo={game.demoWin}
      />
      {game.won && <WinModal onClose={game.reset} />}
    </>
  );
}

export default function App() {
  // Tiny hash "router": #/about shows the About page, anything else the game.
  const [route, setRoute] = useState(window.location.hash);
  useEffect(() => {
    const onChange = () => setRoute(window.location.hash);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return route === "#/about" ? <AboutPage /> : <Game />;
}
