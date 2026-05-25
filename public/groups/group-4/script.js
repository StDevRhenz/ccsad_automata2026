
// --- Constants ---
const SEQUENCES = {
  fibonacci: {
    id: 'fibonacci',
    name: 'Fibonacci numbers',
    discussion: 'A number of terms of the sequence a1, a2, ..., an are given. These are the initial values. A rule called the recursion is given, which explains how an is to be computed in terms of previous terms in the sequence.',
    formula: 'Fn = Fn-1 + Fn-2',
    initialValues: [0, 1],
    minTerms: 2
  },
  lucas: {
    id: 'lucas',
    name: 'Lucas numbers',
    discussion: 'The Lucas numbers Ln have the initial values L0 = 2, L1 = 1. The recursion is Ln = Ln-1 + Ln-2 if n >= 2.',
    formula: 'Ln = Ln-1 + Ln-2',
    initialValues: [2, 1],
    minTerms: 2
  },
  tribonacci: {
    id: 'tribonacci',
    name: 'Tribonacci numbers',
    discussion: 'The Tribonacci numbers Tn have the initial values T0 = 0, T1 = 0, T2 = 1. The recursion is Tn = Tn-1 + Tn-2 + Tn-3 if n >= 3.',
    formula: 'Tn = Tn-1 + Tn-2 + Tn-3',
    initialValues: [0, 0, 1],
    minTerms: 3
  }
};

const CASE_STUDIES = {
  palindrome: {
    id: 'palindrome',
    name: 'Palindrome Checker',
    discussion: 'A palindrome is a word, phrase, number, or other sequence of characters that reads the same forward and backward, ignoring spaces, punctuation, and capitalization.',
  },
  'division-algorithm': {
    id: 'division-algorithm',
    name: 'Division Algorithm',
    discussion: 'The Division Algorithm states that for any two integers a and b (b > 0), there exist unique integers q and r such that a = bq + r, where 0 <= r < b.',
    formula: 'a = b(q) + r'
  },
  euclidean: {
    id: 'euclidean',
    name: 'Euclidean Algorithm (GCD & LCM)',
    discussion: 'The Euclidean Algorithm is an efficient method for computing the greatest common divisor (GCD) of two integers. The Least Common Multiple (LCM) can then be found using the relationship: LCM(a, b) = |a x b| / GCD(a, b).',
    formula: 'GCD(a, b) & LCM(a, b)'
  },
  collatz: {
    id: 'collatz',
    name: 'Collatz Sequence',
    discussion: 'The Collatz conjecture is a conjecture in mathematics that concerns a sequence defined as follows: start with any positive integer n. Then each term is obtained from the previous term as follows: if the previous term is even, the next term is one half of the previous term. If the previous term is odd, the next term is 3 times the previous term plus 1. The conjecture is that no matter what value of n, the sequence will always reach 1.',
    formula: 'n ÷ 2 (even), 3 x n + 1 (odd)'
  }
};

// --- State ---
let currentView = 'menu';
let selectedActivity = null;
let inputValue = '';
let inputBValue = '';
let typingInterval = null;

// --- Utilities ---
const formatNumber = (num) => String(num);

const checkPalindrome = (input) => {
  const cleanInput = input.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const reversed = cleanInput.split('').reverse().join('');
  return {
    isPalindrome: cleanInput === reversed && cleanInput.length > 0,
    cleanInput,
    reversed
  };
};

const runDivisionAlgorithm = (a, b) => {
  const dividend = Math.max(a, b);
  const divisor = Math.min(a, b);
  const quotient = Math.floor(dividend / divisor);
  const remainder = dividend % divisor;
  return { dividend, divisor, quotient, remainder };
};

const runEuclideanAlgorithm = (a, b) => {
  let x = Math.max(a, b);
  let y = Math.min(a, b);
  const steps = [];

  while (y !== 0) {
    const q = Math.floor(x / y);
    const r = x % y;
    steps.push({ dividend: x, divisor: y, quotient: q, remainder: r });
    x = y;
    y = r;
  }

  const gcd = x;
  const lcm = (a * b) / gcd;
  return { steps, gcd, lcm };
};

const generateCollatz = (n) => {
  const sequence = [n];
  let current = n;
  while (current > 1 && sequence.length < 1000) {
    if (current % 2 === 0) {
      current = current / 2;
    } else {
      current = 3 * current + 1;
    }
    sequence.push(current);
  }
  return sequence;
};

const generateSequence = (config, input) => {
  const termsCount = parseFloat(input);
  
  if (isNaN(termsCount)) {
    return { terms: [], status: 'Invalid: Too Few', message: 'Input is not a number.' };
  }

  if (termsCount < 0) {
    return { terms: [], status: 'Invalid: Negative', message: 'Negative terms are not allowed.' };
  }

  if (!Number.isInteger(termsCount)) {
    return { terms: [], status: 'Invalid: Fractional', message: 'Please enter a whole number.' };
  }

  if (termsCount <= config.minTerms) {
    return { 
      terms: [], 
      status: 'Invalid: Too Few', 
      message: `Input ${termsCount} is too low. ${config.name} require more than ${config.minTerms} terms.` 
    };
  }
  
  const result = [...config.initialValues];
  
  for (let i = result.length; i < termsCount; i++) {
    if (config.id === 'tribonacci') {
      result.push(result[i - 1] + result[i - 2] + result[i - 3]);
    } else {
      result.push(result[i - 1] + result[i - 2]);
    }
  }
  
  return { terms: result, status: 'Valid', message: 'Sequence generated successfully.' };
};

// --- Matrix Rain ---
const initMatrixRain = () => {
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%&@#'.split('');
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];

    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }

    const draw = () => {
        ctx.fillStyle = 'rgba(10, 10, 12, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#ff66b2';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = characters[Math.floor(Math.random() * characters.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    };

    setInterval(draw, 33);

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
};

// --- UI Actions ---
const showMenu = () => {
    currentView = 'menu';
    document.getElementById('menu-view').style.display = 'flex';
    document.getElementById('activity-view').style.display = 'none';
};

const selectActivity = (type) => {
    selectedActivity = type;
    inputValue = '';
    inputBValue = '';
    currentView = 'activity';
    
    document.getElementById('menu-view').style.display = 'none';
    document.getElementById('activity-view').style.display = 'block';
    
    const config = SEQUENCES[type] || CASE_STUDIES[type];
    document.getElementById('activity-title').innerText = config.name;
    
    // Image
    const imgContainer = document.getElementById('activity-image-container');
    if (SEQUENCES[type]) {
        imgContainer.innerHTML = `<img src="public/${config.id}-discussion.png" alt="${config.name} Discussion">`;
        imgContainer.style.display = 'block';
    } else {
        imgContainer.innerHTML = '';
        imgContainer.style.display = 'none';
    }
    
    // Discussion Typing Effect
    const discussionEl = document.getElementById('activity-discussion');
    discussionEl.innerText = '';
    if (typingInterval) clearInterval(typingInterval);
    
    // Show Formula if available, else Discussion
    // Special case for Euclidean: show description instead of formula
    const textToType = (type === 'euclidean') ? config.discussion : (config.formula || config.discussion);
    const labelEl = document.querySelector('.discussion p strong');
    if (labelEl) {
        labelEl.innerText = (type === 'euclidean' || !config.formula) ? 'Description:' : 'Formula:';
    }

    let i = 0;
    typingInterval = setInterval(() => {
        discussionEl.innerText += textToType.charAt(i);
        i++;
        if (i >= textToType.length) clearInterval(typingInterval);
    }, 20);
    
    // Inputs
    renderInputs();
    renderResults();
};

const renderInputs = () => {
    const inputSection = document.getElementById('input-section');
    inputSection.innerHTML = '';
    
    if (selectedActivity === 'division-algorithm' || selectedActivity === 'euclidean') {
        inputSection.innerHTML = `
            <div class="input-group">
                <label>First Integer (a): </label>
                <input type="number" id="input-a" placeholder="e.g. 48" oninput="handleInput(event, 'a')">
            </div>
            <div class="input-group">
                <label>Second Integer (b): </label>
                <input type="number" id="input-b" placeholder="e.g. 18" oninput="handleInput(event, 'b')">
            </div>
        `;
    } else {
        const isPalindrome = selectedActivity === 'palindrome';
        const isSequence = !!SEQUENCES[selectedActivity];
        const labelText = isPalindrome ? 'Input Text: ' : (isSequence ? 'Input number of terms: ' : 'Input Number: ');
        
        inputSection.innerHTML = `
            <div class="input-group">
                <label>${labelText}</label>
                <input type="${isPalindrome ? 'text' : 'number'}" id="input-main" placeholder="${isPalindrome ? 'e.g. racecar' : 'e.g. 5'}" oninput="handleInput(event, 'main')">
            </div>
        `;
    }
};

const handleInput = (event, type) => {
    if (type === 'main' || type === 'a') {
        inputValue = event.target.value;
    } else if (type === 'b') {
        inputBValue = event.target.value;
    }
    
    renderResults();
};

const renderResults = () => {
    const resultsArea = document.getElementById('results-area');
    const warningContainer = document.getElementById('warning-container');
    const errorMessage = document.getElementById('error-message');
    
    resultsArea.innerHTML = '';
    warningContainer.style.display = 'none';
    
    if (!inputValue && !inputBValue) return;

    // Warning logic
    let warning = null;
    
    // Check for decimals in numeric inputs
    const isDecimal = (val) => val && val.includes('.') && !isNaN(parseFloat(val));

    if (SEQUENCES[selectedActivity]) {
        if (isDecimal(inputValue)) {
            warning = 'Please enter a whole number.';
        } else {
            const res = generateSequence(SEQUENCES[selectedActivity], inputValue);
            if (res.status !== 'Valid' && inputValue) warning = res.message;
        }
    } else if (selectedActivity === 'division-algorithm' || selectedActivity === 'euclidean') {
        if (isDecimal(inputValue) || isDecimal(inputBValue)) {
            warning = 'Both inputs must be whole numbers (integers).';
        } else {
            const a = parseInt(inputValue);
            const b = parseInt(inputBValue);
            
            if (inputValue && isNaN(a)) warning = 'First integer (a) must be a numeric value.';
            else if (inputBValue && isNaN(b)) warning = 'Second integer (b) must be a numeric value.';
            else if (inputValue && !isNaN(a) && a <= 0) warning = 'First integer (a) must be a positive number (greater than 0).';
            else if (inputBValue && !isNaN(b) && b <= 0) warning = 'Second integer (b) must be a positive number (greater than 0).';
        }
    } else if (selectedActivity === 'collatz') {
        if (isDecimal(inputValue)) {
            warning = 'Please enter a numeric integer.';
        } else {
            const n = parseInt(inputValue);
            if (inputValue && isNaN(n)) warning = 'Please enter a numeric integer.';
            else if (inputValue && !isNaN(n) && n <= 0) warning = 'Collatz sequence requires a positive integer.';
            else if (inputValue && !isNaN(n) && n % 2 === 0) warning = 'The system doesn\'t take positive even integers since it\'s a rule set needed to be added.';
        }
    }

    if (warning) {
        warningContainer.style.display = 'block';
        errorMessage.innerText = '⚠️ ' + warning;
        return;
    }

    // Results rendering
    if (SEQUENCES[selectedActivity]) {
        const res = generateSequence(SEQUENCES[selectedActivity], inputValue);
        if (res.status === 'Valid' && res.terms.length > 0) {
            resultsArea.innerHTML = `
                <div class="results-list">
                    <p>The ${SEQUENCES[selectedActivity].name} are: </p>
                    <div class="scrollable-results">
                        ${res.terms.map(formatNumber).join(', ')}
                    </div>
                </div>
            `;
        }
    } else if (selectedActivity === 'palindrome') {
        if (!inputValue.trim()) return;
        const res = checkPalindrome(inputValue);
        resultsArea.innerHTML = `
            <div class="palindrome-result">
                <p>Cleaned: <strong>${res.cleanInput}</strong></p>
                <p>Reversed: <strong>${res.reversed}</strong></p>
                <p class="${res.isPalindrome ? 'success' : 'error'}">
                    ${res.isPalindrome ? '✅ VALID PALINDROME DETECTED' : '❌ NOT A PALINDROME'}
                </p>
            </div>
        `;
    } else if (selectedActivity === 'division-algorithm' || selectedActivity === 'euclidean') {
        const a = parseInt(inputValue);
        const b = parseInt(inputBValue);
        
        if (!isNaN(a) && !isNaN(b)) {
            if (selectedActivity === 'division-algorithm') {
                const res = runDivisionAlgorithm(a, b);
                resultsArea.innerHTML = `
                    <div class="division-results">
                        <p><strong>Solution:</strong></p>
                        <p class="formula-box">
                            ${formatNumber(res.dividend)} = ${formatNumber(res.divisor)}(${formatNumber(res.quotient)}) + ${formatNumber(res.remainder)}
                        </p>
                        <div class="details-box">
                            <p>The dividend is ${formatNumber(res.dividend)}</p>
                            <p>The divisor is ${formatNumber(res.divisor)}</p>
                            <p>The quotient is ${formatNumber(res.quotient)} and the remainder is ${formatNumber(res.remainder)}</p>
                        </div>
                    </div>
                `;
            } else {
                const res = runEuclideanAlgorithm(a, b);
                resultsArea.innerHTML = `
                    <div class="division-results">
                        <h3>Iteration Steps:</h3>
                        <ul class="steps-list">
                            ${res.steps.map(s => `
                                <li>
                                    ${formatNumber(s.dividend)} = ${formatNumber(s.divisor)}(${formatNumber(s.quotient)}) + ${formatNumber(s.remainder)}
                                </li>
                            `).join('')}
                        </ul>
                        <div class="summary-box">
                            <p><strong>GCD:</strong> ${formatNumber(res.gcd)}</p>
                            <p><strong>LCM:</strong> ${formatNumber(res.lcm)}</p>
                        </div>
                    </div>
                `;
            }
        }
    } else if (selectedActivity === 'collatz') {
        const n = parseInt(inputValue);
        if (!isNaN(n)) {
            const seq = generateCollatz(n);
            resultsArea.innerHTML = `
                <div class="results-list">
                    <p>The Collatz sequence for ${formatNumber(n)} is:</p>
                    <div class="scrollable-results">
                        ${seq.map(formatNumber).join(', ')}
                    </div>
                </div>
            `;
        }
    }
};

const exitSystem = () => {
    window.open('', '_self', ''); 
    window.close();
    // Fallback for browsers that block script-initiated closing
    setTimeout(() => {
        alert("SYSTEM SHUTDOWN INITIATED: Please close this tab manually to complete the process.");
    }, 200);
};

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
    initMatrixRain();
});
