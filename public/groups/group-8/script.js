(function () {

  const MAX_TERMS = 500;

  function fmt(n) {
    return n.toLocaleString('en-US');
  }

  const fibMemo   = new Map([[0, 0n], [1, 1n]]);
  const lucasMemo = new Map([[0, 2n], [1, 1n]]);
  const tribMemo  = new Map([[0, 0n], [1, 0n], [2, 1n]]);

  function warmMemo(memo, recFn, upTo) {
    const highestCached = Math.max(...memo.keys());
    for (let i = highestCached + 1; i <= upTo; i++) {
      recFn(i);
    }
  }

  function fibonacci(n) {
    if (fibMemo.has(n)) return fibMemo.get(n);
    const v = fibonacci(n - 1) + fibonacci(n - 2);
    fibMemo.set(n, v);
    return v;
  }

  function lucas(n) {
    if (lucasMemo.has(n)) return lucasMemo.get(n);
    const v = lucas(n - 1) + lucas(n - 2);
    lucasMemo.set(n, v);
    return v;
  }

  function tribonacci(n) {
    if (tribMemo.has(n)) return tribMemo.get(n);
    const v = tribonacci(n - 1) + tribonacci(n - 2) + tribonacci(n - 3);
    tribMemo.set(n, v);
    return v;
  }

  function buildTerms(memo, recFn, count) {
    warmMemo(memo, recFn, count - 1);
    const terms = [];
    for (let i = 0; i < count; i++) terms.push(String(recFn(i)));
    return terms;
  }

  function computeDivision(num1, num2) {
    let m, n;
    if (num1 > num2) { m = num1; n = num2; }
    else { m = num2; n = num1; }

    let q = 0;
    let remaining = m;
    while (remaining >= n) {
      remaining = remaining - n;
      q = q + 1;
    }
    const r = remaining;

    const lines = [];
    lines.push('SOLUTION: ' + fmt(m) + ' = ' + fmt(n) + ' (' + fmt(q) + ') + ' + fmt(r));
    lines.push('The dividend is ' + fmt(m));
    lines.push('The divisor is ' + fmt(n));
    lines.push('The quotient is ' + fmt(q) + ' and the remainder is ' + fmt(r));
    return lines;
  }

  function computeEuclidean(num1, num2) {
    let m, n;
    if (num1 > num2) { m = num1; n = num2; }
    else { m = num2; n = num1; }

    const originalM = m;
    const originalN = n;
    const lines = [];
    lines.push('SOLUTION:');

    let gcd = 0;
    while (true) {
      let q = 0;
      let remaining = m;
      while (remaining >= n) {
        remaining = remaining - n;
        q = q + 1;
      }
      const r = remaining;

      if (r === 0) {
        lines.push(fmt(m) + ' = ' + fmt(n) + ' (' + fmt(q) + ')');
        gcd = n;
        break;
      } else {
        lines.push(fmt(m) + ' = ' + fmt(n) + ' (' + fmt(q) + ') + ' + fmt(r));
        m = n;
        n = r;
      }
    }

    const product = originalM * originalN;
    const lcm = product / gcd;

    lines.push('');
    lines.push('The integers are ' + fmt(originalM) + ' and ' + fmt(originalN));
    lines.push('The GCD of ' + fmt(originalM) + ' and ' + fmt(originalN) + ' is ' + fmt(gcd));
    lines.push('The LCM of ' + fmt(originalM) + ' and ' + fmt(originalN) + ' is ' + fmt(lcm));
    return lines;
  }

  function computeCollatz(n) {
    const sequence = [];
    let current = n;
    let truncated = false;
    while (current !== 1) {
      sequence.push(current);
      if (current % 2 !== 0) {
        current = 3 * current + 1;
      } else {
        current = current / 2;
      }
      if (sequence.length > 10000) {
        sequence.push('...(truncated)');
        truncated = true;
        break;
      }
    }
    if (!truncated) {
      sequence.push(1);
    }
    return sequence;
  }

  const screens = {
    main:       document.getElementById('screen-main'),
    fibonacci:  document.getElementById('screen-fibonacci'),
    lucas:      document.getElementById('screen-lucas'),
    tribonacci: document.getElementById('screen-tribonacci'),
    division:   document.getElementById('screen-division'),
    euclidean:  document.getElementById('screen-euclidean'),
    collatz:    document.getElementById('screen-collatz'),
  };

  let currentScreen = 'main';

  function navigateTo(target) {
    if (target === currentScreen) return;

    if (target === 'main') {
      clearSequenceState('fib');
      clearSequenceState('lucas');
      clearSequenceState('trib');
      clearAlgoState('div');
      clearAlgoState('euc');
      clearAlgoState('col');
    }

    const outgoing = screens[currentScreen];
    const incoming = screens[target];

    outgoing.classList.remove('group08-screen--active');
    currentScreen = target;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        incoming.classList.add('group08-screen--active');
        lucide.createIcons();
      });
    });
  }

  function showError(errorEl, errorTextEl, inputEl, message) {
    errorTextEl.textContent = message;
    errorEl.classList.add('group08-error-msg--visible');
    inputEl.classList.add('group08-input-field--error');
    errorEl.style.animation = 'none';
    void errorEl.offsetWidth;
    errorEl.style.animation = '';
  }

  function clearError(errorEl, inputEl) {
    errorEl.classList.remove('group08-error-msg--visible');
    inputEl.classList.remove('group08-input-field--error');
  }

  function showResult(resultZoneEl, resultListEl, resultMetaEl, terms) {
    resultListEl.textContent = terms.join(', ');
    resultMetaEl.textContent = terms.length + ' terms';
    resultZoneEl.classList.add('group08-result-zone--visible');
  }

  function showResultLines(resultZoneEl, resultListEl, resultMetaEl, lines, metaText) {
    resultListEl.textContent = '';
    lines.forEach(function(l) {
      const div = document.createElement('div');
      div.textContent = l;
      if (l === '') div.style.height = '8px';
      resultListEl.appendChild(div);
    });
    resultMetaEl.textContent = metaText || '';
    resultZoneEl.classList.add('group08-result-zone--visible');
  }

  function clearSequenceState(prefix) {
    const input      = document.getElementById(prefix + '-input');
    const error      = document.getElementById(prefix + '-error');
    const resultZone = document.getElementById(prefix + '-result-zone');
    const resultList = document.getElementById(prefix + '-result-list');
    const resultMeta = document.getElementById(prefix + '-result-meta');

    if (input)      { input.value = ''; input.classList.remove('group08-input-field--error'); }
    if (error)        error.classList.remove('group08-error-msg--visible');
    if (resultList) { resultList.textContent = ''; resultList.scrollTop = 0; }
    if (resultMeta)   resultMeta.textContent = '';
    if (resultZone)   resultZone.classList.remove('group08-result-zone--visible');
  }

  function clearAlgoState(prefix) {
    const input1     = document.getElementById(prefix + '-input1');
    const input2     = document.getElementById(prefix + '-input2');
    const input      = document.getElementById(prefix + '-input');
    const error      = document.getElementById(prefix + '-error');
    const resultZone = document.getElementById(prefix + '-result-zone');
    const resultList = document.getElementById(prefix + '-result-list');
    const resultMeta = document.getElementById(prefix + '-result-meta');

    if (input1) { input1.value = ''; input1.classList.remove('group08-input-field--error'); }
    if (input2) { input2.value = ''; input2.classList.remove('group08-input-field--error'); }
    if (input)  { input.value = '';  input.classList.remove('group08-input-field--error'); }
    if (error)    error.classList.remove('group08-error-msg--visible');
    if (resultList) { resultList.innerHTML = ''; resultList.scrollTop = 0; }
    if (resultMeta)   resultMeta.textContent = '';
    if (resultZone)   resultZone.classList.remove('group08-result-zone--visible');
  }

  document.querySelectorAll('.group08-menu-card').forEach(function (card) {
    function activate() {
      const target = card.dataset.target;
      if (target === 'exit') showExitOverlay();
      else navigateTo(target);
    }
    card.addEventListener('click', activate);
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
    });
  });

  document.querySelectorAll('.group08-sub-back').forEach(function (btn) {
    btn.addEventListener('click', function () { navigateTo('main'); });
  });

  const sequenceConfigs = [
    { prefix: 'fib',   memo: fibMemo,   recFn: fibonacci,  minN: 2, label: 'Fibonacci'  },
    { prefix: 'lucas', memo: lucasMemo, recFn: lucas,      minN: 2, label: 'Lucas'      },
    { prefix: 'trib',  memo: tribMemo,  recFn: tribonacci, minN: 3, label: 'Tribonacci' },
  ];

  sequenceConfigs.forEach(function (cfg) {
    const p          = cfg.prefix;
    const input      = document.getElementById(p + '-input');
    const error      = document.getElementById(p + '-error');
    const errorText  = document.getElementById(p + '-error-text');
    const computeBtn = document.getElementById(p + '-compute-btn');
    const refreshBtn = document.getElementById(p + '-refresh-btn');
    const resultZone = document.getElementById(p + '-result-zone');
    const resultList = document.getElementById(p + '-result-list');
    const resultMeta = document.getElementById(p + '-result-meta');

    input.addEventListener('input', () => clearError(error, input));
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') computeBtn.click(); });

    computeBtn.addEventListener('click', function () {
      const raw = input.value.trim();
      const n   = Number(raw);

      if (raw === '' || !Number.isFinite(n) || !Number.isInteger(n)) {
        showError(error, errorText, input, 'Please enter a whole number (e.g. 5).');
        return;
      }
      if (n <= 0) {
        showError(error, errorText, input, 'Please enter a positive number (greater than 0).');
        return;
      }
      if (n <= cfg.minN) {
        showError(error, errorText, input,
          cfg.label + ' requires n > ' + cfg.minN + '. Enter at least ' + (cfg.minN + 1) + '.');
        return;
      }
      if (n > MAX_TERMS) {
        showError(error, errorText, input,
          'Maximum is ' + MAX_TERMS + ' terms to keep results readable.');
        return;
      }

      clearError(error, input);
      showResult(resultZone, resultList, resultMeta,
        buildTerms(cfg.memo, cfg.recFn, n));
    });

    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => clearSequenceState(p));
    }
  });

  (function () {
    const input1     = document.getElementById('div-input1');
    const input2     = document.getElementById('div-input2');
    const error      = document.getElementById('div-error');
    const errorText  = document.getElementById('div-error-text');
    const computeBtn = document.getElementById('div-compute-btn');
    const refreshBtn = document.getElementById('div-refresh-btn');
    const resultZone = document.getElementById('div-result-zone');
    const resultList = document.getElementById('div-result-list');
    const resultMeta = document.getElementById('div-result-meta');

    input1.addEventListener('input', () => { clearError(error, input1); input2.classList.remove('group08-input-field--error'); });
    input2.addEventListener('input', () => { clearError(error, input2); input1.classList.remove('group08-input-field--error'); });
    input1.addEventListener('keydown', (e) => { if (e.key === 'Enter') input2.focus(); });
    input2.addEventListener('keydown', (e) => { if (e.key === 'Enter') computeBtn.click(); });

    computeBtn.addEventListener('click', function () {
      const raw1 = input1.value.trim();
      const raw2 = input2.value.trim();
      const n1 = Number(raw1);
      const n2 = Number(raw2);

      if (raw1 === '' || !Number.isFinite(n1) || !Number.isInteger(n1)) {
        showError(error, errorText, input1, 'Please enter a valid integer for the first field.');
        return;
      }
      if (n1 <= 0) {
        showError(error, errorText, input1, 'The first integer must be positive (greater than 0).');
        return;
      }
      if (raw2 === '' || !Number.isFinite(n2) || !Number.isInteger(n2)) {
        showError(error, errorText, input2, 'Please enter a valid integer for the second field.');
        return;
      }
      if (n2 <= 0) {
        showError(error, errorText, input2, 'The second integer must be positive (greater than 0).');
        return;
      }
      if (n1 === n2) {
        showError(error, errorText, input2, 'The two integers must not be equal.');
        return;
      }

      clearError(error, input1);
      input2.classList.remove('group08-input-field--error');
      const lines = computeDivision(n1, n2);
      showResultLines(resultZone, resultList, resultMeta, lines, 'Division result');
    });

    refreshBtn.addEventListener('click', () => clearAlgoState('div'));
  })();

  (function () {
    const input1     = document.getElementById('euc-input1');
    const input2     = document.getElementById('euc-input2');
    const error      = document.getElementById('euc-error');
    const errorText  = document.getElementById('euc-error-text');
    const computeBtn = document.getElementById('euc-compute-btn');
    const refreshBtn = document.getElementById('euc-refresh-btn');
    const resultZone = document.getElementById('euc-result-zone');
    const resultList = document.getElementById('euc-result-list');
    const resultMeta = document.getElementById('euc-result-meta');

    input1.addEventListener('input', () => { clearError(error, input1); input2.classList.remove('group08-input-field--error'); });
    input2.addEventListener('input', () => { clearError(error, input2); input1.classList.remove('group08-input-field--error'); });
    input1.addEventListener('keydown', (e) => { if (e.key === 'Enter') input2.focus(); });
    input2.addEventListener('keydown', (e) => { if (e.key === 'Enter') computeBtn.click(); });

    computeBtn.addEventListener('click', function () {
      const raw1 = input1.value.trim();
      const raw2 = input2.value.trim();
      const n1 = Number(raw1);
      const n2 = Number(raw2);

      if (raw1 === '' || !Number.isFinite(n1) || !Number.isInteger(n1)) {
        showError(error, errorText, input1, 'Please enter a valid integer for the first field.');
        return;
      }
      if (n1 <= 0) {
        showError(error, errorText, input1, 'The first integer must be positive (greater than 0).');
        return;
      }
      if (raw2 === '' || !Number.isFinite(n2) || !Number.isInteger(n2)) {
        showError(error, errorText, input2, 'Please enter a valid integer for the second field.');
        return;
      }
      if (n2 <= 0) {
        showError(error, errorText, input2, 'The second integer must be positive (greater than 0).');
        return;
      }

      clearError(error, input1);
      input2.classList.remove('group08-input-field--error');
      const lines = computeEuclidean(n1, n2);
      showResultLines(resultZone, resultList, resultMeta, lines, 'GCD & LCM');
    });

    refreshBtn.addEventListener('click', () => clearAlgoState('euc'));
  })();

  (function () {
    const input      = document.getElementById('col-input');
    const error      = document.getElementById('col-error');
    const errorText  = document.getElementById('col-error-text');
    const computeBtn = document.getElementById('col-compute-btn');
    const refreshBtn = document.getElementById('col-refresh-btn');
    const resultZone = document.getElementById('col-result-zone');
    const resultList = document.getElementById('col-result-list');
    const resultMeta = document.getElementById('col-result-meta');

    input.addEventListener('input', () => clearError(error, input));
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') computeBtn.click(); });

    computeBtn.addEventListener('click', function () {
      const raw = input.value.trim();
      const n   = Number(raw);

      if (raw === '' || !Number.isFinite(n) || !Number.isInteger(n)) {
        showError(error, errorText, input, 'Please enter a whole number (e.g. 27).');
        return;
      }
      if (n <= 0) {
        showError(error, errorText, input, 'Please enter a positive integer (greater than 0).');
        return;
      }
      if (n % 2 === 0) {
        showError(error, errorText, input, 'Collatz sequence must start with an odd number.');
        return;
      }
      if (n > 1000000) {
        showError(error, errorText, input, 'Maximum starting value is 1,000,000 to keep results manageable.');
        return;
      }

      clearError(error, input);
      const seq = computeCollatz(n);
      showResult(resultZone, resultList, resultMeta, seq.map(String));
    });

    refreshBtn.addEventListener('click', () => clearAlgoState('col'));
  })();

  const exitOverlay = document.getElementById('exit-overlay');
  const exitFinal   = document.getElementById('exit-final');

  function showExitOverlay() {
    exitOverlay.classList.add('group08-exit-overlay--active');
    document.getElementById('exit-cancel').focus();
  }

  function hideExitOverlay() {
    exitOverlay.classList.remove('group08-exit-overlay--active');
  }

  function handleExitDialogFocus(e) {
    if (e.key !== 'Tab') return;
    
    const exitDialog = document.querySelector('.group08-exit-dialog');
    const focusableElements = exitDialog.querySelectorAll('button');
    const firstButton = focusableElements[0];
    const lastButton = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey && document.activeElement === firstButton) {
      e.preventDefault();
      lastButton.focus();
    } else if (!e.shiftKey && document.activeElement === lastButton) {
      e.preventDefault();
      firstButton.focus();
    }
  }

  document.getElementById('exit-cancel').addEventListener('click', hideExitOverlay);
  exitOverlay.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideExitOverlay();
    else if (e.key === 'Tab' && exitOverlay.classList.contains('group08-exit-overlay--active')) {
      handleExitDialogFocus(e);
    }
  });
  document.getElementById('exit-confirm').addEventListener('click', function () {
    hideExitOverlay();
    setTimeout(() => exitFinal.classList.add('group08-exit-final--active'), 300);
  });

  document.querySelectorAll('.group08-input-field').forEach(function(input) {
    input.addEventListener('keydown', function(e) {
      if (['e', 'E', '+', '-', '.'].includes(e.key)) {
        e.preventDefault();
      }
    });
  });

  lucide.createIcons();

})();