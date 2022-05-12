import { Calculator } from "./calculator";
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

const display1 = document.createElement("div");
display1.classList.add("display1");
container?.appendChild(display1);

const display2 = document.createElement("div");
display2.classList.add("display2");
container?.appendChild(display2);

const calculator = new Calculator(display1, display2);

const controls = document.createElement("div");
controls.classList.add("controls");
container?.appendChild(controls);

const handleEvent = (event: Event) => {
  console.log(event);
  let target: any = event.target;

  if (target.tagName !== "BUTTON") {
    return;
  }

  console.log(target.textContent);
  calculator.updateDisplay1(target.textContent);
  console.log(calculator.display1);
};

controls.addEventListener("click", handleEvent);

arr.forEach((item) => {
  const button = createElement("button", ["button"], String(item));
  controls?.appendChild(button);
});

window.addEventListener("keyup", (e) => {
  console.log(e.key);
  if (e.key === "=") {
    const exp = display1.textContent ?? "";
    console.log(exp);
    return;
  }
  display1.innerHTML += e.key;
});
