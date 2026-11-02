import { copy, localized } from "../data/i18n.js";
import { profile } from "../data/profile.js";
import { useLanguageStore } from "../store/useLanguageStore.js";
import { useRoomStore } from "../store/useRoomStore.js";
import styles from "./Intro.module.css";

export default function Intro() {
  const focused = useRoomStore((state) => state.focus !== null);
  const language = useLanguageStore((state) => state.language);
  const text = copy[language];

  return (
    <>
      <div className={`${styles.title} ${focused ? styles.away : ""}`}>
        <h1>
          {profile.nameLines[0]}
          <br />
          {profile.nameLines[1]}
        </h1>
        <span className={styles.badge}>{localized(profile.role, language).toUpperCase()}</span>
        <p>{localized(profile.tagline, language)}</p>
      </div>
      <p className={`${styles.hint} mono ${focused ? styles.away : ""}`}>
        <i aria-hidden="true" />
        {text.heroHint.toUpperCase()}
      </p>
    </>
  );
}
