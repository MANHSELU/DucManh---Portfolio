export const todo = (vi, en = vi) => ({ todo: true, text: { vi, en } });

export const textOf = (value, language = "vi") => {
  const text = value && typeof value === "object" && value.todo ? value.text : value;
  if (text && typeof text === "object") return text[language] ?? text.vi ?? "";
  return text;
};
