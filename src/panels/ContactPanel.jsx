import CopyButton from "../components/CopyButton.jsx";
import Sheet from "../components/Sheet.jsx";
import { copy } from "../data/i18n.js";
import { profile } from "../data/profile.js";
import ContactScene from "../scene/ContactScene.jsx";
import { useLanguageStore } from "../store/useLanguageStore.js";
import styles from "./ContactPanel.module.css";

export default function ContactPanel() {
  const language = useLanguageStore((state) => state.language);
  const text = copy[language];

  return (
    <Sheet label={text.contact} flush>
      <div className={styles.contact}>
        <div className={styles.text}>
          <span className="mono" style={{ color: "var(--teal)" }}>
            {text.startProject.toUpperCase()}
          </span>
          <h2>
            {text.letsWork[0]}
            <br />
            {text.letsWork[1]}
          </h2>
          <p>{text.contactDescription}</p>
          <div className={styles.mailRow}>
            <a className={styles.mail} href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <CopyButton text={profile.email} className={styles.copy} />
          </div>
          <div className={styles.socials}>
            <a href={`mailto:${profile.email}`} aria-label="Email">
              <span aria-hidden="true">@</span>
              Email
            </a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <span aria-hidden="true">GH</span>
              GitHub
              <span aria-hidden="true">↗</span>
            </a>
            <a href={profile.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <span aria-hidden="true">f</span>
              Facebook
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <div className={styles.scene}>
          <ContactScene />
          <span className={`${styles.bubble} mono`}>{text.waitingForMail}</span>
        </div>
      </div>
    </Sheet>
  );
}
