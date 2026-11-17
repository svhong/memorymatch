import { useEffect, useReducer } from "react";
import {
  CARD_IMAGES,
  MATCH_DELAY_MS,
  MISMATCH_DELAY_MS,
  WIN_SCREEN_MS,
} from "../cards";
import { shuffle } from "../utils/shuffle";

function createBoard() {
  const pairs = [...CARD_IMAGES, ...CARD_IMAGES];
  return shuffle(pairs).map((url, id) => ({
    id,
    url,
    flipped: false,
    matched: false,
  }));
}

function createInitialState() {
  return {
    cards: createBoard(),
    selected: [], // ids of the (up to 2) cards currently face up
    gamesPlayed: 1,
    matches: 0,
    attempts: 0,
    won: false,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "FLIP": {
      const card = state.cards[action.id];
      if (state.won || state.selected.length === 2 || card.flipped) return state;
      return {
        ...state,
        selected: [...state.selected, card.id],
        cards: state.cards.map((c) =>
          c.id === card.id ? { ...c, flipped: true } : c
        ),
      };
    }
    case "RESOLVE": {
      // Called by a timer once two cards have been face up long enough.
      const [a, b] = state.selected.map((id) => state.cards[id]);
      const isMatch = a.url === b.url;
      const matches = state.matches + (isMatch ? 1 : 0);
      return {
        ...state,
        selected: [],
        attempts: state.attempts + 1,
        matches,
        won: matches === state.cards.length / 2,
        cards: state.cards.map((c) => {
          if (c.id !== a.id && c.id !== b.id) return c;
          return isMatch ? { ...c, matched: true } : { ...c, flipped: false };
        }),
      };
    }
    case "WIN":
      return { ...state, won: true };
    case "RESET":
      return { ...createInitialState(), gamesPlayed: state.gamesPlayed + 1 };
    default:
      return state;
  }
}

export function useMemoryGame() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const { selected, cards, won } = state;

  // Once two cards are face up, wait, then resolve them as a match or a miss.
  useEffect(() => {
    if (selected.length !== 2) return;
    const isMatch = cards[selected[0]].url === cards[selected[1]].url;
    const timer = setTimeout(
      () => dispatch({ type: "RESOLVE" }),
      isMatch ? MATCH_DELAY_MS : MISMATCH_DELAY_MS
    );
    return () => clearTimeout(timer);
  }, [selected, cards]);

  // The win screen auto-dismisses and starts a fresh game.
  useEffect(() => {
    if (!won) return;
    const timer = setTimeout(() => dispatch({ type: "RESET" }), WIN_SCREEN_MS);
    return () => clearTimeout(timer);
  }, [won]);

  const accuracy =
    state.attempts === 0
      ? "0%"
      : `${Math.floor((state.matches / state.attempts) * 100)}%`;

  return {
    cards,
    won,
    gamesPlayed: state.gamesPlayed,
    matches: state.matches,
    attempts: state.attempts,
    accuracy,
    flipCard: (id) => dispatch({ type: "FLIP", id }),
    reset: () => dispatch({ type: "RESET" }),
    demoWin: () => dispatch({ type: "WIN" }),
  };
}
