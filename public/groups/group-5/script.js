// Clock
function updateClock() {
  const now = new Date();
  document.getElementById("clock").textContent = now.toTimeString().slice(0, 8);
}
setInterval(updateClock, 1000);
updateClock();

// State
let currentModule = "";

const moduleMetaData = {
  Palindrome: {
    title: "Palindrome Checker",
    tag: "// MODULE 01",
    desc: "Accepts a string literal, computes length variables, and screens characters backwards and forwards to identify exact reflection validation.",
    inputs:
      '<label class="input-label">▸ ENTER STRING VALUE</label><input type="text" id="strInput" placeholder="e.g. Racecar">',
  },
  Division: {
    title: "Division Algorithm",
    tag: "// MODULE 02",
    desc: "Accepts two positive integers. Auto-maps the larger as dividend (m) and smaller as divisor (n) to solve: m = nq + r.",
    inputs:
      '<label class="input-label">▸ FIRST INTEGER</label><input type="number" id="divNum1" placeholder="e.g. 21"><label class="input-label">▸ SECOND INTEGER</label><input type="number" id="divNum2" placeholder="e.g. 4">',
  },
  Euclidean: {
    title: "Euclidean & LCM Algorithm",
    tag: "// MODULE 03",
    desc: "Iterates the Division Algorithm tracking remainders recursively until zero state occurs. Employs: LCM(m,n) = (m×n) / GCD(m,n).",
    inputs:
      '<label class="input-label">▸ FIRST INTEGER</label><input type="number" id="eucNum1" placeholder="e.g. 13"><label class="input-label">▸ SECOND INTEGER</label><input type="number" id="eucNum2" placeholder="e.g. 8">',
  },
  Collatz: {
    title: "Collatz Sequence Finder",
    tag: "// MODULE 04",
    desc: "Generates iterative sequences using 3n + 1 step structures. WARNING: INITIAL VALUE MUST BE A POSITIVE ODD INTEGER.",
    inputs:
      '<label class="input-label">▸ INITIALIZE VALUE (ODD INTEGER)</label><input type="number" id="colInput" placeholder="e.g. 13">',
  },
  Fibonacci: {
    title: "Fibonacci Generator",
    tag: "// MODULE 05-A",
    desc: "Each number is the sum of the two preceding ones, starting from 0 and 1. Valid input must be greater than 2.",
    inputs:
      '<label class="input-label">▸ NUMBER OF TERMS</label><input type="number" id="recInput" placeholder="e.g. 7">',
  },
  Lucas: {
    title: "Lucas Generator",
    tag: "// MODULE 05-B",
    desc: "Similar to Fibonacci architecture but utilizes seed points starting with 2 and 1. Valid input must be greater than 2.",
    inputs:
      '<label class="input-label">▸ NUMBER OF TERMS</label><input type="number" id="recInput" placeholder="e.g. 7">',
  },
  Tribonacci: {
    title: "Tribonacci Generator",
    tag: "// MODULE 05-C",
    desc: "Each step uses the sum of the three preceding digits, initialized at 0, 0, and 1. Valid input must be greater than 3.",
    inputs:
      '<label class="input-label">▸ NUMBER OF TERMS</label><input type="number" id="recInput" placeholder="e.g. 7">',
  },
};

function showPage(id) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function switchView(showId, hideId) {
  showPage(showId);
}

function openModule(moduleKey) {
  currentModule = moduleKey;
  const meta = moduleMetaData[moduleKey];

  if (moduleKey === "Recursion") {
    showPage("recursionMenu");
    return;
  }

  document.getElementById("wsTag").textContent = meta.tag;
  document.getElementById("wsTitle").textContent = meta.title;
  document.getElementById("wsDesc").textContent = meta.desc;
  document.getElementById("inputContainer").innerHTML = meta.inputs;

  const out = document.getElementById("output");
  out.innerHTML = '<div class="output-header">// OUTPUT STREAM</div>';
  out.classList.remove("has-content");

  showPage("workspace");
}

function exitWorkspace() {
  if (["Fibonacci", "Lucas", "Tribonacci"].includes(currentModule)) {
    showPage("recursionMenu");
  } else {
    showPage("mainMenu");
  }
}

function executeModule() {
  const output = document.getElementById("output");
  output.innerHTML = '<div class="output-header">// OUTPUT STREAM</div>';
  output.classList.add("has-content");

  switch (currentModule) {
    case "Palindrome":
      runPalindrome(output);
      break;
    case "Division":
      runDivision(output);
      break;
    case "Euclidean":
      runEuclidean(output);
      break;
    case "Collatz":
      runCollatz(output);
      break;
    case "Fibonacci":
    case "Lucas":
    case "Tribonacci":
      runRecursion(output);
      break;
  }
}

function runPalindrome(output) {
  const str = document.getElementById("strInput").value;
  if (!str || str.trim() === "") {
    output.innerHTML +=
      "<span class='error'>⚠ INVALID INPUT — String cannot be empty</span>";
    return;
  }
  const sanitized = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  const reversed = sanitized.split("").reverse().join("");
  const isPalindrome = sanitized === reversed;

  let html = `<span class='success'>STRING RECORDED:</span> "${str}"<br>`;
  html += `<span style="color:rgba(255,255,255,0.5)">LENGTH →</span> ${str.length.toLocaleString()}<br><br>`;
  if (isPalindrome) {
    html += `<span class='success'>▶ RESULT: THE STRING IS A PALINDROME.</span>`;
  } else {
    html += `<span class='error'>▶ RESULT: THE STRING IS NOT A PALINDROME.</span>`;
  }
  output.innerHTML += html;
}

function runDivision(output) {
  const val1 = parseInt(document.getElementById("divNum1").value);
  const val2 = parseInt(document.getElementById("divNum2").value);
  if (isNaN(val1) || isNaN(val2) || val1 <= 0 || val2 <= 0) {
    output.innerHTML +=
      "<span class='error'>⚠ INVALID INPUT — Inputs must be positive integers > 0</span>";
    return;
  }
  const m = Math.max(val1, val2),
    n = Math.min(val1, val2);
  const q = Math.floor(m / n),
    r = m % n;
  let html = `<span class='success'>SOLUTION:</span><br>`;
  html += `<span class="step-line">${m} = ${n}(${q}) + ${r}</span><br>`;
  html += `<span style="color:rgba(255,255,255,0.5)">DIVIDEND →</span> ${m.toLocaleString()}<br>`;
  html += `<span style="color:rgba(255,255,255,0.5)">DIVISOR  →</span> ${n.toLocaleString()}<br>`;
  html += `<span style="color:rgba(255,255,255,0.5)">QUOTIENT →</span> ${q.toLocaleString()} &nbsp; <span style="color:rgba(255,255,255,0.5)">REMAINDER →</span> ${r.toLocaleString()}`;
  output.innerHTML += html;
}

function runEuclidean(output) {
  const val1 = parseInt(document.getElementById("eucNum1").value);
  const val2 = parseInt(document.getElementById("eucNum2").value);
  if (isNaN(val1) || isNaN(val2) || val1 <= 0 || val2 <= 0) {
    output.innerHTML +=
      "<span class='error'>⚠ INVALID INPUT — Inputs must be positive integers > 0</span>";
    return;
  }
  let m = Math.max(val1, val2),
    n = Math.min(val1, val2);
  const iM = m,
    iN = n;
  let html = `<span class='success'>ITERATION LOG:</span><br>`;
  let gcd = 1;
  while (n !== 0) {
    let q = Math.floor(m / n),
      r = m % n;
    if (r === 0) {
      html += `<div class='step-line'>${m} = ${n}(${q})</div>`;
      gcd = n;
      break;
    } else {
      html += `<div class='step-line'>${m} = ${n}(${q}) + ${r}</div>`;
    }
    m = n;
    n = r;
  }
  const lcm = (iM * iN) / gcd;
  html += `<br><span style="color:rgba(255,255,255,0.5)">INTEGERS →</span> ${iM}, ${iN}<br>`;
  html += `<span style="color:rgba(255,255,255,0.5)">GCD →</span> <span class="success">${gcd.toLocaleString()}</span><br>`;
  html += `<span style="color:rgba(255,255,255,0.5)">LCM →</span> <span class="success">${lcm.toLocaleString()}</span>`;
  output.innerHTML += html;
}

function runCollatz(output) {
  const num = parseInt(document.getElementById("colInput").value);
  if (isNaN(num) || num <= 0 || num % 2 === 0) {
    output.innerHTML +=
      "<span class='error'>⚠ INVALID INPUT — Must be a positive odd integer</span>";
    return;
  }
  let curr = num,
    seq = [];
  while (curr !== 1) {
    seq.push(curr);
    curr = curr % 2 === 0 ? curr / 2 : curr * 3 + 1;
  }
  seq.push(1);
  output.innerHTML += `<span class='success'>SEQUENCE GENERATED:</span>
                       <br>
                       <span style="color:rgba(255,255,255,0.75);word-break:keep-all">${seq.join(", ")}</span>
                       <br><br>
                       <span style="color:rgba(255,255,255,0.4)">TOTAL STEPS → ${seq.length.toLocaleString()}</span>`;
}

function runRecursion(output) {
  const num = parseInt(document.getElementById("recInput").value);
  const minVal = currentModule === "Tribonacci" ? 3 : 2;
  if (isNaN(num) || num <= minVal) {
    output.innerHTML += `<span class='error'>⚠ INVALID INPUT — Must be > ${minVal}</span>`;
    return;
  }
  let result = [];
  if (currentModule === "Fibonacci") {
    result = [0, 1];
    for (let i = 2; i < num; i++) result.push(result[i - 1] + result[i - 2]);
  } else if (currentModule === "Lucas") {
    result = [2, 1];
    for (let i = 2; i < num; i++) result.push(result[i - 1] + result[i - 2]);
  } else {
    result = [0, 0, 1];
    for (let i = 3; i < num; i++)
      result.push(result[i - 1] + result[i - 2] + result[i - 3]);
  }
  output.innerHTML += `<span class='success'>${currentModule.toUpperCase()} SEQUENCE:</span>
                       <br>
                       <span style="color:rgba(255,255,255,0.75);word-break:keep-all">${result.join(", ")}</span>
                       <br><br>
                       <span style="color:rgba(255,255,255,0.4)">TERMS GENERATED → ${result.length.toLocaleString()}</span>`;
}