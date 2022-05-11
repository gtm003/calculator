import "./style.scss";

const app = document.querySelector<HTMLDivElement>("#app")!;

const createElement = (
  tagName: string,
  classList: string[],
  textContent: string
) => {
  const element = document.createElement(tagName);
  if (classList) classList.forEach((item) => element.classList.add(item));
  if (textContent) element.textContent = textContent;

  return element;
};

const arr: (number | string)[] = [
  "c",
  "√",
  "%",
  "/",
  7,
  8,
  9,
  "x",
  4,
  5,
  6,
  "-",
  1,
  2,
  3,
  "+",
  "00",
  "0",
  ",",
  "=",
];

const container = document.createElement("div");
container.classList.add("container");
app?.appendChild(container);

const display = document.createElement("div");
display.classList.add("display");
container?.appendChild(display);

const controls = document.createElement("div");
controls.classList.add("controls");
container?.appendChild(controls);

arr.forEach((item) => {
  const button = createElement("button", ["button"], String(item));
  controls?.appendChild(button);
});
