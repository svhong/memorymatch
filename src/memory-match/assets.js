// Every asset is imported through the bundler (not referenced by a plain
// "images/..." string), so the URLs are fingerprinted and respect the host
// app's base path. That keeps the game working at any route depth, e.g.
// /games/memory-match, and wherever the host deploys.
import biff from "./assets/biff.jpg";
import delorean from "./assets/delorean.jpg";
import emmettbrown from "./assets/emmettbrown.jpg";
import fluxcapacitor from "./assets/fluxcapacitor.png";
import george from "./assets/george.jpg";
import greatscott from "./assets/greatscott.jpg";
import lorraine from "./assets/lorraine.jpg";
import marty from "./assets/marty.jpg";
import timecircuit from "./assets/timecircuit.jpg";
import delorean2 from "./assets/delorean2.jpg";
import bttf2 from "./assets/bttf2.jpg";
import bttf3 from "./assets/bttf3.jpg";

export { default as CARD_BACK } from "./assets/cardback.jpg";
export { default as LOGO } from "./assets/bttflogo.png";
export { default as MUSIC } from "./assets/bgm.mp3";
export { default as WIN_VIDEO } from "./assets/bttf_win.mp4";

export const CARD_FACES = [
  biff,
  delorean,
  emmettbrown,
  fluxcapacitor,
  george,
  greatscott,
  lorraine,
  marty,
  timecircuit,
  delorean2,
  bttf2,
  bttf3,
];
