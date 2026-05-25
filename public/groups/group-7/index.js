const state = {
    currentPage: 'home',
    activeStudy: null,
    sessionStart: Date.now()
};

// hide other pages logic instead of creating new pages for optimization
function showPage(pageId) {
    state.currentPage = pageId;
    const homePage = document.getElementById('home-page');
    const casePage = document.getElementById('case-studies-page');
    const navLinks = document.querySelectorAll('.nav-link');

    if (pageId === 'home') {
        homePage.style.display = 'block';
        casePage.style.display = 'none';
        document.getElementById('sys-state').textContent = 'IDLE';
        typewriter(document.querySelector('#home-page .header h1'), "YoRHa Analysis Unit");
    } else {
        homePage.style.display = 'none';
        casePage.style.display = 'block';
        document.getElementById('sys-state').textContent = 'ACTIVE';
        typewriter(document.querySelector('.section-label'), "Select logic module for execution");
    }

    navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.target === pageId);
    });
}

function showStudy(studyId) {
    state.activeStudy = studyId;
    state.currentPage = 'case-studies';
    document.getElementById('home-page').style.display = 'none';
    document.getElementById('case-studies-page').style.display = 'block';

    document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.classList.toggle('active', btn.id === `btn-${studyId}`);
    });

    document.getElementById('active-module').textContent = studyId.toUpperCase();
    document.getElementById('sys-state').textContent = 'EXECUTING';
    renderStudy(studyId);
    typewriter(document.getElementById('study-title'), STUDIES[studyId].title);
}


// typewriter effect i stole from codepen
function typewriter(element, text) {
    if (!element) return;
    element.textContent = '_';
    let newText = '';
    let i = 0;
    function loop() {
        if (i < text.length) {
            newText += text.charAt(i);
            element.textContent = newText;
            i++;
            setTimeout(loop, 40);
        }
    }
    loop();
}

// for each study, render the description and template
function renderStudy(studyId) {
    const titleEl = document.getElementById('study-title');
    const contentEl = document.getElementById('study-content');
    const study = STUDIES[studyId];
    if (!study) return;

    titleEl.textContent = study.title;
    contentEl.innerHTML = `
        <div class="module-description" style="margin-bottom: 3rem; padding-bottom: 2rem; border-bottom: 1px solid var(--yorha-brown-15);">
            <p class="result-info" style="font-style: italic; margin-bottom: 1.5rem;">// LOGIC_OVERVIEW: ${study.description}</p>
            <p class="text-muted-yorha" style="font-size: 1.4rem; line-height: 1.6;">${study.explanation}</p>
        </div>
        ${study.template}
    `;
}

// convert all my java code to js, thanks claude :3

const STUDIES = {
    palindrome: {
        title: "01_PALINDROME_CHECKER",
        description: "Sequence Symmetry Verification",
        explanation: "This module implements an optimized comparison algorithm. It uses two pointers—one starting at the beginning and one at the end—moving toward the center. It filters out non-alphanumeric characters (like spaces or symbols) and performs a case-insensitive check to determine if the sequence reads the same forwards and backwards.",
        template: `
            <div class="form-group">
                <label>Target String [ Analysis Required ]:</label>
                <input type="text" id="pal-input" class="form-input" placeholder="Input sequence...">
                <button class="btn-primary" onclick="STUDIES.palindrome.solve()">EXECUTE_PROC</button>
            </div>
            <div id="pal-result" class="result-area" style="padding:1.5rem; margin-top:2rem;">
                <p class="text-muted-yorha">// Awaiting data input...</p>
            </div>
        `,
        solve: function () {
            const raw = document.getElementById('pal-input').value;
            const input = raw.replace(/[^a-z0-9]/gi, '').toUpperCase();
            const resultArea = document.getElementById('pal-result');
            if (!input) { resultArea.innerHTML = '<p class="result-error">ERROR: NULL_INPUT</p>'; return; }

            let left = 0, right = input.length - 1;
            let isPalindrome = true;

            while (left < right) {
                let charL = input[left];
                let charR = input[right];

                if (charL.toUpperCase() !== charR.toUpperCase()) {
                    isPalindrome = false;
                    break;
                }
                left++;
                right--;
            }

            let out = isPalindrome ? `<p class="result-success">STATUS: SUCCESS [PALINDROME]</p>` : `<p class="result-error">STATUS: FAILURE [NON_PALINDROME]</p>`;
            out += `<p class="result-info">Sequence: ${raw}</p>`;
            resultArea.innerHTML = out;
        }
    },
    division: {
        title: "02_DIVISION_ALGORITHM",
        description: "Integer Division Theorem Implementation",
        explanation: "This module calculates the quotient (q) and remainder (r) for two positive integers (m and n) such that m = n(q) + r. The algorithm automatically designates the larger input as the dividend (m) to ensure a valid Euclidean division result.",
        template: `
        <div class="form-group">
            <label>Number 1 (m):</label>
            <input type="number" id="div-m" class="form-input" value="0">
        </div>
        <div class="form-group">
            <label>Number 2 (n):</label>
            <input type="number" id="div-n" class="form-input" value="0">
            <button class="btn-primary" onclick="STUDIES.division.solve()">CALCULATE</button>
        </div>
        <div id="div-result" class="result-area" style="padding:1.5rem; margin-top:2rem;"></div>
    `,
        solve: function () {
        let m = parseInt(document.getElementById('div-m').value);
        let n = parseInt(document.getElementById('div-n').value);
        const res = document.getElementById('div-result');
        if (m <= 0 || n <= 0) { res.innerHTML = '<p class="result-error">ERROR: POSITIVE_INTEGERS_REQUIRED</p>'; return; }
        if (n > m) { res.innerHTML = '<p class="result-error">ERROR: DIVISOR CANNOT BE GREATER THAN DIVIDEND</p>'; return; }
        const q = Math.floor(m / n), r = m % n;
        res.innerHTML = `<p class="result-success">${m} = ${n}(${q}) + ${r}</p><p class="result-info">Quotient: ${q} | Remainder: ${r}</p>`;
    }
    },
    euclidean: {
        title: "03_EUCLIDEAN_ALGORITHM",
        description: "GCD & LCM Recursive Reduction",
        explanation: "The Euclidean Algorithm finds the Greatest Common Divisor (GCD) of two integers by repeatedly applying the division theorem. The remainder of each step becomes the divisor for the next, until the remainder is zero. The Least Common Multiple (LCM) is then derived using the formula: (a * b) / GCD.",
        template: `
            <div class="form-group">
                <label>Int_01:</label>
                <input type="number" id="euc-m" class="form-input" value="0">
            </div>
            <div class="form-group">
                <label>Int_02:</label>
                <input type="number" id="euc-n" class="form-input" value="0">
                <button class="btn-primary" onclick="STUDIES.euclidean.solve()">RUN_ANALYSIS</button>
            </div>
            <div id="euc-result" class="result-area" style="padding:1.5rem; margin-top:2rem;"></div>
        `,
        solve: function () {
        let m = parseInt(document.getElementById('euc-m').value);
        let n = parseInt(document.getElementById('euc-n').value);
        const res = document.getElementById('euc-result');
        if (m <= 0 || n <= 0) { res.innerHTML = '<p class="result-error">ERROR: POSITIVE_INTEGERS_REQUIRED</p>'; return; }
        if (n > m) { res.innerHTML = '<p class="result-error">ERROR: DIVISOR CANNOT BE GREATER THAN DIVIDEND</p>'; return; }
        const oM = m, oN = n;
        let out = '';
        while (n !== 0) {
            const q = Math.floor(m / n), r = m % n;
            out += `<p class="result-info">${m} = ${n}(${q}) + ${r}</p>`;
            m = n; n = r;
        }
        const gcd = m, lcm = (oM * oN) / gcd;
        out += `<p class="result-success">GCD: ${gcd} | LCM: ${lcm}</p>`;
        res.innerHTML = out;
    }
    },
    collatz: {
        title: "04_COLLATZ_SEQUENCE",
        description: "3n + 1 Conjecture Verification",
        explanation: "Starting with a positive odd integer, this module generates a sequence where each term is derived from the previous: if the current number is odd, the next is 3n + 1; if even, it is n/2. The 'conjecture' is that the sequence will always eventually reach 1.",
        template: `
            <div class="form-group">
                <label>Initial Value [ ODD_INT ]:</label>
                <input type="number" id="col-input" class="form-input" value="1">
                <button class="btn-primary" onclick="STUDIES.collatz.solve()">GEN_SEQUENCE</button>
            </div>
            <div id="col-result" class="result-area" style="padding:1.5rem; margin-top:2rem;"></div>
        `,
        solve: function () {
            let n = parseInt(document.getElementById('col-input').value);
            const res = document.getElementById('col-result');
            if (n <= 0 || n % 2 === 0) { res.innerHTML = '<p class="result-error">ERROR: ODD_POSITIVE_REQUIRED</p>'; return; }
            let seq = [n];
            while (n !== 1) {
                n = (n % 2 !== 0) ? (n * 3 + 1) : (n / 2);
                seq.push(n);
            }
            res.innerHTML = `<p class="result-success">Sequence Length: ${seq.length}</p><p class="result-info"><span>${seq.join('</span>, <span>')}</span></p>`;
        }
    },
    recursions: {
        title: "05_RECURSIVE_SEQUENCE",
        description: "Mathematical Sequence Generation",
        explanation: "This module generates terms for three fundamental recursive sequences: Fibonacci (0, 1, 1, 2...), Lucas (2, 1, 3, 4...), and Tribonacci (0, 0, 1, 1...). Each sequence uses a specific set of initial values and a summation rule where the next term is the sum of the preceding 2 or 3 terms.",
        template: `
            <div class="form-group" style="display:flex; gap:1rem; margin-bottom:2rem;">
                <button class="btn-primary" style="margin:0" onclick="STUDIES.recursions.setMode('fibonacci')">Fibonacci</button>
                <button class="btn-primary" style="margin:0" onclick="STUDIES.recursions.setMode('lucas')">Lucas</button>
                <button class="btn-primary" style="margin:0" onclick="STUDIES.recursions.setMode('tribonacci')">Tribonacci</button>
            </div>
            <div class="form-group">
                <label id="rec-label">Target Terms [ Fibonacci ]:</label>
                <input type="number" id="rec-terms" class="form-input" value="10">
                <button class="btn-primary" onclick="STUDIES.recursions.solve()">RUN_RECURSION</button>
            </div>
            <div id="rec-result" class="result-area" style="padding:1.5rem; margin-top:2rem;"></div>
        `,
        mode: 'fibonacci',
        setMode: function (m) { this.mode = m; document.getElementById('rec-label').textContent = `Target Terms [ ${m.charAt(0).toUpperCase() + m.slice(1)} ]:`; },
        solve: function () {
        let terms = parseInt(document.getElementById('rec-terms').value);
        const res = document.getElementById('rec-result');
        
        const minTerms = (this.mode === 'tribonacci') ? 4 : 3;
        if (terms < minTerms) { 
            res.innerHTML = `<p class="result-error">ERROR: MINIMUM ${minTerms} TERMS REQUIRED FOR ${this.mode.toUpperCase()}</p>`; 
            return; 
        }

        let seq = [];
        if (this.mode === 'fibonacci') {
            let a = 0, b = 1;
            for (let i = 0; i < terms + 2; i++) { seq.push(a); [a, b] = [b, a + b]; }
            seq = seq.slice(2);
        } else if (this.mode === 'lucas') {
            let a = 2, b = 1;
            for (let i = 0; i < terms + 2; i++) { seq.push(a); [a, b] = [b, a + b]; }
            seq = seq.slice(2);
        } else if (this.mode === 'tribonacci') {
            let a = 0, b = 0, c = 1;
            for (let i = 0; i < terms + 3; i++) { seq.push(a); [a, b, c] = [b, c, a + b + c]; }
            seq = seq.slice(3);
        }
        res.innerHTML = `<p class="result-success">${this.mode.toUpperCase()} Output:</p><p class="result-info"><span>${seq.join('</span>, <span>')}</span></p>`;
    }
    }
};

window.onload = () => {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => { e.preventDefault(); showPage(link.dataset.target); });
    });
    showPage('home');
    setInterval(() => {
        const diff = Date.now() - state.sessionStart;
        document.querySelector('.statusbar span:last-child').textContent = `${(diff / 1000).toFixed(2)}s`;
    }, 100);
};
