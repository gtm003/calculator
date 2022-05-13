//const bracketsRegExp = /\(.+\)/;
const firstActionRegExp = /\d+(,\d+)?(x|\*|\/)\d+(,\d+)?/;
const secondActionRegExp = /\-?\d+(,\d+)?(\+|\-)\d+(,\d+)?/;

interface ICalculator {
  display1: HTMLElement;
  display2: HTMLElement;
  currentOperand: string;
  currentOperation: string;
}

const strToNumber = (str: string, action: string) =>
  str.split(action).map((operand) => Number(operand.replace(",", ".")));

export class Calculator implements ICalculator {
  display1: HTMLElement;
  display2: HTMLElement;
  currentOperand: string;
  currentOperation: string;
  constructor(displayNode1: HTMLElement, displayNode2: HTMLElement) {
    (this.display1 = displayNode1),
      (this.display2 = displayNode2),
      (this.currentOperand = ""),
      (this.currentOperation = "");
  }

  clear() {
    this.display1.innerText = "";
    this.display2.innerText = "0";
    this.currentOperand = "";
  }

  appendNumber(number: string) {
    if (number === "," && this.currentOperand.includes(",")) {
      return;
    }
    if (this.currentOperation === "=") {
      this.clear();
    }
    this.currentOperand += number;
    this.display2.innerText = this.currentOperand;
    this.currentOperation = "";
  }

  chooseOperation(operation: string) {
    if (this.currentOperation === "=") {
      this.currentOperation = operation;
      this.display1.innerText = this.currentOperand + operation;
      this.currentOperand = "";
      return;
    }
    if (this.currentOperation === "") {
      this.currentOperation = operation;
      this.display1.innerText += this.currentOperand + operation;
    } else {
      this.currentOperation = operation;
      this.display1.innerText =
        this.display1.innerText.slice(0, -1) + this.currentOperand + operation;
    }
    this.currentOperand = "";
  }

  calculate = (str: string, action: string) => {
    let res;
    switch (action) {
      case "*":
        res = strToNumber(str, action)[0] * strToNumber(str, action)[1];
        break;
      case "x":
        res = strToNumber(str, action)[0] * strToNumber(str, action)[1];
        break;
      case "/":
        res = strToNumber(str, action)[0] / strToNumber(str, action)[1];
        break;
      case "+":
        res = strToNumber(str, action)[0] + strToNumber(str, action)[1];
        break;
      case "-":
        res = strToNumber(str, action)[0] - strToNumber(str, action)[1];
        break;
      default:
        break;
    }
    return String(res?.toFixed(11))
      .replace(".", ",")
      .replace(/\,?0*$/, "");
  };

  updateDisplay1(simbol: string) {
    if (simbol === "c") {
      return;
    }
    if (simbol === "=") {
      this.display1.innerText = this.doSecondActions(this.doFirstActions());
      this.display2.innerText = this.doSecondActions(this.doFirstActions());
      return;
    }
    this.display1.innerText += simbol;
  }

  doFirstActions(): string {
    let newStr = this.display1.textContent + this.currentOperand ?? "";
    let targetExp = firstActionRegExp.exec(newStr);
    while (targetExp) {
      const expr = targetExp[0];
      const action = targetExp[2];
      const res = this.calculate(expr, action);
      newStr = newStr.replace(expr, String(res));
      targetExp = firstActionRegExp.exec(newStr);
    }
    return newStr;
  }

  doSecondActions = (str: string) => {
    let newStr = str;
    let targetExp = secondActionRegExp.exec(newStr);
    while (targetExp) {
      const expr = targetExp[0];
      const action = targetExp[2];
      const res = this.calculate(expr, action);
      newStr = newStr.replace(expr, String(res));
      targetExp = secondActionRegExp.exec(newStr);
    }
    return newStr;
  };

  calculateExp = () => {
    const firstStep = this.doFirstActions();
    const secondStep = this.doSecondActions(firstStep);
    this.display1.innerText += this.currentOperand + "=";
    this.currentOperation = "=";
    this.currentOperand = secondStep;
    this.display2.innerText = secondStep;
  };
}
