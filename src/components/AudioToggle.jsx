export default function AudioToggle({ muted, onToggle }) {
  return (
    <button
      type="button"
      className="btn btn-ghost"
      onClick={onToggle}
      aria-label={muted ? "Unmute music" : "Mute music"}
    >
      {muted ? "🔇 Music off" : "🔊 Music on"}
    </button>
  );
}
