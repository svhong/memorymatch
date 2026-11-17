import { useEffect, useRef } from "react";

export default function WinModal({ muted, onClose }) {
  const videoRef = useRef(null);

  // The win video has its own soundtrack, so it must honour the same mute
  // setting as the background music. Set `muted` before calling play().
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
    video.play().catch(() => {});
  }, [muted]);

  return (
    <div className="modal-backdrop">
      <div className="modal-content animate" role="dialog" aria-label="You win">
        <div className="modal-header">YOU WIN!</div>
        <div className="modal-body">
          <video ref={videoRef} src="images/bttf_win.mp4" />
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-danger" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
