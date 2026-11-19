import { useEffect, useRef } from "react";
import { WIN_VIDEO } from "../assets";
import styles from "../MemoryGame.module.css";

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
    <div className={styles.backdrop}>
      <div
        className={`${styles.modal} ${styles.modalFlash}`}
        role="dialog"
        aria-label="You win"
      >
        <div className={styles.modalHeader}>YOU WIN!</div>
        <div className={styles.modalBody}>
          <video ref={videoRef} src={WIN_VIDEO} />
        </div>
        <div className={styles.modalFooter}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnDanger}`}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
