const display = document.getElementById("display");
const history = document.getElementById("history");
let currentInput = "";
function updateDisplay() {
  display.value = currentInput || "0";
}
function appendNumber(num) {
  currentInput += num;
  updateDisplay();
}
function appendOperator(op) {
  if (currentInput === "") return;
  const lastChar = currentInput.slice(-1);
  if ("+-*/".includes(lastChar)) {
    currentInput = currentInput.slice(0, -1);
  }
  currentInput += op;
  updateDisplay();
}
function clearDisplay() {
  currentInput = "";
  updateDisplay();
}
function appendDot() {
  if (!currentInput.includes(".")) {
    currentInput += ".";
    updateDisplay();
  }
}
function backspace() {
  currentInput = currentInput.slice(0, -1);
  updateDisplay();
}
function calculateResult() {
  try {
    const result = eval(currentInput);
    const entry = `${currentInput} = ${result}`;
    const div = document.createElement("div");
    div.textContent = entry;
    history.appendChild(div);
    saveToHistory(entry);
    currentInput = result.toString();
    updateDisplay();
  } catch {
    display.value = "Error";
  }
}

function saveToHistory(entry) {
  let logs = JSON.parse(localStorage.getItem("calc-history")) || [];
  logs.push(entry);
  localStorage.setItem("calc-history", JSON.stringify(logs));
}

function loadHistory() {
  let logs = JSON.parse(localStorage.getItem("calc-history")) || [];
  history.innerHTML = logs.map((item) => `<div>${item}</div>`).join("");
}

window.clearHistory = function () {
  localStorage.removeItem("calc-history");
  history.innerHTML = "";
};

window.toggleTheme = function () {
  document.body.classList.toggle("light-theme");
  var x = document.getElementById("myMode");
  if (x.innerHTML === "Light") {
    x.innerHTML = "Dark";
  } else {
    x.innerHTML = "Light";
  }
};

// Centralized button handler
document.querySelectorAll("button[data-value]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const value = btn.dataset.value;
    if (!value) return;

    switch (value) {
      case "=":
        return calculateResult();
      case "clear":
        return clearDisplay();
      case "backspace":
        return backspace();
      case "+":
      case "-":
      case "*":
      case "/":
      case "%":
      case "**":
        return appendOperator(value);
      case ".":
        return appendDot();
      default:
        if (!isNaN(value)) appendNumber(value);
    }
  });
});

// Keyboard support
document.addEventListener("keydown", (e) => {
  if (!isNaN(e.key)) appendNumber(e.key);
  else if ("+-*/".includes(e.key)) appendOperator(e.key);
  else if (e.key === ".") appendDot();
  else if (e.key === "Enter") calculateResult();
  else if (e.key === "Backspace") backspace();
  else if (e.key === "Escape") clearDisplay();
});

updateDisplay();
loadHistory();
