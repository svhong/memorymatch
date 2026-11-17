import { StrictMode } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import MemoryGame from "../MemoryGame";

// Fake Audio that records its state, so we can assert on what is audible.
let instances;
class FakeAudio {
  constructor(src) {
    this.src = src;
    this.muted = false;
    this.playing = false;
    instances.push(this);
  }
  play() {
    this.playing = true;
    return Promise.resolve();
  }
  pause() {
    this.playing = false;
  }
}

const flush = () => act(async () => {});
const playing = () => instances.filter((a) => a.playing);
const audible = () => instances.filter((a) => a.playing && !a.muted);
const game = () => screen.getByRole("region", { name: "Memory Match" });

beforeEach(() => {
  instances = [];
  vi.stubGlobal("Audio", FakeAudio);
});
afterEach(() => vi.unstubAllGlobals());

describe("background music", () => {
  it("does not play until the player touches the game", async () => {
    render(<MemoryGame />);
    await flush();
    expect(playing()).toHaveLength(0);
  });

  it("a click elsewhere on the host page does not start it", async () => {
    render(<MemoryGame />);
    await flush();
    fireEvent.pointerDown(document.body);
    await flush();
    expect(playing()).toHaveLength(0);
  });

  it("starts on the first touch inside the game: exactly one track, even under StrictMode", async () => {
    render(
      <StrictMode>
        <MemoryGame />
      </StrictMode>
    );
    await flush();
    fireEvent.pointerDown(game());
    await flush();
    expect(playing()).toHaveLength(1);
  });

  it("is silent after pressing mute, even under StrictMode (#1)", async () => {
    render(
      <StrictMode>
        <MemoryGame />
      </StrictMode>
    );
    await flush();
    fireEvent.pointerDown(screen.getByLabelText("Mute music"));
    await flush();
    expect(playing()).toHaveLength(1);

    fireEvent.click(screen.getByLabelText("Mute music"));
    await flush();
    expect(audible()).toHaveLength(0);
  });

  it("unmuting makes the single track audible again", async () => {
    render(<MemoryGame />);
    await flush();
    fireEvent.pointerDown(game());
    await flush();
    fireEvent.click(screen.getByLabelText("Mute music"));
    fireEvent.click(screen.getByLabelText("Unmute music"));
    await flush();
    expect(audible()).toHaveLength(1);
  });

  it("stops the music when the game unmounts (e.g. navigating away)", async () => {
    const { unmount } = render(<MemoryGame />);
    await flush();
    fireEvent.pointerDown(game());
    await flush();
    unmount();
    expect(playing()).toHaveLength(0);
  });
});
