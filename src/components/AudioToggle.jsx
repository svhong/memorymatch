export default function AudioToggle({ muted, onToggle }) {
  return (
    <div className="audioDiv">
      <button
        type="button"
        className="audioToggle"
        onClick={onToggle}
        aria-label={muted ? "Unmute music" : "Mute music"}
      >
        {muted ? "🔇" : "🔊"}
      </button>
    </div>
  );
}
