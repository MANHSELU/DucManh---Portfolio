import Sheet from "../components/Sheet.jsx";
import { copy } from "../data/i18n.js";
import { profile } from "../data/profile.js";
import { useProgress } from "../hooks/useProgress.js";
import { useLanguageStore } from "../store/useLanguageStore.js";
import ScanFigure from "../scene/ScanFigure.jsx";
import styles from "./AboutScan.module.css";

const SCAN_DURATION = 4200;
const TYPE_SPAN = 0.18;

export default function AboutScan() {
  const progress = useProgress(SCAN_DURATION);
  const language = useLanguageStore((state) => state.language);
  const text = copy[language];
  const cards = [
    { key: text.fullName, text: `${profile.name}\n${profile.location[language]}`, at: 0.06, side: "left", slot: "c1", photo: true },
    { key: text.about, text: profile.about[language], at: 0.28, side: "right", slot: "c2" },
    { key: text.role, text: profile.roles[language].join("\n"), at: 0.5, side: "left", slot: "c3" },
    { key: text.current, text: profile.now[language].join("\n"), at: 0.72, side: "left", slot: "c4" },
  ];

  return (
    <Sheet label={text.about} flush noScroll>
      <div className={styles.stage}>
        <div className={styles.dots} aria-hidden="true" />
        <div className={styles.floor} aria-hidden="true" />
        <p className={`${styles.scanTitle} mono`}>{text.scanTitle.toUpperCase()}</p>
        <div className={styles.pedestal} aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className={styles.figure} aria-hidden="true">
          <ScanFigure progress={progress} />
        </div>
        <div className={styles.counter}>{String(Math.round(progress * 100)).padStart(3, "0")}</div>
        {cards.map((card) => {
          const local = Math.min(1, Math.max(0, (progress - card.at) / TYPE_SPAN));
          const shown = card.text.slice(0, Math.round(card.text.length * local));
          const classes = [
            styles.info,
            styles[card.side],
            styles[card.slot],
            card.photo && profile.photo && styles.withPhoto,
            progress >= card.at && styles.on,
            local >= 1 && styles.done,
          ];
          return (
            <div key={card.key} className={classes.filter(Boolean).join(" ")}>
              {card.photo && profile.photo && <img className={styles.photo} src={profile.photo} alt={text.profilePhotoAlt(profile.name)} />}
              <div>
                <span className={styles.key}>{card.key}</span>
                <span className={styles.value}>{shown}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Sheet>
  );
}
