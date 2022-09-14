export const element = (options) => {
  options.attributes = options.attributes || [];
  options.classes = options.classes || [];
  options.children = options.children || [];

  const tag = document.createElement(options.tag);
  tag.classList.add(...options.classes);
  options.attributes.forEach(([name, value]) => {
    tag.setAttribute(name, value);
  });
  tag.innerText = "";
  options.children.forEach((child) => {
    if (typeof child === "string") {
      tag.innerText += child;
    } else {
      tag.appendChild(child);
    }
  });

  return tag;
};
