import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MemoryGame from "./memory-match";

// Standalone dev shell. The game itself fills whatever box it is placed in, so
// here we just give it the whole window; the host site gives it the area under
// its nav bar instead.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div style={{ height: "100dvh" }}>
      <MemoryGame />
    </div>
  </StrictMode>
);
