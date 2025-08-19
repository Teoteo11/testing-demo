class Calculator {
    constructor() {
        this.display = document.getElementById('display');
        this.currentInput = '0';
        this.previousInput = null;
        this.operator = null;
        this.waitingForNewInput = false;
        this.shouldResetDisplay = false;
        this.activeOperatorButton = null;
        
        this.initEventListeners();
    }

    initEventListeners() {
        // Numbers
        document.getElementById('zero').addEventListener('click', () => this.inputNumber('0'));
        document.getElementById('one').addEventListener('click', () => this.inputNumber('1'));
        document.getElementById('two').addEventListener('click', () => this.inputNumber('2'));
        document.getElementById('three').addEventListener('click', () => this.inputNumber('3'));
        document.getElementById('four').addEventListener('click', () => this.inputNumber('4'));
        document.getElementById('five').addEventListener('click', () => this.inputNumber('5'));
        document.getElementById('six').addEventListener('click', () => this.inputNumber('6'));
        document.getElementById('seven').addEventListener('click', () => this.inputNumber('7'));
        document.getElementById('eight').addEventListener('click', () => this.inputNumber('8'));
        document.getElementById('nine').addEventListener('click', () => this.inputNumber('9'));

        // Decimal
        document.getElementById('decimal').addEventListener('click', () => this.inputDecimal());

        // Operators
        document.getElementById('add').addEventListener('click', () => this.inputOperator('+'));
        document.getElementById('subtract').addEventListener('click', () => this.inputOperator('-'));
        document.getElementById('multiply').addEventListener('click', () => this.inputOperator('x'));
        document.getElementById('divide').addEventListener('click', () => this.inputOperator('÷'));

        // Functions
        document.getElementById('equals').addEventListener('click', () => this.calculate());
        document.getElementById('clear').addEventListener('click', () => this.clear());
        document.getElementById('toggle-sign').addEventListener('click', () => this.toggleSign());
        document.getElementById('percentage').addEventListener('click', () => this.percentage());

        // Keyboard support
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    inputNumber(num) {
        if (this.waitingForNewInput || this.shouldResetDisplay) {
            this.currentInput = num;
            this.waitingForNewInput = false;
            this.shouldResetDisplay = false;
        } else {
            this.currentInput = this.currentInput === '0' ? num : this.currentInput + num;
        }
        this.updateDisplay();
    }

    inputDecimal() {
        if (this.waitingForNewInput || this.shouldResetDisplay) {
            this.currentInput = '0,';
            this.waitingForNewInput = false;
            this.shouldResetDisplay = false;
        } else if (this.currentInput.indexOf(',') === -1) {
            this.currentInput += ',';
        }
        this.updateDisplay();
    }

    inputOperator(nextOperator) {
        const inputValue = this.parseNumber(this.currentInput);

        if (this.previousInput === null) {
            this.previousInput = inputValue;
        } else if (this.operator && !this.waitingForNewInput) {
            const currentValue = this.previousInput || 0;
            const newValue = this.performCalculation(this.operator, currentValue, inputValue);

            this.currentInput = this.formatNumber(newValue);
            this.previousInput = newValue;
            this.updateDisplay();
        }

        this.waitingForNewInput = true;
        this.operator = nextOperator;
        this.highlightOperator(nextOperator);
    }

    calculate() {
        const inputValue = this.parseNumber(this.currentInput);

        if (this.previousInput !== null && this.operator) {
            const newValue = this.performCalculation(this.operator, this.previousInput, inputValue);
            this.currentInput = this.formatNumber(newValue);
            this.previousInput = null;
            this.operator = null;
            this.waitingForNewInput = true;
            this.shouldResetDisplay = false;
            this.clearOperatorHighlight();
            this.updateDisplay();
        }
    }

    performCalculation(operator, firstValue, secondValue) {
        switch (operator) {
            case '+':
                return firstValue + secondValue;
            case '-':
                return firstValue - secondValue;
            case 'x':
                return firstValue * secondValue;
            case '÷':
                return firstValue / secondValue;
            default:
                return secondValue;
        }
    }

    clear() {
        this.currentInput = '0';
        this.previousInput = null;
        this.operator = null;
        this.waitingForNewInput = false;
        this.shouldResetDisplay = false;
        this.clearOperatorHighlight();
        this.updateDisplay();
        
        // Update clear button text
        document.getElementById('clear').textContent = 'AC';
    }

    toggleSign() {
        if (this.currentInput !== '0') {
            this.currentInput = this.currentInput.startsWith('-') 
                ? this.currentInput.slice(1) 
                : '-' + this.currentInput;
            this.updateDisplay();
        }
    }

    percentage() {
        const value = this.parseNumber(this.currentInput);
        this.currentInput = this.formatNumber(value / 100);
        this.updateDisplay();
    }

    // Utility methods for number formatting
    parseNumber(numberString) {
        // Convert comma to dot for parsing
        return parseFloat(numberString.replace(',', '.'));
    }

    formatNumber(number) {
        // Convert dot back to comma for display
        return number.toString().replace('.', ',');
    }

    highlightOperator(operator) {
        this.clearOperatorHighlight();
        
        let buttonId;
        switch (operator) {
            case '+': buttonId = 'add'; break;
            case '-': buttonId = 'subtract'; break;
            case 'x': buttonId = 'multiply'; break;
            case '÷': buttonId = 'divide'; break;
        }
        
        if (buttonId) {
            this.activeOperatorButton = document.getElementById(buttonId);
            this.activeOperatorButton.classList.add('active');
        }
    }

    clearOperatorHighlight() {
        if (this.activeOperatorButton) {
            this.activeOperatorButton.classList.remove('active');
            this.activeOperatorButton = null;
        }
    }

    updateDisplay() {
        let displayValue = this.currentInput;
        
        // Format large numbers
        const numericValue = this.parseNumber(displayValue);
        if (!isNaN(numericValue)) {
            if (Math.abs(numericValue) >= 1000000000) {
                displayValue = numericValue.toExponential(2).replace('.', ',');
            } else if (Math.abs(numericValue) >= 1000000) {
                // Format with Italian locale (dot for thousands, comma for decimals)
                displayValue = numericValue.toLocaleString('it-IT', { 
                    maximumFractionDigits: 8,
                    useGrouping: true 
                });
            } else {
                // Remove trailing zeros after comma
                displayValue = this.formatNumber(numericValue);
                if (displayValue.includes(',')) {
                    displayValue = displayValue.replace(/,?0+$/, '');
                    // Don't remove comma if it's the last character and we just added it
                    if (displayValue.endsWith(',') && this.currentInput.endsWith(',')) {
                        // Keep the comma
                    } else if (displayValue.endsWith(',')) {
                        displayValue = displayValue.slice(0, -1);
                    }
                }
            }
        }

        this.display.textContent = displayValue;
        
        // Adjust font size based on length
        if (displayValue.length > 9) {
            this.display.className = 'display-text smaller';
        } else if (displayValue.length > 6) {
            this.display.className = 'display-text small';
        } else {
            this.display.className = 'display-text';
        }

        // Update clear button text
        const clearButton = document.getElementById('clear');
        if (this.currentInput !== '0' || this.previousInput !== null) {
            clearButton.textContent = 'C';
        } else {
            clearButton.textContent = 'AC';
        }
    }

    handleKeyboard(e) {
        e.preventDefault();
        
        const key = e.key;
        
        if ('0123456789'.includes(key)) {
            this.inputNumber(key);
        } else if (key === '.' || key === ',') {
            this.inputDecimal();
        } else if (key === '+') {
            this.inputOperator('+');
        } else if (key === '-') {
            this.inputOperator('-');
        } else if (key === '*') {
            this.inputOperator('x');
        } else if (key === '/') {
            this.inputOperator('÷');
        } else if (key === 'Enter' || key === '=') {
            this.calculate();
        } else if (key === 'Escape' || key === 'c' || key === 'C') {
            this.clear();
        } else if (key === '%') {
            this.percentage();
        } else if (key === 'Backspace') {
            this.backspace();
        }
    }

    backspace() {
        if (this.waitingForNewInput || this.currentInput.length === 1) {
            this.currentInput = '0';
        } else {
            this.currentInput = this.currentInput.slice(0, -1);
        }
        this.updateDisplay();
    }
}

// Initialize calculator when page loads
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});