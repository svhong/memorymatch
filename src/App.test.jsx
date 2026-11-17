import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { shuffle } from "./utils/shuffle";

const cards = () => [...document.querySelectorAll(".card")];
const urlOf = (card) => card.querySelector(".front").getAttribute("src");
const flipped = () => document.querySelectorAll(".card.flipped").length;
const click = (card) => fireEvent.click(card);
const wait = (ms) => act(() => vi.advanceTimersByTime(ms));
const stat = (label) =>
  screen.getByText(new RegExp(label)).textContent.replace(/\s+/g, " ");

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
    render(<App />);
    expect(cards()).toHaveLength(24);
    expect(flipped()).toBe(0);
    const counts = {};
    cards().forEach((c) => (counts[urlOf(c)] = (counts[urlOf(c)] || 0) + 1));
    expect(Object.values(counts).every((n) => n === 2)).toBe(true);
    expect(Object.keys(counts)).toHaveLength(12);
  });

  it("ignores a third click while two cards are face up", () => {
    render(<App />);
    const [a, b] = mismatch(cards());
    const c = cards().find((x) => x !== a && x !== b);
    click(a); click(b); click(c);
    expect(flipped()).toBe(2);
  });

  it("ignores clicking the same card twice", () => {
    render(<App />);
    const [a] = cards();
    click(a); click(a);
    expect(flipped()).toBe(1);
    wait(5000);
    expect(stat("Attempts")).toContain("0");
  });

  it("flips a mismatch back after 1s and counts an attempt", () => {
    render(<App />);
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
    render(<App />);
    const [a, b] = pair(cards());
    click(a); click(b);
    wait(700);
    expect(a.classList.contains("matched")).toBe(true);
    expect(b.classList.contains("matched")).toBe(true);
    expect(stat("Total Matches")).toContain("1");
    expect(stat("Attempts")).toContain("1");
    expect(stat("Accuracy")).toContain("100%");
  });

  it("wins after all pairs: shows modal, then auto-resets after 8s", () => {
    render(<App />);
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
    render(<App />);
    click(screen.getByText("Demo"));
    expect(screen.getByText("YOU WIN!")).toBeTruthy();
    click(screen.getByText("Close"));
    expect(screen.queryByText("YOU WIN!")).toBeNull();
    expect(cards()).toHaveLength(24);
    expect(stat("Games Played")).toContain("2");
  });

  it("Reset Game mid-play clears stats and re-deals", () => {
    render(<App />);
    const [a, b] = pair(cards());
    click(a); click(b); wait(700);
    click(screen.getByText("Reset Game"));
    expect(cards()).toHaveLength(24);
    expect(flipped()).toBe(0);
    expect(stat("Total Matches")).toContain("0");
    expect(stat("Games Played")).toContain("2");
  });

  it("mute button toggles", () => {
    render(<App />);
    click(screen.getByLabelText("Mute music"));
    expect(screen.getByLabelText("Unmute music")).toBeTruthy();
    click(screen.getByLabelText("Unmute music"));
    expect(screen.getByLabelText("Mute music")).toBeTruthy();
  });

  it("shows the About page at #/about", () => {
    window.location.hash = "#/about";
    render(<App />);
    expect(screen.getByText("About Me!")).toBeTruthy();
    window.location.hash = "";
  });
});
