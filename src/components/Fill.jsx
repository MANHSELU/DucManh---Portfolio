import { copy, localized } from "../data/i18n.js";
import { useLanguageStore } from "../store/useLanguageStore.js";

export default function Fill({ value, as: Tag = "span", className = "" }) {
  const language = useLanguageStore((state) => state.language);
  const text = copy[language];
  if (value && typeof value === "object" && value.todo) {
    return (
      <Tag className={`${className} todo`.trim()} title={text.todoTitle}>
        {localized(value.text, language)}
      </Tag>
    );
  }
  return <Tag className={className || undefined}>{localized(value, language)}</Tag>;
}
