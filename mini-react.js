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
const isEvent = (k) => /^on[A-Z]/.test(k);

export function renderToDOM(vnode) {
  if (vnode.type === "TEXT_ELEMENT") {
    return document.createTextNode(vnode.props.nodeValue); // an toàn XSS
  }

  const el = document.createElement(vnode.type);

  for (const [key, value] of Object.entries(vnode.props)) {
    if (value == null || value === false) continue;
    if (isEvent(key)) {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === "className") {
      el.className = value;
    } else if (key === "style" && typeof value === "object") {
      Object.assign(el.style, value);
    } else {
      el.setAttribute(key, value);
    }
  }

  vnode.children.forEach((child) => el.appendChild(renderToDOM(child)));
  return el;
}
