const display = document.getElementById('display');

/* Load saved value */
const savedValue = localStorage.getItem('calculatorValue');

if (savedValue !== null) {
  display.value = savedValue;
}

/* Save value */
function saveValue() {
  localStorage.setItem('calculatorValue', display.value);
}

/* Add value at cursor position */
function appendValue(value) {

  const start = display.selectionStart;
  const end = display.selectionEnd;

  /* Convert . to 0. */
  if (value === '.') {

    const beforeCursor = display.value.substring(0, start);

    if (
      beforeCursor === '' ||
      /[+\-*/%]$/.test(beforeCursor)
    ) {
      value = '0.';
    }
  }

  display.value =
    display.value.substring(0, start) +
    value +
    display.value.substring(end);

  display.focus();

  display.selectionStart =
  display.selectionEnd =
    start + value.length;

  saveValue();
}

/* Clear display */
function clearDisplay() {
  display.value = '';
  saveValue();
}

/* Delete character before cursor */
function deleteLast() {

  const start = display.selectionStart;
  const end = display.selectionEnd;

  if (start !== end) {

    display.value =
      display.value.substring(0, start) +
      display.value.substring(end);

    display.selectionStart =
    display.selectionEnd =
      start;

  } else if (start > 0) {

    display.value =
      display.value.substring(0, start - 1) +
      display.value.substring(start);

    display.selectionStart =
    display.selectionEnd =
      start - 1;
  }

  display.focus();
  saveValue();
}

/* Calculate */
function calculate() {

  try {

    if (display.value.trim() === '') {
      display.value = 'Error';
      saveValue();
      return;
    }

    const result = eval(display.value);

    if (result === Infinity || result === -Infinity) {
      display.value = 'Cannot divide by 0';
      saveValue();
      return;
    }

    if (isNaN(result)) {
      display.value = 'Error';
      saveValue();
      return;
    }

    display.value = result;
    saveValue();

  } catch (error) {

    display.value = 'Error';
    saveValue();

  }
}

/* Block invalid keys */
display.addEventListener('keydown', (event) => {

  const allowedKeys = [
    '0', '1', '2', '3', '4',
    '5', '6', '7', '8', '9',
    '+', '-', '*', '/', '%', '.',
    'Backspace',
    'Delete',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'Tab',
    'Home',
    'End',
    'Enter',
    'Escape'
  ];

  if (!allowedKeys.includes(event.key)) {
    event.preventDefault();
  }
});

/* Remove pasted invalid characters */
display.addEventListener('input', () => {

  display.value = display.value.replace(
    /[^0-9+\-*/%.]/g,
    ''
  );

  saveValue();
});

/* Global keyboard shortcuts */
document.addEventListener('keydown', (event) => {

  if (event.key === 'Enter') {
    event.preventDefault();
    calculate();
  }

  else if (event.key === 'Escape') {
    clearDisplay();
  }
});