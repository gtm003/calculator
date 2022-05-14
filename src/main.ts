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

interface IButton {
  value: string;
  type: "number" | "operation" | "equal" | "clear";
}

const arr: IButton[] = [
  { value: "c", type: "clear" },
  { value: "√", type: "operation" },
  { value: "%", type: "operation" },
  { value: "/", type: "operation" },
  { value: "7", type: "number" },
  { value: "8", type: "number" },
  { value: "9", type: "number" },
  { value: "x", type: "operation" },
  { value: "4", type: "number" },
  { value: "5", type: "number" },
  { value: "6", type: "number" },
  { value: "-", type: "operation" },
  { value: "1", type: "number" },
  { value: "2", type: "number" },
  { value: "3", type: "number" },
  { value: "+", type: "operation" },
  { value: "00", type: "number" },
  { value: "0", type: "number" },
  { value: ",", type: "number" },
  { value: "=", type: "equal" },
];

const container = document.createElement("div");
container.classList.add("container");
app?.appendChild(container);

const display1 = document.createElement("div");
display1.classList.add("display1");
container?.appendChild(display1);

const display2 = document.createElement("div");
display2.classList.add("display2");
display2.innerText = "0";
container?.appendChild(display2);

const calculator = new Calculator(display1, display2);

const controls = document.createElement("div");
controls.classList.add("controls");
container?.appendChild(controls);

arr.forEach((item) => {
  const button = createElement("button", ["button"], String(item.value));
  switch (item.type) {
    case "clear":
      button.addEventListener("click", () => calculator.clear());
      break;
    case "operation":
      button.addEventListener("click", () =>
        calculator.chooseOperation(button.innerText)
      );
      break;
    case "number":
      button.addEventListener("click", () =>
        calculator.appendNumber(button.innerText)
      );
      break;
    case "equal":
      button.addEventListener("click", () => calculator.calculateExp());
      break;

    default:
      break;
  }
  controls?.appendChild(button);
});

window.addEventListener("keyup", (event) => {
  if (/\d|\.|\,/.test(event.key)) {
    const arg = event.key === "." ? "," : event.key;
    calculator.appendNumber(arg);
  }
  if (/\+|\-|\/|\*|x/.test(event.key)) {
    const operation = event.key === "*" ? "x" : event.key;
    calculator.chooseOperation(operation);
  }
  if (event.key === "(") {
    calculator.openBracket();
  }
  if (event.key === ")") {
    calculator.closeBracket();
  }
});
