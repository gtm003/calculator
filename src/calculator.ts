const bracketsRegExp = /\([^\(\)]+\)/;
const firstActionRegExp = /\-?\d+(,\d+)?(x|\/)\-?\d+(,\d+)?/;
const secondActionRegExp = /\-?\d+(,\d+)?(\+|\-)\-?\d+(,\d+)?/;
const rootRegExp = /√\d+/;
const breakPoint = 425;
const fontSizeBig = 45;
const fontSizeSmall = 36;

interface ICalculator {
  display1: HTMLElement;
  display2: HTMLElement;
  currentOperand: string;
  currentOperation: string;
}

const strToNumber = (str: string, action: string) => {
  if (str[0] === '-' && action === '-') {
    const args = [`-${str.split(action)[1]}`, str.split(action)[2]];

    return args.map((operand) => Number(operand.replace(',', '.')));
  }

  return str.split(action).map((operand) => Number(operand.replace(',', '.')));
};

const getFontSize = (strLength: number) => {
  const display2Width =
    window.screen.width < breakPoint
      ? window.screen.width - 60
      : breakPoint - 80;

  return Math.min(
    Math.ceil((display2Width / strLength) * 1.6),
    window.screen.width < breakPoint ? fontSizeSmall : fontSizeBig
  );
};

export class Calculator implements ICalculator {
  display1: HTMLElement;
  display2: HTMLElement;
  currentOperand: string;
  currentOperation: string;
  constructor(displayNode1: HTMLElement, displayNode2: HTMLElement) {
    (this.display1 = displayNode1),
      (this.display2 = displayNode2),
      (this.currentOperand = ''),
      (this.currentOperation = '');
  }

  clear() {
    this.display1.innerText = '';
    this.display2.innerText = '0';
    this.currentOperand = '';
    this.display2.style.fontSize = `${
      window.screen.width < breakPoint ? fontSizeSmall : fontSizeBig
    }px`;
  }

  appendNumber(number: string) {
    if (number === ',' && this.currentOperand.includes(',')) {
      return;
    }
    if (/=|√/.test(this.currentOperation)) {
      this.clear();
    }
    this.currentOperand += number;
    this.display2.style.fontSize = `${getFontSize(
      this.currentOperand.length
    )}px`;
    this.display2.innerText = this.currentOperand;
    this.currentOperation = '';
  }

  openBracket() {
    if (this.currentOperand) {
      this.display1.innerText += this.currentOperand + 'x(';
      this.currentOperand = '';

      return;
    }
    this.display1.innerText += '(';
  }

  closeBracket() {
    const numberOfOpeningBrackets = this.display1.innerText.split('(').length;
    const numberOfClosingBrackets = this.display1.innerText.split(')').length;

    if (
      this.currentOperation ||
      numberOfOpeningBrackets <= numberOfClosingBrackets
    ) {
      return;
    }
    this.display1.innerText += this.currentOperand + ')';
    this.currentOperand = '';
  }

  chooseOperation(operation: string) {
    if (this.currentOperation === '=') {
      this.currentOperation = operation;
      if (operation === '√') {
        this.display1.innerText = operation + this.currentOperand;
      } else {
        this.display1.innerText = this.currentOperand + operation;
      }
      this.currentOperand = '';

      return;
    }
    if (operation === '√') {
      if (!this.currentOperand) {
        const display1 = this.display1.innerText;
        const insertionIndex: number = display1.lastIndexOf('(');

        this.display1.innerText = `${display1.slice(
          0,
          insertionIndex
        )}√${display1.slice(insertionIndex)}`;
        this.currentOperand = '';

        return;
      }
      this.currentOperation = operation;
      this.display1.innerText += `√(${this.currentOperand})`;
      this.currentOperand = '';

      return;
    }
    if (this.currentOperation === '' || this.currentOperation === '√') {
      this.currentOperation = operation;
      this.display1.innerText += this.currentOperand + operation;
    } else {
      this.currentOperation = operation;
      this.display1.innerText =
        this.display1.innerText.slice(0, -1) + this.currentOperand + operation;
    }
    this.currentOperand = '';
  }

  calculate = (str: string, action: string) => {
    let res;

    switch (action) {
      case '*':
        res = strToNumber(str, action)[0] * strToNumber(str, action)[1];
        break;
      case 'x':
        res = strToNumber(str, action)[0] * strToNumber(str, action)[1];
        break;
      case '/':
        res = strToNumber(str, action)[0] / strToNumber(str, action)[1];
        break;
      case '+':
        res = strToNumber(str, action)[0] + strToNumber(str, action)[1];
        break;
      case '-':
        res = strToNumber(str, action)[0] - strToNumber(str, action)[1];
        break;
      default:
        break;
    }

    return String(res?.toFixed(10)).replace('.', ',').replace(/\,?0*$/, '');
  };

  doFirstActions(str: string): string {
    let newStr = str;
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

  openBrackets = (str: string) => {
    let newStr = str;
    let count = 0;
    let targetExp = bracketsRegExp.exec(newStr);

    while (targetExp && count < 3) {
      const expr: string = targetExp[0].slice(1, -1);
      const res = this.doSecondActions(this.doFirstActions(expr));

      newStr = newStr.replace(targetExp[0], String(res));
      targetExp = bracketsRegExp.exec(newStr);
      count++;
    }

    return newStr;
  };
  defineRoots = (str: string) => {
    let newStr = str;
    let count = 0;
    let targetExp = rootRegExp.exec(newStr);

    while (targetExp && count < 3) {
      const arg: string = targetExp[0].replace('√', '');
      const res = Math.sqrt(Number(arg)).toFixed(10);

      newStr = newStr.replace(targetExp[0], String(res));
      targetExp = rootRegExp.exec(newStr);
      count++;
    }

    return newStr.replace('.', ',').replace(/\,0*$/, '');
  };

  calculateExp = () => {
    if (this.currentOperation === '=') {
      return;
    }
    const currentExpression: string =
      this.display1.textContent + this.currentOperand ?? '';
    const withoutBrackets = this.openBrackets(currentExpression);
    const withoutRoots = this.defineRoots(withoutBrackets);
    const firstStep = this.doFirstActions(withoutRoots);
    const secondStep = this.doSecondActions(firstStep);

    this.display1.innerText += this.currentOperand + '=';
    this.currentOperation = '=';
    if (isFinite(Number(secondStep.replace(',', '.')))) {
      this.display2.style.fontSize = `${getFontSize(secondStep.length)}px`;
      this.currentOperand = secondStep;
      this.display2.innerText = secondStep;

      return;
    }
    this.display2.innerText = 'ERROR';
    this.currentOperand = '';
  };
}
