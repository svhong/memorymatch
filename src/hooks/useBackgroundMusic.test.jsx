import { StrictMode } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";

// Fake Audio that mimics a browser blocking autoplay: the first play() on each
// instance is rejected, later plays (after a user gesture) succeed.
let instances;
class FakeAudio {
  constructor(src) {
    this.src = src;
    this.muted = false;
    this.playing = false;
    this.attempts = 0;
    instances.push(this);
  }
  play() {
    if (this.attempts++ === 0) return Promise.reject(new Error("blocked"));
    this.playing = true;
    return Promise.resolve();
  }
  pause() {
    this.playing = false;
  }
}

const flush = () => act(async () => {});
const audible = () => instances.filter((a) => a.playing && !a.muted);

beforeEach(() => {
  instances = [];
  vi.stubGlobal("Audio", FakeAudio);
});
afterEach(() => vi.unstubAllGlobals());

describe("background music", () => {
  it("is silent after pressing mute, even under StrictMode", async () => {
    render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    await flush();

    // First user gesture starts the music (autoplay was blocked).
    fireEvent.pointerDown(screen.getByLabelText("Mute music"));
    await flush();
    expect(instances.filter((a) => a.playing)).toHaveLength(1);

    fireEvent.click(screen.getByLabelText("Mute music"));
    await flush();
    expect(audible()).toHaveLength(0);
  });

  it("unmuting makes the single track audible again", async () => {
    render(<App />);
    await flush();
    fireEvent.pointerDown(document.body);
    await flush();
    fireEvent.click(screen.getByLabelText("Mute music"));
    fireEvent.click(screen.getByLabelText("Unmute music"));
    await flush();
    expect(audible()).toHaveLength(1);
  });

  it("stops the music when the game unmounts", async () => {
    const { unmount } = render(<App />);
    await flush();
    fireEvent.pointerDown(document.body);
    await flush();
    unmount();
    expect(instances.filter((a) => a.playing)).toHaveLength(0);
  });
});
