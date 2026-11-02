import { useRoomStore } from "../store/useRoomStore.js";
import AboutScan from "./AboutScan.jsx";
import ContactPanel from "./ContactPanel.jsx";
import ProcessPanel from "./ProcessPanel.jsx";
import ProjectsPanel from "./ProjectsPanel.jsx";
import SkillsPanel from "./SkillsPanel.jsx";

const PANELS = {
  "gioi-thieu": AboutScan,
  "du-an": ProjectsPanel,
  "quy-trinh": ProcessPanel,
  "ky-nang": SkillsPanel,
  "lien-he": ContactPanel,
};

export default function PanelHost() {
  const panel = useRoomStore((state) => state.panel);
  const Panel = panel ? PANELS[panel] : null;
  return Panel ? <Panel key={panel} /> : null;
}
