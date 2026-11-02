import { useState } from "react";
import { copy } from "../data/i18n.js";
import { useLanguageStore } from "../store/useLanguageStore.js";

export default function CopyButton({ text, className }) {
  const language = useLanguageStore((state) => state.language);
  const labels = copy[language];
  const [status, setStatus] = useState("idle");
  const label = status === "copied" ? labels.copied : status === "error" ? labels.copyHelp : labels.copy;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 1800);
  };

  return (
    <button type="button" className={className} onClick={handleCopy}>
      {label}
    </button>
  );
}
