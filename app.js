/* ============================================
   PUMPING LEMMA TOOL — app.js
   Handles: language definitions, decomposition,
   pumping simulation, membership checking,
   proof generation, table building
   ============================================ */

// ─── LANGUAGE DEFINITIONS ────────────────────────────────────────────────────

const LANGUAGES = {

  anbn: {
    name: "L = { aⁿbⁿ | n ≥ 1 }",
    defaultString: "aaabbb",
    defaultP: 3,
    description: "Strings with equal number of a's followed by b's",
    check(s) {
      // Must match a+b+ with equal counts
      const m = s.match(/^(a+)(b+)$/);
      if (!m) return false;
      return m[1].length === m[2].length;
    },
    proofText(x, y, z, p) {
      return [
        { cls: "accent",    text: `Assume L = { aⁿbⁿ | n ≥ 1 } is regular.` },
        { cls: "",          text: `By the Pumping Lemma, ∃ pumping length p = ${p}.` },
        { cls: "",          text: `Choose s = a${p}b${p} ∈ L, so |s| = ${2*p} ≥ p. ✓` },
        { cls: "",          text: `Split s = xyz where |xy| ≤ p = ${p}, so x and y consist only of a's.` },
        { cls: "",          text: `x = "${x}", y = "${y}" (all a's), z = "${z}"` },
        { cls: "",          text: `Pump with i = 2: xy²z = "${x}${y}${y}${z}"` },
        { cls: "",          text: `This string has ${x.length + 2*y.length} a's but only ${z.replace(/a/g,'').length + 0/* b count */} b's...` },
        { cls: "highlight", text: `→ xy²z ∉ L because the number of a's ≠ number of b's!` },
        { cls: "highlight", text: `This CONTRADICTS the pumping lemma condition that xy²z ∈ L.` },
        { cls: "green",     text: `∴ L = { aⁿbⁿ } is NOT regular. □` }
      ];
    }
  },

  anbncn: {
    name: "L = { aⁿbⁿcⁿ | n ≥ 1 }",
    defaultString: "aabbcc",
    defaultP: 2,
    description: "Strings with equal numbers of a's, b's and c's in order",
    check(s) {
      const m = s.match(/^(a+)(b+)(c+)$/);
      if (!m) return false;
      return m[1].length === m[2].length && m[2].length === m[3].length;
    },
    proofText(x, y, z, p) {
      return [
        { cls: "accent",    text: `Assume L = { aⁿbⁿcⁿ } is regular.` },
        { cls: "",          text: `By the Pumping Lemma, ∃ pumping length p = ${p}.` },
        { cls: "",          text: `Choose s = a${p}b${p}c${p} ∈ L, |s| = ${3*p} ≥ p. ✓` },
        { cls: "",          text: `Since |xy| ≤ p, both x and y lie entirely within the a-prefix.` },
        { cls: "",          text: `x = "${x}", y = "${y}" (all a's), z = "${z}"` },
        { cls: "",          text: `Pump with i = 2: xy²z contains extra a's but same b's and c's.` },
        { cls: "highlight", text: `→ xy²z ∉ L because count(a) > count(b) = count(c)!` },
        { cls: "highlight", text: `CONTRADICTION — the pumped string violates the language definition.` },
        { cls: "green",     text: `∴ L = { aⁿbⁿcⁿ } is NOT regular. □` }
      ];
    }
  },

  palindrome: {
    name: "L = { wwᴿ | w ∈ {a,b}* }",
    defaultString: "abba",
    defaultP: 3,
    description: "Even-length palindromes over {a, b}",
    check(s) {
      if (s.length % 2 !== 0) return false;
      const rev = s.split('').reverse().join('');
      return s === rev;
    },
    proofText(x, y, z, p) {
      return [
        { cls: "accent",    text: `Assume L = { wwᴿ } (even palindromes) is regular.` },
        { cls: "",          text: `By the Pumping Lemma, ∃ pumping length p = ${p}.` },
        { cls: "",          text: `Choose s = aᵖbᵖbᵖaᵖ ∈ L, so |s| = ${4*p} ≥ p. ✓` },
        { cls: "",          text: `Since |xy| ≤ p, x and y are entirely within the initial a-block.` },
        { cls: "",          text: `x = "${x}", y = "${y}" (all a's), z = "${z}"` },
        { cls: "",          text: `Pump with i = 2: xy²z has more a's on the left than the right.` },
        { cls: "highlight", text: `→ xy²z ∉ L because the string is no longer a palindrome!` },
        { cls: "highlight", text: `CONTRADICTION — pumped string breaks the palindrome property.` },
        { cls: "green",     text: `∴ L = { wwᴿ } is NOT regular. □` }
      ];
    }
  },

  a2n: {
    name: "L = { a^(2ⁿ) | n ≥ 0 }",
    defaultString: "aaaa",
    defaultP: 2,
    description: "Strings of a's whose length is a power of 2",
    check(s) {
      if (!/^a+$/.test(s)) return false;
      const len = s.length;
      if (len === 0) return false;
      return (len & (len - 1)) === 0; // power of 2 check
    },
    proofText(x, y, z, p) {
      return [
        { cls: "accent",    text: `Assume L = { a^(2ⁿ) | n ≥ 0 } is regular.` },
        { cls: "",          text: `By the Pumping Lemma, ∃ pumping length p = ${p}.` },
        { cls: "",          text: `Choose s = a^(2ᵖ) ∈ L with |s| = 2ᵖ ≥ p. ✓` },
        { cls: "",          text: `Split s = xyz with 1 ≤ |y| ≤ p, so |y| = k for some k ∈ [1, p].` },
        { cls: "",          text: `x = "${x}", y = "${y}" (${y.length} a's), z = "${z}"` },
        { cls: "",          text: `|xy²z| = 2ᵖ + k, and 2ᵖ < 2ᵖ + k ≤ 2ᵖ + p < 2ᵖ⁺¹` },
        { cls: "highlight", text: `→ xy²z has length strictly between two consecutive powers of 2!` },
        { cls: "highlight", text: `CONTRADICTION — xy²z ∉ L since its length is not a power of 2.` },
        { cls: "green",     text: `∴ L = { a^(2ⁿ) } is NOT regular. □` }
      ];
    }
  },

  custom: {
    name: "Custom Language",
    defaultString: "",
    defaultP: 3,
    description: "User-defined string with optional regex membership check",
    _regex: null,       // set at runtime from the custom-regex input
    _displayName: "Custom Language",
    check(s) {
      if (!this._regex) return null; // null = manual check required
      try { return this._regex.test(s); } catch(e) { return null; }
    },
    proofText(x, y, z, p) {
      const lname = this._displayName || "Custom Language";
      return [
        { cls: "accent",    text: `Assume ${lname} is regular.` },
        { cls: "",          text: `By the Pumping Lemma, ∃ pumping length p = ${p}.` },
        { cls: "",          text: `Choose s = "${x+y+z}" ∈ L with |s| = ${(x+y+z).length} ≥ p = ${p}. ✓` },
        { cls: "",          text: `Decompose: x = "${x}", y = "${y}" (|y| = ${y.length} ≥ 1 ✓), z = "${z}"` },
        { cls: "",          text: `|xy| = ${x.length + y.length} ≤ p = ${p} ✓` },
        { cls: "",          text: `Pump with i = 2: xy²z = "${x+y+y+z}"` },
        { cls: "highlight", text: `→ Check: does xy²z = "${x+y+y+z}" still belong to ${lname}?` },
        { cls: "highlight", text: `If xy²z ∉ L for ANY valid split, that is the contradiction!` },
        { cls: "green",     text: `If such a contradiction exists, ${lname} is NOT regular. □` }
      ];
    }
  }
};

// ─── STATE ────────────────────────────────────────────────────────────────────

let state = {
  lang: 'anbn',
  str: '',
  p: 3,
  x: '', y: '', z: '',
  i: 1
};

// ─── DOM REFS ─────────────────────────────────────────────────────────────────

const langSelect    = document.getElementById('langSelect');
const stringInput   = document.getElementById('stringInput');
const pumpInput     = document.getElementById('pumpInput');
const runBtn        = document.getElementById('runBtn');

// Custom language panel
const customLangPanel = document.getElementById('customLangPanel');
const customLangName  = document.getElementById('customLangName');
const customRegex     = document.getElementById('customRegex');

const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');
const step4 = document.getElementById('step4');
const step5 = document.getElementById('step5');

const splitVisual   = document.getElementById('splitVisual');
const splitInfo     = document.getElementById('splitInfo');
const pumpedVisual  = document.getElementById('pumpedVisual');
const membershipResult = document.getElementById('membershipResult');
const iValue        = document.getElementById('iValue');
const proofBox      = document.getElementById('proofBox');
const pumpTableBody = document.getElementById('pumpTableBody');

// ─── EXAMPLE CARDS ───────────────────────────────────────────────────────────

document.querySelectorAll('.ecard').forEach(card => {
  card.addEventListener('click', () => {
    const lang = card.dataset.lang;
    const str  = card.dataset.string;
    const p    = card.dataset.p;

    langSelect.value  = lang;
    stringInput.value = str;
    pumpInput.value   = p;

    // Scroll to tool
    document.getElementById('tool').scrollIntoView({ behavior: 'smooth' });

    // Highlight card
    document.querySelectorAll('.ecard').forEach(c => c.style.borderColor = '');
    card.style.borderColor = 'var(--accent)';
  });
});

// ─── DECOMPOSE STRING ────────────────────────────────────────────────────────

function decomposeString(s, p) {
  // xy must be within first p characters, |y| >= 1
  // We pick x = s[0..p-2], y = s[p-1..p-1], z = rest
  // More interesting: x is prefix, y is a non-empty block within first p chars
  const xyLen = Math.min(p, s.length);
  const yStart = Math.max(0, xyLen - Math.ceil(xyLen / 2));
  const yEnd   = xyLen;

  // For a^n b^n style: y should be entirely within one block
  const x = s.slice(0, yStart);
  const y = s.slice(yStart, yEnd) || s[0]; // ensure |y| >= 1
  const z = s.slice(yEnd);
  return { x, y, z };
}

// ─── MEMBERSHIP CHECKS ───────────────────────────────────────────────────────

function checkMembership(langKey, str) {
  const lang = LANGUAGES[langKey];
  const result = lang.check(str);
  if (langKey === 'custom') {
    if (result === null) return { inLang: null, reason: 'No regex — verify manually' };
    return { inLang: result, reason: result ? `"${str}" ∈ L ✓` : `"${str}" ∉ L ✗` };
  }
  return { inLang: result, reason: result ? `"${str}" ∈ L ✓` : `"${str}" ∉ L ✗` };
}

// ─── BUILD SPLIT VISUAL ───────────────────────────────────────────────────────

function buildSplitVisual(container, x, y, z) {
  container.innerHTML = '';

  const addChars = (part, cls) => {
    part.split('').forEach(ch => {
      const div = document.createElement('div');
      div.className = `char-block ${cls}`;
      div.textContent = ch;
      container.appendChild(div);
    });
  };

  addChars(x, 'char-x');
  addChars(y, 'char-y');
  addChars(z, 'char-z');
}

// ─── BUILD PUMPED VISUAL ─────────────────────────────────────────────────────

function buildPumpedVisual(container, x, y, z, iVal) {
  container.innerHTML = '';
  const yPumped = y.repeat(Math.max(0, iVal));

  const addChars = (part, cls) => {
    part.split('').forEach(ch => {
      const div = document.createElement('div');
      div.className = `char-block ${cls}`;
      div.textContent = ch;
      container.appendChild(div);
    });
  };

  addChars(x, 'char-x');
  addChars(yPumped, 'char-y');
  addChars(z, 'char-z');

  return x + yPumped + z;
}

// ─── BUILD PUMP TABLE ─────────────────────────────────────────────────────────

function buildPumpTable(langKey, x, y, z) {
  pumpTableBody.innerHTML = '';
  const maxI = 5;

  for (let i = 0; i <= maxI; i++) {
    const yPumped = y.repeat(i);
    const pumped  = x + yPumped + z;
    const { inLang, reason } = checkMembership(langKey, pumped);

    const tr = document.createElement('tr');

    // Highlight i=0 and i=2 as key cases
    const isKeyCase = (i === 0 || i === 2);
    if (isKeyCase) tr.style.background = 'rgba(255,255,255,.025)';

    const pumpedHTML = `<span class="str-x">${escHtml(x)}</span><span class="str-y">${escHtml(yPumped)}</span><span class="str-z">${escHtml(z)}</span>`;

    let inLangBadge, verdictBadge;
    if (inLang === null) {
      inLangBadge  = `<span class="badge-ok">Manual</span>`;
      verdictBadge = `<span class="badge-ok">Check manually</span>`;
    } else {
      inLangBadge = inLang
        ? `<span class="badge-in">YES</span>`
        : `<span class="badge-out">NO</span>`;
      verdictBadge = inLang
        ? `<span class="badge-ok">OK — stays in L</span>`
        : `<span class="badge-contra">CONTRADICTION!</span>`;
    }

    tr.innerHTML = `
      <td style="color:var(--accent);font-weight:700">${i}</td>
      <td><code style="font-family:var(--font-mono)">${pumpedHTML}</code></td>
      <td style="color:var(--text2)">${pumped.length}</td>
      <td>${inLangBadge}</td>
      <td>${verdictBadge}</td>
    `;
    pumpTableBody.appendChild(tr);
  }
}

// ─── BUILD PROOF ─────────────────────────────────────────────────────────────

function buildProof(langKey, x, y, z, p) {
  proofBox.innerHTML = '';
  const lang = LANGUAGES[langKey];
  const lines = lang.proofText(x, y, z, p);
  lines.forEach(line => {
    const div = document.createElement('div');
    div.className = `proof-line ${line.cls}`;
    div.innerHTML = line.text;
    proofBox.appendChild(div);
  });
}

// ─── UTILS ───────────────────────────────────────────────────────────────────

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function show(el) { el.classList.remove('hidden'); }
function hide(el) { el.classList.add('hidden'); }

function animateIValue() {
  iValue.style.transform = 'scale(1.4)';
  setTimeout(() => { iValue.style.transform = 'scale(1)'; }, 200);
}

// ─── MAIN RUN ─────────────────────────────────────────────────────────────────

function runDemonstration() {
  const langKey = langSelect.value;
  const str     = stringInput.value.trim().toLowerCase();
  const p       = parseInt(pumpInput.value) || 3;

  // ── Apply custom language definition if selected ──
  if (langKey === 'custom') {
    const nameVal  = customLangName.value.trim();
    const regexVal = customRegex.value.trim();

    LANGUAGES.custom._displayName = nameVal || 'Custom Language';
    LANGUAGES.custom.name         = nameVal || 'Custom Language';

    if (regexVal) {
      try {
        LANGUAGES.custom._regex = new RegExp(regexVal, 'i');
      } catch (e) {
        alert(`Invalid regex pattern: "${regexVal}"\n\nError: ${e.message}\n\nPlease fix the pattern or leave it blank for manual checking.`);
        customRegex.focus();
        return;
      }
    } else {
      LANGUAGES.custom._regex = null; // manual mode
    }
  }

  // Validation
  if (!str) {
    alert('Please enter a sample string!');
    return;
  }
  if (str.length < 2) {
    alert('String must be at least 2 characters long.');
    return;
  }
  if (p < 1) {
    alert('Pumping length p must be at least 1.');
    return;
  }
  if (str.length < p) {
    alert(`String length (${str.length}) should be ≥ pumping length p (${p}) for a valid demonstration.\n\nTry a longer string or smaller p.`);
    return;
  }

  const lang = LANGUAGES[langKey];

  // Check if string is in language
  if (langKey !== 'custom') {
    const { inLang } = checkMembership(langKey, str);
    if (!inLang) {
      alert(`"${str}" is NOT in ${lang.name}.\nPlease enter a valid string that belongs to the language.`);
      return;
    }
  }

  // Decompose
  const { x, y, z } = decomposeString(str, p);

  // Save state
  state = { lang: langKey, str, p, x, y, z, i: 1 };

  // ── STEP 2: SPLIT ──
  buildSplitVisual(splitVisual, x, y, z);
  splitInfo.innerHTML = `
    <strong>s</strong> = "${escHtml(str)}"  |  |s| = ${str.length}<br/>
    <span style="color:var(--x-color)">x = "${escHtml(x)}"</span>  |  |x| = ${x.length}<br/>
    <span style="color:var(--y-color)">y = "${escHtml(y)}"</span>  |  |y| = ${y.length} ≥ 1 ✓<br/>
    <span style="color:var(--z-color)">z = "${escHtml(z)}"</span>  |  |z| = ${z.length}<br/>
    |xy| = ${x.length + y.length} ≤ p = ${p} ✓
  `;
  show(step2);

  // ── STEP 3: PUMP ──
  iValue.textContent = '1';
  const pumped = buildPumpedVisual(pumpedVisual, x, y, z, 1);
  updateMembership(langKey, pumped);
  show(step3);

  // ── STEP 4: PROOF ──
  buildProof(langKey, x, y, z, p);
  show(step4);

  // ── STEP 5: TABLE ──
  buildPumpTable(langKey, x, y, z);
  show(step5);

  // Scroll to step 2
  setTimeout(() => {
    step2.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

// ─── MEMBERSHIP UPDATE ───────────────────────────────────────────────────────

function updateMembership(langKey, pumped) {
  const { inLang } = checkMembership(langKey, pumped);
  if (inLang === null) {
    membershipResult.className = 'membership-result in-lang';
    membershipResult.innerHTML = `xy<sup>${state.i}</sup>z = "${escHtml(pumped)}"  |  Length = ${pumped.length}  |  Check membership manually.`;
    return;
  }
  if (inLang) {
    membershipResult.className = 'membership-result in-lang';
    membershipResult.innerHTML = `xy<sup>${state.i}</sup>z = "${escHtml(pumped)}"  |  Length = ${pumped.length}  |  ✅ In language L`;
  } else {
    membershipResult.className = 'membership-result not-in-lang';
    membershipResult.innerHTML = `xy<sup>${state.i}</sup>z = "${escHtml(pumped)}"  |  Length = ${pumped.length}  |  ❌ NOT in language L — CONTRADICTION!`;
  }
}

// ─── PUMP CONTROLS ───────────────────────────────────────────────────────────

document.getElementById('increaseI').addEventListener('click', () => {
  if (state.i >= 8) return;
  state.i++;
  iValue.textContent = state.i;
  animateIValue();
  const pumped = buildPumpedVisual(pumpedVisual, state.x, state.y, state.z, state.i);
  updateMembership(state.lang, pumped);
});

document.getElementById('decreaseI').addEventListener('click', () => {
  if (state.i <= 0) return;
  state.i--;
  iValue.textContent = state.i;
  animateIValue();
  const pumped = buildPumpedVisual(pumpedVisual, state.x, state.y, state.z, state.i);
  updateMembership(state.lang, pumped);
});

// ─── EVENT LISTENERS ─────────────────────────────────────────────────────────

runBtn.addEventListener('click', runDemonstration);

stringInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') runDemonstration();
});

langSelect.addEventListener('change', () => {
  const langKey = langSelect.value;
  const lang = LANGUAGES[langKey];

  // Show or hide custom language panel
  if (langKey === 'custom') {
    customLangPanel.classList.remove('hidden');
    stringInput.value = '';
    pumpInput.value   = lang.defaultP;
  } else {
    customLangPanel.classList.add('hidden');
    stringInput.value = lang.defaultString;
    pumpInput.value   = lang.defaultP;
  }

  // Hide downstream steps on change
  [step2, step3, step4, step5].forEach(hide);
});

// ─── INIT ─────────────────────────────────────────────────────────────────────

// Pre-fill defaults
const defaultLang = LANGUAGES[langSelect.value];
stringInput.value = defaultLang.defaultString;
pumpInput.value   = defaultLang.defaultP;
