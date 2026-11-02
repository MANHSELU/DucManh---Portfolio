import Sheet, { SheetTitle } from "../components/Sheet.jsx";
import { copy, localized } from "../data/i18n.js";
import { processSteps } from "../data/process.js";
import { useLanguageStore } from "../store/useLanguageStore.js";
import styles from "./ProcessPanel.module.css";

export default function ProcessPanel() {
  const language = useLanguageStore((state) => state.language);
  const text = copy[language];

  return (
    <Sheet label={text.process} width={760}>
      <SheetTitle kicker={text.howIWork.toUpperCase()}>{text.process}</SheetTitle>
      <ol className={styles.timeline}>
        {processSteps.map((step, index) => (
          <li key={index} style={{ animationDelay: `${index * 0.08}s` }}>
            <span className={`${styles.when} mono`}>
              {text.step} {index + 1} · {localized(step.key, language)}
            </span>
            <h3>{localized(step.title, language)}</h3>
            <span className={styles.what}>{localized(step.detail, language)}</span>
          </li>
        ))}
      </ol>
    </Sheet>
  );
}
