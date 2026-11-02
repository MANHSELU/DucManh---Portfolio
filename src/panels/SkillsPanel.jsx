import Sheet, { SheetTitle } from "../components/Sheet.jsx";
import { copy, localized } from "../data/i18n.js";
import { skillGroups } from "../data/skills.js";
import { useLanguageStore } from "../store/useLanguageStore.js";
import styles from "./SkillsPanel.module.css";

export default function SkillsPanel() {
  const language = useLanguageStore((state) => state.language);
  const text = copy[language];

  return (
    <Sheet label={text.skills} width={820}>
      <SheetTitle kicker={text.library.toUpperCase()}>{text.skills}</SheetTitle>
      <div className={styles.groups}>
        {skillGroups.map((group, index) => (
          <section key={index} className={styles.group} style={{ animationDelay: `${index * 0.08}s` }}>
            <h3>{localized(group.title, language)}</h3>
            <div className={styles.chips}>
              {group.items.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Sheet>
  );
}
