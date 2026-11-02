import { useEffect, useRef } from "react";
import { useRoomStore } from "../store/useRoomStore.js";
import { copy } from "../data/i18n.js";
import { useLanguageStore } from "../store/useLanguageStore.js";
import styles from "./Sheet.module.css";

export default function Sheet({ label, width, flush = false, noScroll = false, children }) {
  const close = useRoomStore((state) => state.close);
  const language = useLanguageStore((state) => state.language);
  const text = copy[language];
  const closeButton = useRef();

  useEffect(() => {
    closeButton.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div
      className={styles.layer}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        className={`${styles.sheet} ${noScroll ? styles.noScroll : ""}`}
        style={width ? { width: `min(${width}px, 100%)` } : undefined}
      >
        <button ref={closeButton} type="button" className={styles.close} onClick={close} aria-label={text.close}>
          ✕
        </button>
        {flush ? children : <div className={styles.pad}>{children}</div>}
      </div>
    </div>
  );
}

export function SheetTitle({ kicker, children }) {
  return (
    <>
      <span className={styles.kicker}>{kicker}</span>
      <h2 className={styles.heading}>{children}</h2>
    </>
  );
}
