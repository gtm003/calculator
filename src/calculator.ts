//const bracketsRegExp = /\(.+\)/;
const firstActionRegExp = /\d+(\*|\/)\d+/;
const secondActionRegExp = /\-?\d+(\+|\-)\d+/;

interface ICalculator {
  display1: HTMLElement;
  display2: HTMLElement;
}

export class Calculator implements ICalculator {
  display1 : HTMLElement;
  display2 : HTMLElement;
  constructor(displayNode1 : HTMLElement, displayNode2: HTMLElement) {
    this.display1 = displayNode1,
    this.display2 = displayNode2
  }

  calculate = (str:string, action:string) => {
    let res;
    switch (action) {
      case "*":
        res = Number(str.split("*")[0]) * Number(str.split("*")[1]);
        break;
      case "/":
        res = Number(str.split("/")[0]) / Number(str.split("/")[1]);
        break;
      case "+":
        res = Number(str.split("+")[0]) + Number(str.split("+")[1]);
        break;
      case "-":
        res = Number(str.split("-")[0]) - Number(str.split("-")[1]);
        break;
      default:
        break;
    }
    return res;
  };

  updateDisplay1(simbol: string) {
    if(simbol === "=") {
      this.display1.innerText = this.doSecondActions(this.doFirstActions());
      this.display2.innerText = this.doSecondActions(this.doFirstActions());
      return;
    }
    this.display1.innerText += simbol;
  }

  doFirstActions(): string  {
    let newStr = this.display1.textContent ?? "";
    let targetExp = firstActionRegExp.exec(newStr);
    while (targetExp) {
      console.log(newStr);
      const expr = targetExp[0];
      const action = targetExp[1];
      const res = this.calculate(expr, action);
      newStr = newStr.replace(expr, String(res));
      targetExp = firstActionRegExp.exec(newStr);
    }
    return newStr;
  };

  doSecondActions = (str:string) => {
    let newStr = str;
    let targetExp = secondActionRegExp.exec(newStr);
    while (targetExp) {
      console.log(newStr);
      const expr = targetExp[0];
      const action = targetExp[1];
      const res = this.calculate(expr, action);
      newStr = newStr.replace(expr, String(res));
      targetExp = secondActionRegExp.exec(newStr);
    }
    return newStr;
  };
}