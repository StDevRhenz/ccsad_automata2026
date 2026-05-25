// Section 1: Page Transition
document.getElementById("startBtn").addEventListener("click", () => {
  document.getElementById("introPage").classList.add("hidden");
  document.getElementById("homePage").classList.remove("hidden");
});

// Section 2: Topic Button Wiring
const topicButtons = document.querySelectorAll(".topic-btn");
const rightPanel = document.getElementById("rightPanel");

topicButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Remove active from all
    topicButtons.forEach((b) => b.classList.remove("active"));
    // Set active on clicked
    btn.classList.add("active");
    // Render the corresponding topic
    renderTopic(btn.dataset.topic);
  });
});

// Section 3: renderTopic() — The Bridge Function
function renderTopic(topicId) {
  const config = topicConfig[topicId];
  if (!config) return;

  rightPanel.innerHTML = `
    <h2 class="topic-title">${config.title}</h2>
    <p class="topic-desc">${config.description}</p>
    <hr class="section-divider" />
    <span class="section-label">Input</span>
    ${config.inputHTML}
    <hr class="section-divider" />
    <span class="section-label">Result</span>
    <div class="result-box" id="resultBox">—</div>
    <span id="statusMsg"></span>
  `;

  // Bind compute button
  const computeBtn = document.getElementById("computeBtn");
  if (computeBtn) {
    computeBtn.addEventListener("click", () => runCompute(topicId));
  }

  // Bind Enter key on input fields
  rightPanel.querySelectorAll(".input-field").forEach((field) => {
    field.addEventListener("keydown", (e) => {
      if (e.key === "Enter") runCompute(topicId);
    });
  });
}

// Section 4: topicConfig — Topic Definitions
const topicConfig = {
  palindrome: {
    title: "Palindrome",
    description:
      "Checks if a string reads the same forwards and backwards. Spaces are ignored and the check is case-insensitive.",
    inputHTML: `
      <input id="inp1" class="input-field" type="text" placeholder="Enter a string..." />
      <span id="errMsg" class="error-msg"></span>
      <button id="computeBtn" class="btn btn--compute">Check</button>
    `,
  },
  division: {
    title: "Division Algorithm",
    description:
      "Computes the quotient and remainder when dividing two integers using the division algorithm.",
    inputHTML: `
      <input id="inp1" class="input-field" type="number" placeholder="First integer..." />
      <input id="inp2" class="input-field" type="number" placeholder="Second integer..." />
      <span id="errMsg" class="error-msg"></span>
      <button id="computeBtn" class="btn btn--compute">Calculate</button>
    `,
  },
  euclidean: {
    title: "Euclidean Algorithm",
    description:
      "Finds the Greatest Common Divisor (GCD) and Least Common Multiple (LCM) using the Euclidean algorithm, shown step by step.",
    inputHTML: `
      <input id="inp1" class="input-field" type="number" placeholder="First integer..." />
      <input id="inp2" class="input-field" type="number" placeholder="Second integer..." />
      <span id="errMsg" class="error-msg"></span>
      <button id="computeBtn" class="btn btn--compute">Calculate</button>
    `,
  },
  collatz: {
    title: "Collatz Sequence",
    description:
      "Generates the Collatz sequence from a starting positive odd integer. If even → divide by 2; if odd → multiply by 3 and add 1. Stops at 1.",
    inputHTML: `
      <input id="inp1" class="input-field" type="number" placeholder="Enter a positive odd integer..." />
      <span id="errMsg" class="error-msg"></span>
      <button id="computeBtn" class="btn btn--compute">Generate</button>
    `,
  },
  fibonacci: {
    title: "Fibonacci Numbers",
    description:
      "Generates the Fibonacci sequence. Each term is the sum of the two preceding terms. Starts at F₀=0, F₁=1.",
    inputHTML: `
      <input id="inp1" class="input-field" type="number" placeholder="Number of terms..." />
      <span id="errMsg" class="error-msg"></span>
      <p class="topic-hint"> Note: Number of terms must be greater than 2.</p>
      <button id="computeBtn" class="btn btn--compute">Generate</button>
    `,
  },
  tribonacci: {
    title: "Tribonacci Numbers",
    description:
      "Generates the Tribonacci sequence. Each term is the sum of the three preceding terms. Starts at T₀=0, T₁=0, T₂=1.",
    inputHTML: `
      <input id="inp1" class="input-field" type="number" placeholder="Number of terms..." />
      <span id="errMsg" class="error-msg"></span>
      <p class="topic-hint">Note: Number of terms must be greater than 3.</p>
      <button id="computeBtn" class="btn btn--compute">Generate</button>
    `,
  },
  lucas: {
    title: "Lucas Numbers",
    description:
      "Generates the Lucas sequence. Like Fibonacci but starts at L₀=2, L₁=1. Named after French mathematician Édouard Lucas.",
    inputHTML: `
      <input id="inp1" class="input-field" type="number" placeholder="Number of terms..." />
      <span id="errMsg" class="error-msg"></span>
      <p class="topic-hint">Note: Number of terms must be greater than 2.</p>
      <button id="computeBtn" class="btn btn--compute">Generate</button>
    `,
  },
};

// Section 5: runCompute() — Dispatch to Compute Functions
function runCompute(topicId) {
  const inp1 = document.getElementById("inp1");
  const inp2 = document.getElementById("inp2");
  const errMsg = document.getElementById("errMsg");
  const result = document.getElementById("resultBox");
  const status = document.getElementById("statusMsg");

  errMsg.textContent = "";
  if (status) status.textContent = "";

  let res;
  switch (topicId) {
    case "palindrome":
      res = computePalindrome(inp1.value);
      break;
    case "division":
      res = computeDivision(inp1.value, inp2 ? inp2.value : "");
      break;
    case "euclidean":
      res = computeEuclidean(inp1.value, inp2 ? inp2.value : "");
      break;
    case "collatz":
      res = computeCollatz(inp1.value);
      break;
    case "fibonacci":
      res = computeFibonacci(inp1.value);
      break;
    case "tribonacci":
      res = computeTribonacci(inp1.value);
      break;
    case "lucas":
      res = computeLucas(inp1.value);
      break;
  }

  if (res.error) {
    errMsg.textContent = res.error;
    result.textContent = "—";
    return;
  }

  result.classList.remove("result-appear");
  void result.offsetWidth; // force reflow for animation restart
  result.classList.add("result-appear");
  result.textContent = formatResult(topicId, res);

  if (status && res.sequence) {
    status.className = "success-msg";
    status.textContent = `Done! Generated ${res.sequence.length} terms.`;
  }
}

// Section 6: formatResult() — Output Formatting
function toSubscript(num) {
  const subscripts = "₀₁₂₃₄₅₆₇₈₉";
  return num
    .toString()
    .split("")
    .map((digit) => subscripts[digit])
    .join("");
}

function formatNum(num) {
  return Number(num).toLocaleString();
}

function formatResult(topicId, res) {
  const divider = "---------------------------------";

  switch (topicId) {
    case "palindrome":
      return (
        `${divider}\n` +
        `STRING RECORDED : "${res.str}"\n` +
        `LENGTH          : ${res.length}\n` +
        `${divider}\n` +
        `RESULT          : ${res.isPalindrome ? "PALINDROME" : "NOT A PALINDROME"}\n` +
        `${divider}`
      );

    case "division":
      return (
        `${divider}\n` +
        `EQUATION  : ${formatNum(res.m)} = ${formatNum(res.n)}(${formatNum(
          res.q,
        )}) + ${formatNum(res.r)}\n` +
        `${divider}\n` +
        `DIVIDEND  : ${formatNum(res.m)}\n` +
        `DIVISOR   : ${formatNum(res.n)}\n` +
        `QUOTIENT  : ${formatNum(res.q)}\n` +
        `REMAINDER : ${formatNum(res.r)}\n` +
        `${divider}`
      );

    case "euclidean":
      return (
        `${divider}\n` +
        `ITERATION LOG:\n` +
        res.steps.join("\n") +
        "\n" +
        `${divider}\n` +
        `INTEGERS  : ${formatNum(res.originalM)}, ${formatNum(res.originalN)}\n` +
        `GCD       : ${formatNum(res.gcd)}\n` +
        `LCM       : ${formatNum(res.lcm)}\n` +
        `${divider}`
      );

    case "collatz":
      return (
        `${divider}\n` +
        `The Collatz sequence are:\n` +
        `${res.sequence.map(formatNum).join(", ")}\n` +
        `${divider}\n` +
        `TOTAL STEPS : ${res.sequence.length}\n` +
        `${divider}`
      );

    case "fibonacci":
      return (
        `${divider}\n` +
        `FIBONACCI SEQUENCE:\n` +
        res.sequence.join(", ") +
        "\n" +
        `${divider}\n` +
        `TERMS GENERATED : ${res.sequence.length}\n` +
        `${divider}`
      );

    case "tribonacci":
      return (
        `${divider}\n` +
        `TRIBONACCI SEQUENCE:\n` +
        res.sequence.join(", ") +
        "\n" +
        `${divider}\n` +
        `TERMS GENERATED : ${res.sequence.length}\n` +
        `${divider}`
      );

    case "lucas":
      return (
        `${divider}\n` +
        `LUCAS SEQUENCE:\n` +
        res.sequence.join(", ") +
        "\n" +
        `${divider}\n` +
        `TERMS GENERATED : ${res.sequence.length}\n` +
        `${divider}`
      );

    default:
      return JSON.stringify(res);
  }
}

// Section 7: All Compute Functions
function computePalindrome(str) {
  if (!str || str.trim() === "") {
    return { error: "INVALID: Input cannot be empty or whitespace" };
  }

  // Remove spaces for display, length, and check
  const strWithoutSpaces = str.replace(/\s+/g, "");

  const sanitized = strWithoutSpaces.toLowerCase();
  const reversed = sanitized.split("").reverse().join("");
  const isPalindrome = sanitized === reversed;

  return {
    isPalindrome,
    str: strWithoutSpaces,
    normalized: sanitized,
    length: strWithoutSpaces.length,
  };
}

function computeDivision(input1, input2) {
  function validate(val, label) {
    if (!val || val.trim() === "") return `INVALID: ${label} cannot be empty`;
    if (val.includes(" ")) return `INVALID: ${label} cannot contain spaces`;
    if (/[^0-9]/.test(val))
      return `INVALID: ${label} must be a positive integer (no letters, decimals, or signs)`;
    if (val.startsWith("0"))
      return `INVALID: ${label} cannot be zero or have leading zeros`;
    return null;
  }

  const err1 = validate(input1, "First input");
  if (err1) return { error: err1 };
  const err2 = validate(input2, "Second input");
  if (err2) return { error: err2 };

  const a = parseInt(input1);
  const b = parseInt(input2);

  const m = Math.max(a, b);
  const n = Math.min(a, b);

  const q = Math.floor(m / n);
  const r = m % n;

  return { m, n, q, r };
}

function computeEuclidean(input1, input2) {
  function validate(val, label) {
    if (!val || val.trim() === "") return `INVALID: ${label} cannot be empty`;
    if (val.includes(" ")) return `INVALID: ${label} cannot contain spaces`;
    if (/[^0-9]/.test(val))
      return `INVALID: ${label} must be a positive integer (no letters, decimals, or signs)`;
    if (val.startsWith("0"))
      return `INVALID: ${label} cannot be zero or have leading zeros`;
    return null;
  }

  const err1 = validate(input1, "First input");
  if (err1) return { error: err1 };
  const err2 = validate(input2, "Second input");
  if (err2) return { error: err2 };

  const val1 = parseInt(input1);
  const val2 = parseInt(input2);

  let m = Math.max(val1, val2);
  let n = Math.min(val1, val2);

  const originalM = m;
  const originalN = n;
  const steps = [];
  let gcd = n;

  while (n !== 0) {
    const q = Math.floor(m / n);
    const r = m % n;

    if (r === 0) {
      steps.push(`${formatNum(m)} = ${formatNum(n)}(${formatNum(q)})`);
      gcd = n;
    } else {
      steps.push(
        `${formatNum(m)} = ${formatNum(n)}(${formatNum(q)}) + ${formatNum(r)}`,
      );
    }

    m = n;
    n = r;
  }

  const lcm = (originalM * originalN) / gcd;
  return { steps, originalM, originalN, gcd, lcm };
}

function computeCollatz(input) {
  if (
    !input ||
    input.trim() === "" ||
    input.includes(" ") ||
    /[^0-9]/.test(input)
  ) {
    return { error: "INVALID OUTPUT" };
  }
  if (input.startsWith("0")) {
    return { error: "INVALID OUTPUT" };
  }

  const n = parseInt(input);
  if (n === 0 || n % 2 === 0) {
    return { error: "INVALID OUTPUT" };
  }

  const sequence = [];
  let current = n;

  while (current !== 1) {
    sequence.push(current);
    if (current % 2 !== 0) {
      current = 3 * current + 1;
    } else {
      current = current / 2;
    }
  }
  sequence.push(1);

  return { sequence };
}

function computeFibonacci(input) {
  function validate(val) {
    if (!val || val.trim() === "") return "INVALID: Input cannot be empty";
    if (val.includes(" ")) return "INVALID: Input cannot contain spaces";
    if (/[^0-9]/.test(val)) return "INVALID: Input must be a positive integer";
    if (val.startsWith("0"))
      return "INVALID: Input cannot be zero or have leading zeros";
    const n = parseInt(val);
    if (n <= 2) return "INVALID: Number of terms must be greater than 2";
    return null;
  }

  const err = validate(input);
  if (err) return { error: err };

  const n = parseInt(input);
  const seq = [0, 1];
  for (let i = 2; i < n; i++) {
    seq.push(seq[i - 1] + seq[i - 2]);
  }

  return { sequence: seq };
}

function computeTribonacci(input) {
  function validate(val) {
    if (!val || val.trim() === "") return "INVALID: Input cannot be empty";
    if (val.includes(" ")) return "INVALID: Input cannot contain spaces";
    if (/[^0-9]/.test(val)) return "INVALID: Input must be a positive integer";
    if (val.startsWith("0"))
      return "INVALID: Input cannot be zero or have leading zeros";
    const n = parseInt(val);
    if (n <= 3) return "INVALID: Number of terms must be greater than 3";
    return null;
  }

  const err = validate(input);
  if (err) return { error: err };

  const n = parseInt(input);
  const seq = [0, 0, 1];
  for (let i = 3; i < n; i++) {
    seq.push(seq[i - 1] + seq[i - 2] + seq[i - 3]);
  }

  return { sequence: seq };
}

function computeLucas(input) {
  function validate(val) {
    if (!val || val.trim() === "") return "INVALID: Input cannot be empty";
    if (val.includes(" ")) return "INVALID: Input cannot contain spaces";
    if (/[^0-9]/.test(val)) return "INVALID: Input must be a positive integer";
    if (val.startsWith("0"))
      return "INVALID: Input cannot be zero or have leading zeros";
    const n = parseInt(val);
    if (n <= 2) return "INVALID: Number of terms must be greater than 2";
    return null;
  }

  const err = validate(input);
  if (err) return { error: err };

  const n = parseInt(input);
  const seq = [2, 1];
  for (let i = 2; i < n; i++) {
    seq.push(seq[i - 1] + seq[i - 2]);
  }

  return { sequence: seq };
}
