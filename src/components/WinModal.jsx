import { useEffect, useRef } from "react";

export default function WinModal({ onClose }) {
  const videoRef = useRef(null);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

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
