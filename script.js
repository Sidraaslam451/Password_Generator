var passHistory = [];
var currentPassword = "";

// ── Shuffle array (Fisher-Yates) ──
function shuffle(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

// ── Update length slider label ──
function updateLength(val) {
  document.getElementById("length-val").textContent = val;
}

// ── Get strength info based on password ──
function getStrength(password) {
  var score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 3) return { label: "Weak", color: "#f87171", width: "25%" };
  if (score <= 5) return { label: "Fair", color: "#fbbf24", width: "55%" };
  if (score <= 6) return { label: "Strong", color: "#34d399", width: "80%" };
  return { label: "Very Strong", color: "#7c6af7", width: "100%" };
}

// ── Update strength bar ──
function updateStrength(password) {
  var s = getStrength(password);
  var fill = document.getElementById("strength-fill");
  var label = document.getElementById("strength-label");
  fill.style.width = s.width;
  fill.style.background = s.color;
  label.style.color = s.color;
  label.textContent = s.label;
}

// ── Main generate function ──
function generatePassword() {
  var lower = "abcdefghijklmnopqrstuvwxyz";
  var upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var numbers = "0123456789";
  var symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  var useLower = document.getElementById("chk-lower").checked;
  var useUpper = document.getElementById("chk-upper").checked;
  var useNumbers = document.getElementById("chk-numbers").checked;
  var useSymbols = document.getElementById("chk-symbols").checked;
  var length = parseInt(document.getElementById("length-slider").value);
  var hint = document.getElementById("hint");

  // at least one option must be selected
  if (!useLower && !useUpper && !useNumbers && !useSymbols) {
    hint.textContent = "⚠ Please select at least one character type.";
    return;
  }
  hint.textContent = "";

  var charset = "";
  var guaranteed = [];

  if (useLower) {
    charset += lower;
    guaranteed.push(lower[Math.floor(Math.random() * lower.length)]);
  }
  if (useUpper) {
    charset += upper;
    guaranteed.push(upper[Math.floor(Math.random() * upper.length)]);
  }
  if (useNumbers) {
    charset += numbers;
    guaranteed.push(numbers[Math.floor(Math.random() * numbers.length)]);
  }
  if (useSymbols) {
    charset += symbols;
    guaranteed.push(symbols[Math.floor(Math.random() * symbols.length)]);
  }

  // fill remaining length with random chars from charset
  var remaining = [];
  for (var i = guaranteed.length; i < length; i++) {
    remaining.push(charset[Math.floor(Math.random() * charset.length)]);
  }

  // combine guaranteed + remaining then shuffle so pattern is not predictable
  var allChars = shuffle(guaranteed.concat(remaining));
  var password = allChars.join("");

  currentPassword = password;

  // update output
  var outputEl = document.getElementById("output");
  outputEl.textContent = password;
  outputEl.classList.remove("placeholder");

  // reset copy button
  var copyBtn = document.getElementById("copy-btn");
  copyBtn.classList.remove("copied");
  document.getElementById("copy-icon").textContent = "⧉";

  // update strength
  updateStrength(password);

  // add to history (max 8)
  addToHistory(password);
}

// ── Copy to clipboard ──
function copyPassword() {
  if (!currentPassword) return;
  navigator.clipboard.writeText(currentPassword).then(function () {
    var btn = document.getElementById("copy-btn");
    var icon = document.getElementById("copy-icon");
    btn.classList.add("copied");
    icon.textContent = "✓";
    setTimeout(function () {
      btn.classList.remove("copied");
      icon.textContent = "⧉";
    }, 2000);
  });
}

// ── History ──
// generatePassword() mein
function addToHistory(password) {
  passHistory.unshift(password);
  if (passHistory.length > 8) passHistory.pop();
  renderHistory();
}

// renderHistory() mein
function renderHistory() {
  var list = document.getElementById("history-list");
  list.innerHTML = "";

  if (passHistory.length === 0) {
    list.innerHTML =
      '<li class="history-empty">No passwords generated yet</li>';
    return;
  }

  for (var i = 0; i < passHistory.length; i++) {
    (function (pw) {
      var li = document.createElement("li");
      li.classList.add("history-item");
      li.innerHTML =
        "<span>" + pw + '</span><span class="item-copy">click to copy</span>';
      li.onclick = function () {
        navigator.clipboard.writeText(pw);
        li.querySelector(".item-copy").textContent = "copied!";
        setTimeout(function () {
          li.querySelector(".item-copy").textContent = "click to copy";
        }, 1500);
      };
      list.appendChild(li);
    })(passHistory[i]);
  }
}

// clearHistory() mein
function clearHistory() {
  passHistory = [];
  renderHistory();
}
// ── Init ──
generatePassword();
