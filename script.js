let display = document.getElementById("display");

function appendValue(value) {
  display.value += value;
}

function clearDisplay() {
  display.value = "";
}

function calculate() {
  try {
    const result = evaluateExpression(display.value);
    display.value = result;
  } catch (e) {
    display.value = "Error";
  }
}

function evaluateExpression(expr) {
  // Tokenize input (split into numbers, operators, parentheses)
  const tokens = tokenize(expr);
  const [result, remaining] = parseExpression(tokens);

  if (remaining.length > 0) {
    throw new Error("Unexpected input");
  }

  return result;
}

// Tokenizer
function tokenize(expr) {
  const regex = /\d+(\.\d+)?|[()+\-*/]/g;
  return expr.match(regex) || [];
}

// Recursive Descent Parser
function parseExpression(tokens) {
  let [value, rest] = parseTerm(tokens);

  while (rest[0] === '+' || rest[0] === '-') {
    const operator = rest[0];
    const [nextValue, remaining] = parseTerm(rest.slice(1));
    value = operator === '+' ? value + nextValue : value - nextValue;
    rest = remaining;
  }

  return [value, rest];
}

function parseTerm(tokens) {
  let [value, rest] = parseFactor(tokens);

  while (rest[0] === '*' || rest[0] === '/') {
    const operator = rest[0];
    const [nextValue, remaining] = parseFactor(rest.slice(1));
    value = operator === '*' ? value * nextValue : value / nextValue;
    rest = remaining;
  }

  return [value, rest];
}

function parseFactor(tokens) {
  const token = tokens[0];

  if (!token) throw new Error("Unexpected end of input");

  if (token === '(') {
    const [value, rest] = parseExpression(tokens.slice(1));
    if (rest[0] !== ')') throw new Error("Expected closing parenthesis");
    return [value, rest.slice(1)];
  } else if (!isNaN(token)) {
    return [parseFloat(token), tokens.slice(1)];
  } else {
    throw new Error("Unexpected token: " + token);
  }
}


// 🔑 Listen for keyboard input
document.addEventListener("keydown", function(event) {
  const key = event.key;

  if (!isNaN(key) || ['+', '-', '*', '/', '.'].includes(key)) {
    appendValue(key);
  } else if (key === 'Enter') {
    event.preventDefault(); // prevent form submission if in a form
    calculate();
  } else if (key === 'Backspace') {
    display.value = display.value.slice(0, -1);
  } else if (key.toLowerCase() === 'c') {
    clearDisplay();
  }
});

