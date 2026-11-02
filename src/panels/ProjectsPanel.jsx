import { useState } from "react";
import Fill from "../components/Fill.jsx";
import Sheet, { SheetTitle } from "../components/Sheet.jsx";
import { copy, localized } from "../data/i18n.js";
import { projects } from "../data/projects.js";
import { useLanguageStore } from "../store/useLanguageStore.js";
import styles from "./ProjectsPanel.module.css";

function Gallery({ images, name, text }) {
  const [active, setActive] = useState(0);
  if (images.length === 0) return null;
  return (
    <div className={styles.gallery}>
      <img className={styles.cover} src={images[active]} alt={text.screenshotAlt(name, active + 1)} />
      {images.length > 1 && (
        <div className={styles.thumbs}>
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              className={styles.thumb}
              aria-pressed={index === active}
              aria-label={text.screenshotAlt(name, index + 1)}
              onClick={() => setActive(index)}
            >
              <img src={image} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project, language, text }) {
  const name = localized(project.name, language);
  return (
    <article className={styles.card}>
      <Gallery images={project.images} name={name} text={text} />
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.summary}>{localized(project.summary, language)}</p>
      <div className={styles.block}>
        <h4>{text.features}</h4>
        <ul>
          {localized(project.features, language).map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </div>
      <div className={styles.block}>
        <h4>{text.techStack}</h4>
        <div className={styles.chips}>
          {project.stack.map((item, index) => (
            <Fill key={index} value={item} className={`${styles.chip} mono`} />
          ))}
        </div>
      </div>
      <div className={styles.block}>
        <h4>{text.role}</h4>
        <Fill as="p" value={project.role} />
      </div>
    </article>
  );
}

export default function ProjectsPanel() {
  const language = useLanguageStore((state) => state.language);
  const text = copy[language];

  return (
    <Sheet label={text.projects}>
      <SheetTitle kicker={text.selected.toUpperCase()}>{text.projects}</SheetTitle>
      <div className={styles.grid}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} language={language} text={text} />
        ))}
      </div>
    </Sheet>
  );
}
