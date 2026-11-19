import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import MemoryGame from "./MemoryGame";
import { shuffle } from "./utils/shuffle";

// Cards expose their state through data attributes, so these helpers don't
// depend on the (hashed) CSS Module class names.
const cards = () => [...document.querySelectorAll("[data-card]")];
const urlOf = (card) =>
  card.querySelector('[data-face="front"]').getAttribute("src");
const flipped = () =>
  document.querySelectorAll('[data-card][data-flipped="true"]').length;
const isMatched = (card) => card.dataset.matched === "true";
const click = (card) => fireEvent.click(card);
const wait = (ms) => act(() => vi.advanceTimersByTime(ms));
const stat = (label) =>
  screen.getByRole("group", { name: label }).textContent;

// Find two cards with the same image / with different images.
function pair(all) {
  const a = all[0];
  return [a, all.find((c, i) => i > 0 && urlOf(c) === urlOf(a))];
}
function mismatch(all) {
  const a = all[0];
  return [a, all.find((c) => urlOf(c) !== urlOf(a))];
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("shuffle", () => {
  it("keeps all items and does not mutate the input", () => {
    const input = [1, 2, 3, 4, 5];
    const out = shuffle(input);
    expect(input).toEqual([1, 2, 3, 4, 5]);
    expect([...out].sort()).toEqual(input);
  });
});

describe("memory game", () => {
  it("deals 24 face-down cards, 12 pairs", () => {
    render(<MemoryGame />);
    expect(cards()).toHaveLength(24);
    expect(flipped()).toBe(0);
    const counts = {};
    cards().forEach((c) => (counts[urlOf(c)] = (counts[urlOf(c)] || 0) + 1));
    expect(Object.values(counts).every((n) => n === 2)).toBe(true);
    expect(Object.keys(counts)).toHaveLength(12);
  });

  it("ignores a third click while two cards are face up", () => {
    render(<MemoryGame />);
    const [a, b] = mismatch(cards());
    const c = cards().find((x) => x !== a && x !== b);
    click(a); click(b); click(c);
    expect(flipped()).toBe(2);
  });

  it("ignores clicking the same card twice", () => {
    render(<MemoryGame />);
    const [a] = cards();
    click(a); click(a);
    expect(flipped()).toBe(1);
    wait(5000);
    expect(stat("Attempts")).toContain("0");
  });

  it("flips a mismatch back after 1s and counts an attempt", () => {
    render(<MemoryGame />);
    const [a, b] = mismatch(cards());
    click(a); click(b);
    wait(999);
    expect(flipped()).toBe(2);
    wait(1);
    expect(flipped()).toBe(0);
    expect(stat("Attempts")).toContain("1");
    expect(stat("Total Matches")).toContain("0");
    expect(stat("Accuracy")).toContain("0%");
  });

  it("keeps a match, counts it, and reports accuracy", () => {
    render(<MemoryGame />);
    const [a, b] = pair(cards());
    click(a); click(b);
    wait(700);
    expect(isMatched(a)).toBe(true);
    expect(isMatched(b)).toBe(true);
    expect(stat("Total Matches")).toContain("1");
    expect(stat("Attempts")).toContain("1");
    expect(stat("Accuracy")).toContain("100%");
  });

  it("wins after all pairs: shows modal, then auto-resets after 8s", () => {
    render(<MemoryGame />);
    const all = cards();
    const seen = new Set();
    for (const c of all) {
      if (seen.has(urlOf(c))) continue;
      seen.add(urlOf(c));
      const mate = all.find((x) => x !== c && urlOf(x) === urlOf(c));
      click(c); click(mate);
      wait(700);
    }
    expect(screen.getByText("YOU WIN!")).toBeTruthy();
    expect(cards()).toHaveLength(0);
    expect(stat("Total Matches")).toContain("12");
    wait(8000);
    expect(screen.queryByText("YOU WIN!")).toBeNull();
    expect(cards()).toHaveLength(24);
    expect(stat("Games Played")).toContain("2");
    expect(stat("Total Matches")).toContain("0");
  });

  it("Demo shows the win modal and Close resets the game", () => {
    render(<MemoryGame />);
    click(screen.getByText(/Demo/));
    expect(screen.getByText("YOU WIN!")).toBeTruthy();
    click(screen.getByText("Close"));
    expect(screen.queryByText("YOU WIN!")).toBeNull();
    expect(cards()).toHaveLength(24);
    expect(stat("Games Played")).toContain("2");
  });

  it("New Game mid-play clears stats and re-deals", () => {
    render(<MemoryGame />);
    const [a, b] = pair(cards());
    click(a); click(b); wait(700);
    click(screen.getByText(/New Game/));
    expect(cards()).toHaveLength(24);
    expect(flipped()).toBe(0);
    expect(stat("Total Matches")).toContain("0");
    expect(stat("Games Played")).toContain("2");
  });

  it("mute button toggles", () => {
    render(<MemoryGame />);
    click(screen.getByLabelText("Mute music"));
    expect(screen.getByLabelText("Unmute music")).toBeTruthy();
    click(screen.getByLabelText("Unmute music"));
    expect(screen.getByLabelText("Mute music")).toBeTruthy();
  });

  it("win video is muted when the mute button is on (#5)", () => {
    render(<MemoryGame />);
    click(screen.getByLabelText("Mute music"));
    click(screen.getByText(/Demo/));
    const video = document.querySelector("video");
    expect(video).toBeTruthy();
    expect(video.muted).toBe(true);
  });

  it("win video plays with sound when music is not muted", () => {
    render(<MemoryGame />);
    click(screen.getByText(/Demo/));
    expect(document.querySelector("video").muted).toBe(false);
  });

  it("passes className/style through to the outer box and fills its container", () => {
    render(
      <MemoryGame className="host-class" style={{ outline: "1px solid red" }} />
    );
    const root = screen.getByRole("region", { name: "Memory Match" });
    expect(root.classList.contains("host-class")).toBe(true);
    expect(root.style.outline).toBe("1px solid red");
  });

  it("does not create any audio when music={false}", () => {
    const created = [];
    vi.stubGlobal(
      "Audio",
      class {
        constructor() {
          created.push(this);
        }
        play() {
          return Promise.resolve();
        }
        pause() {}
      }
    );
    render(<MemoryGame music={false} />);
    fireEvent.pointerDown(screen.getByRole("region", { name: "Memory Match" }));
    expect(created).toHaveLength(0);
    vi.unstubAllGlobals();
  });
});
