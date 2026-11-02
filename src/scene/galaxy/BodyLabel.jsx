import { Html } from "@react-three/drei";
import { sections } from "../../data/sections.js";
import { copy, localized } from "../../data/i18n.js";
import { useLanguageStore } from "../../store/useLanguageStore.js";
import { useRoomStore } from "../../store/useRoomStore.js";
import styles from "./BodyLabel.module.css";

export default function BodyLabel({ id, offset }) {
  const visible = useRoomStore((state) => state.hovered === id && state.focus === null);
  const section = sections.find((item) => item.id === id);
  const language = useLanguageStore((state) => state.language);
  const text = copy[language];
  if (!visible || !section) return null;

  return (
    <Html position={offset} zIndexRange={[6, 0]} style={{ pointerEvents: "none" }}>
      <div className={styles.label}>
        <span className={styles.name}>{localized(section.spot, language)}</span>
        <span className={styles.action}>{text.clickToVisit}</span>
      </div>
    </Html>
  );
}
