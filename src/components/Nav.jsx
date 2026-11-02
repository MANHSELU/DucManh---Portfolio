import { sections } from "../data/sections.js";
import { copy, localized } from "../data/i18n.js";
import { useLanguageStore } from "../store/useLanguageStore.js";
import { useRoomStore } from "../store/useRoomStore.js";
import styles from "./Nav.module.css";

const CONTACT_ID = "lien-he";

export default function Nav() {
  const focus = useRoomStore((state) => state.focus);
  const open = useRoomStore((state) => state.open);
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const text = copy[language];

  return (
    <header className={styles.nav}>
      <nav className={styles.pill} aria-label={text.navLabel}>
        {sections
          .filter((section) => section.id !== CONTACT_ID)
          .map((section) => (
            <button
              key={section.id}
              type="button"
              className={focus === section.id ? styles.on : undefined}
              onClick={() => open(section.id)}
            >
              {localized(section.nav, language).toUpperCase()}
            </button>
          ))}
      </nav>
      <div className={styles.actions}>
        <div className={styles.language} role="group" aria-label={text.languageLabel}>
          {["vi", "en"].map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={language === option}
              className={language === option ? styles.languageOn : undefined}
              onClick={() => setLanguage(option)}
            >
              {option.toUpperCase()}
            </button>
          ))}
        </div>
        <button type="button" className={styles.cta} onClick={() => open(CONTACT_ID)}>
          {text.contactNow.toUpperCase()}
        </button>
      </div>
    </header>
  );
}
