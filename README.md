# 🧮 Pumping Lemma Demonstration Tool

> An interactive educational tool that visually demonstrates the **Pumping Lemma for Regular Languages** — helping students understand how it's used to prove that certain languages are **not regular**.

---
Deployment Link: https://pumpinglemma.netlify.app/
## 📸 Overview

This tool allows users to:
- Select or define a **language** (e.g., `aⁿbⁿ`, `aⁿbⁿcⁿ`, palindromes, powers of 2)
- Enter a **sample string** belonging to that language
- Set a **pumping length p**
- Watch a **step-by-step visual decomposition** of the string into `x`, `y`, `z`
- **Interactively pump** the middle segment (`y`) with different values of `i`
- See whether the pumped string `xyⁱz` remains in the language
- Read a **formal proof of non-regularity** for the chosen language
- Examine a **summary table** of all pumped strings `xy⁰z` through `xy⁵z`

---

## 🚀 How to Run

No setup required. Just open `index.html` in any modern browser.

```bash
# Clone the repo
git clone https://github.com/krishna-131326/pumping_lemma_visualisation_tool.git

# Navigate into the folder
cd pumping-lemma-tool

# Open in browser
open index.html   # macOS
start index.html  # Windows
xdg-open index.html  # Linux
```

Or simply **double-click** `index.html` to open it.

---

## 📁 File Structure

```
pumping-lemma-tool/
│
├── index.html      ← Main HTML structure & layout
├── style.css       ← Styling (dark theme, animations, responsive)
├── app.js          ← All logic: decomposition, pumping, membership, proofs
└── README.md       ← This file
```

---

## 🎓 Supported Languages

| Language | Definition | Why Non-Regular |
|---|---|---|
| `aⁿbⁿ` | Equal a's then b's | DFA can't count unboundedly |
| `aⁿbⁿcⁿ` | Equal a's, b's and c's | Requires 2 independent counters |
| `wwᴿ` | Even-length palindromes | Requires stack (PDA) memory |
| `a^(2ⁿ)` | Powers-of-2 length | Exponential growth breaks DFA |
| Custom | User-defined | Manual membership check |

---

## 🧩 How the Pumping Lemma Works

The **Pumping Lemma** states:

> If **L** is a regular language, then ∃ pumping length **p** such that every string **s ∈ L** with **|s| ≥ p** can be written as **s = xyz** satisfying:
> 1. **|y| ≥ 1**
> 2. **|xy| ≤ p**
> 3. **∀i ≥ 0 : xyⁱz ∈ L**

To prove a language is **not regular**, assume it is, then find a contradiction where at least one `xyⁱz ∉ L`.

---

## 💻 Technologies Used

- **HTML5** — Semantic structure
- **CSS3** — Custom properties, grid, flexbox, animations
- **JavaScript** — Zero dependencies, no frameworks

---

## 📖 Subject

> **Theory of Automata and Formal Languages**

---

## 👤 Author

- **Student Name:** *Krishna*
- **Roll No:** *2024UCS1548*
- **Instructor:** *prof: Anmol Awasthi*
- **Institution:** *Netaji Subhas University of Technology , Delhi*

---

## 📄 License

This project is submitted as an academic assignment. Feel free to use it for educational purposes.
