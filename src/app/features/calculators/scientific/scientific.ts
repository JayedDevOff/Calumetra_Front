import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-scientific',
  imports: [CommonModule],
  templateUrl: './scientific.html',
  styleUrl: './scientific.scss',
})
export class Scientific {
  display = '0';
  expression = '';
  mode: 'DEG' | 'RAD' = 'DEG';
  memory = 0;
  justCalculated = false;
  history: { expression: string; result: string }[] = [];

  private waitingForOperand = false;

  @HostListener('window:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent): void {
    const key = event.key;

    if (/^[0-9]$/.test(key)) {
      event.preventDefault();
      this.inputDigit(key);
      return;
    }

    if (key === '.') {
      event.preventDefault();
      this.inputDecimal();
      return;
    }

    if (['+', '-', '*', '/', '(', ')', '%'].includes(key)) {
      event.preventDefault();

      if (key === '*') {
        this.inputOperator('×');
      } else if (key === '/') {
        this.inputOperator('÷');
      } else if (key === '%') {
        this.percentage();
      } else if (key === '(' || key === ')') {
        this.inputParenthesis(key);
      } else {
        this.inputOperator(key);
      }

      return;
    }

    if (key === '^') {
      event.preventDefault();
      this.inputOperator('^');
      return;
    }

    if (key === 'Enter' || key === '=') {
      event.preventDefault();
      this.calculate();
      return;
    }

    if (key === 'Escape') {
      event.preventDefault();
      this.clear();
      return;
    }

    if (key === 'Backspace') {
      event.preventDefault();
      this.deleteLast();
      return;
    }

    if (key === 'Delete') {
      event.preventDefault();
      this.clear();
    }
  }

  inputDigit(digit: string): void {
    if (this.display === 'Error') {
      this.clear();
    }

    if (this.justCalculated) {
      this.display = digit;
      this.expression = '';
      this.justCalculated = false;
      this.waitingForOperand = false;
      return;
    }

    if (this.waitingForOperand) {
      this.display = digit;
      this.waitingForOperand = false;
      return;
    }

    this.display = this.display === '0' ? digit : this.display + digit;
  }

  inputDecimal(): void {
    if (this.display === 'Error') {
      this.clear();
    }

    if (this.justCalculated) {
      this.display = '0.';
      this.expression = '';
      this.justCalculated = false;
      this.waitingForOperand = false;
      return;
    }

    if (this.waitingForOperand) {
      this.display = '0.';
      this.waitingForOperand = false;
      return;
    }

    if (!this.display.includes('.')) {
      this.display += '.';
    }
  }

  inputOperator(operator: string): void {
    if (this.display === 'Error') {
      return;
    }

    if (this.justCalculated) {
      this.expression = this.display;
      this.justCalculated = false;
    }

    const currentExpression = this.expression.trim();

    if (currentExpression && /[+\-×÷^]$/.test(currentExpression)) {
      this.expression = currentExpression.slice(0, -1).trim() + ` ${operator} `;
    } else {
      this.expression = `${this.expression}${this.display} ${operator} `;
    }

    this.waitingForOperand = true;
  }

  inputParenthesis(value: '(' | ')'): void {
    if (this.display === 'Error') {
      this.clear();
    }

    if (value === '(') {
      if (this.justCalculated) {
        this.expression = '';
        this.display = '0';
        this.justCalculated = false;
      }

      if (this.expression && !this.expression.endsWith(' ')) {
        this.expression += ' × ';
      }

      this.expression += '(';
      this.display = '0';
      this.waitingForOperand = true;
      return;
    }

    if (this.expression && !this.expression.endsWith(' ')) {
      this.expression += this.display;
    } else {
      this.expression += this.display;
    }

    this.expression += ')';
    this.display = '0';
    this.waitingForOperand = true;
  }

  scientificFunction(fn: string): void {
    const value = Number(this.display);

    if (!Number.isFinite(value)) {
      return;
    }

    let result: number;

    try {
      switch (fn) {
        case 'sin':
          result = Math.sin(this.toRadians(value));
          break;

        case 'cos':
          result = Math.cos(this.toRadians(value));
          break;

        case 'tan':
          result = Math.tan(this.toRadians(value));
          break;

        case 'asin':
          result = this.fromRadians(Math.asin(value));
          break;

        case 'acos':
          result = this.fromRadians(Math.acos(value));
          break;

        case 'atan':
          result = this.fromRadians(Math.atan(value));
          break;

        case 'log':
          result = Math.log10(value);
          break;

        case 'ln':
          result = Math.log(value);
          break;

        case 'sqrt':
          result = Math.sqrt(value);
          break;

        case 'square':
          result = value ** 2;
          break;

        case 'cube':
          result = value ** 3;
          break;

        case 'reciprocal':
          result = 1 / value;
          break;

        case 'factorial':
          result = this.factorial(value);
          break;

        case 'abs':
          result = Math.abs(value);
          break;

        case 'exp':
          result = Math.exp(value);
          break;

        case 'tenPower':
          result = 10 ** value;
          break;

        default:
          return;
      }

      if (!Number.isFinite(result)) {
        throw new Error();
      }

      this.display = this.formatNumber(result);
      this.justCalculated = false;
      this.waitingForOperand = false;
    } catch {
      this.display = 'Error';
      this.justCalculated = true;
      this.waitingForOperand = false;
    }
  }

  insertConstant(constant: 'pi' | 'e'): void {
    const value = constant === 'pi' ? Math.PI : Math.E;

    const formatted = this.formatNumber(value);

    if (this.display === 'Error') {
      this.clear();
    }

    if (this.justCalculated) {
      this.display = formatted;
      this.expression = '';
      this.justCalculated = false;
      this.waitingForOperand = false;
      return;
    }

    if (this.waitingForOperand) {
      this.display = formatted;
      this.waitingForOperand = false;
      return;
    }

    if (this.display === '0') {
      this.display = formatted;
    } else {
      this.display += formatted;
    }
  }

  calculate(): void {
    if (this.display === 'Error') {
      return;
    }

    let fullExpression = this.expression.trim();

    if (!this.waitingForOperand) {
      fullExpression += this.display;
    }

    fullExpression = fullExpression.trim();

    if (!fullExpression) {
      return;
    }

    fullExpression = this.removeIncompleteOperators(fullExpression);

    try {
      const result = this.evaluateExpression(fullExpression);

      if (!Number.isFinite(result)) {
        throw new Error();
      }

      const formattedResult = this.formatNumber(result);

      this.history.unshift({
        expression: fullExpression,
        result: formattedResult,
      });

      if (this.history.length > 10) {
        this.history = this.history.slice(0, 10);
      }

      this.display = formattedResult;
      this.expression = fullExpression;
      this.justCalculated = true;
      this.waitingForOperand = false;
    } catch {
      this.display = 'Error';
      this.justCalculated = true;
      this.waitingForOperand = false;
    }
  }

  clear(): void {
    this.display = '0';
    this.expression = '';
    this.justCalculated = false;
    this.waitingForOperand = false;
  }

  deleteLast(): void {
    if (this.display === 'Error') {
      this.clear();
      return;
    }

    if (this.justCalculated || this.waitingForOperand) {
      this.display = '0';
      this.justCalculated = false;
      this.waitingForOperand = false;
      return;
    }

    if (this.display.length <= 1) {
      this.display = '0';
      return;
    }

    this.display = this.display.slice(0, -1);
  }

  toggleSign(): void {
    if (this.display === 'Error' || this.display === '0') {
      return;
    }

    this.display = this.display.startsWith('-') ? this.display.substring(1) : `-${this.display}`;
  }

  percentage(): void {
    const value = Number(this.display);

    if (!Number.isFinite(value)) {
      return;
    }

    this.display = this.formatNumber(value / 100);
    this.justCalculated = false;
    this.waitingForOperand = false;
  }

  toggleMode(): void {
    this.mode = this.mode === 'DEG' ? 'RAD' : 'DEG';
  }

  memoryClear(): void {
    this.memory = 0;
  }

  memoryRecall(): void {
    this.display = this.formatNumber(this.memory);
    this.justCalculated = false;
    this.waitingForOperand = false;
  }

  memoryAdd(): void {
    const value = Number(this.display);

    if (Number.isFinite(value)) {
      this.memory += value;
    }
  }

  memorySubtract(): void {
    const value = Number(this.display);

    if (Number.isFinite(value)) {
      this.memory -= value;
    }
  }

  useHistory(item: { expression: string; result: string }): void {
    this.display = item.result;
    this.expression = item.expression;
    this.justCalculated = true;
    this.waitingForOperand = false;
  }

  clearHistory(): void {
    this.history = [];
  }

  private evaluateExpression(expression: string): number {
    const tokens = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, Math.PI.toString())
      .replace(/\be\b/g, Math.E.toString())
      .replace(/\s+/g, '');

    if (!tokens) {
      throw new Error();
    }

    const values: number[] = [];
    const operators: string[] = [];

    const precedence = (operator: string): number => {
      if (operator === '+' || operator === '-') {
        return 1;
      }

      if (operator === '*' || operator === '/') {
        return 2;
      }

      if (operator === '^') {
        return 3;
      }

      return 0;
    };

    const applyOperator = (): void => {
      const operator = operators.pop();

      if (!operator) {
        throw new Error();
      }

      const right = values.pop();
      const left = values.pop();

      if (left === undefined || right === undefined) {
        throw new Error();
      }

      let result: number;

      switch (operator) {
        case '+':
          result = left + right;
          break;

        case '-':
          result = left - right;
          break;

        case '*':
          result = left * right;
          break;

        case '/':
          if (right === 0) {
            throw new Error();
          }

          result = left / right;
          break;

        case '^':
          result = Math.pow(left, right);
          break;

        default:
          throw new Error();
      }

      if (!Number.isFinite(result)) {
        throw new Error();
      }

      values.push(result);
    };

    let index = 0;

    while (index < tokens.length) {
      const char = tokens[index];

      const previousChar = index > 0 ? tokens[index - 1] : '';

      const isUnaryMinus =
        char === '-' &&
        (index === 0 || previousChar === '(' || ['+', '-', '*', '/', '^'].includes(previousChar));

      if (/[0-9.]/.test(char) || isUnaryMinus) {
        let number = char;
        index++;

        let decimalCount = char === '.' ? 1 : 0;

        while (index < tokens.length) {
          const next = tokens[index];

          if (/[0-9]/.test(next)) {
            number += next;
            index++;
            continue;
          }

          if (next === '.') {
            decimalCount++;

            if (decimalCount > 1) {
              throw new Error();
            }

            number += next;
            index++;
            continue;
          }

          break;
        }

        const parsed = Number(number);

        if (!Number.isFinite(parsed)) {
          throw new Error();
        }

        values.push(parsed);
        continue;
      }

      if (char === '(') {
        operators.push(char);
        index++;
        continue;
      }

      if (char === ')') {
        while (operators.length && operators[operators.length - 1] !== '(') {
          applyOperator();
        }

        if (!operators.length || operators[operators.length - 1] !== '(') {
          throw new Error();
        }

        operators.pop();
        index++;
        continue;
      }

      if (['+', '-', '*', '/', '^'].includes(char)) {
        while (
          operators.length &&
          operators[operators.length - 1] !== '(' &&
          precedence(operators[operators.length - 1]) >= precedence(char)
        ) {
          applyOperator();
        }

        operators.push(char);
        index++;
        continue;
      }

      throw new Error();
    }

    while (operators.length) {
      if (operators[operators.length - 1] === '(') {
        throw new Error();
      }

      applyOperator();
    }

    if (values.length !== 1) {
      throw new Error();
    }

    if (!Number.isFinite(values[0])) {
      throw new Error();
    }

    return values[0];
  }

  private removeIncompleteOperators(expression: string): string {
    let result = expression.trim();

    while (/[+\-×÷^]$/.test(result)) {
      result = result.slice(0, -1).trim();
    }

    return result;
  }

  private factorial(value: number): number {
    if (!Number.isInteger(value) || value < 0 || value > 170) {
      throw new Error();
    }

    let result = 1;

    for (let i = 2; i <= value; i++) {
      result *= i;
    }

    return result;
  }

  private toRadians(value: number): number {
    return this.mode === 'DEG' ? (value * Math.PI) / 180 : value;
  }

  private fromRadians(value: number): number {
    return this.mode === 'DEG' ? (value * 180) / Math.PI : value;
  }

  private formatNumber(value: number): string {
    if (Math.abs(value) < 1e-12) {
      value = 0;
    }

    return Number(value.toPrecision(12)).toString();
  }
}
