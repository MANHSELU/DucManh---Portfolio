import { useEffect } from "react";
import Intro from "./components/Intro.jsx";
import Nav from "./components/Nav.jsx";
import { isSection } from "./data/sections.js";
import { copy } from "./data/i18n.js";
import PanelHost from "./panels/PanelHost.jsx";
import Experience from "./scene/Experience.jsx";
import { useRoomStore } from "./store/useRoomStore.js";
import { useLanguageStore } from "./store/useLanguageStore.js";
import styles from "./App.module.css";

export default function App() {
  const focus = useRoomStore((state) => state.focus);
  const language = useLanguageStore((state) => state.language);

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (isSection(id)) useRoomStore.getState().open(id);
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") useRoomStore.getState().close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const { pathname, search } = window.location;
    window.history.replaceState(null, "", focus ? `#${focus}` : `${pathname}${search}`);
  }, [focus]);

  useEffect(() => {
    const text = copy[language];
    document.documentElement.lang = language;
    document.title = text.pageTitle;
    document.querySelector('meta[name="description"]')?.setAttribute("content", text.pageDescription);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", text.pageTitle);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", text.pageDescription);
  }, [language]);

  return (
    <>
      <div className={styles.room}>
        <Experience />
      </div>
      <Nav />
      <Intro />
      <PanelHost />
    </>
  );
}
