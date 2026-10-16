export function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: { nodeValue: String(text) },
    children: [],
  };
}

export function createElement(type, props, ...children) {
  const normalized = children
    .flat(Infinity)
    .filter((c) => c !== null && c !== undefined && typeof c !== "boolean")
    .map((c) => (typeof c === "object" ? c : createTextElement(c)));

  return { type, props: props ?? {}, children: normalized };
}
