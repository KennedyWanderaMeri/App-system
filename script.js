const hrs = document.getElementById("hrs")
const mins = document.getElementById("mins")
const sec = document.getElementById("sec")
setInterval(()=>{
const currenttime = new Date();
hrs.innerHTML =(currenttime.getHours()< 10 ? "0" : "")+currenttime.getHours();
mins.innerHTML = (currenttime.getMinutes()< 10 ? "0" : "")+currenttime.getMinutes();
sec.innerHTML = (currenttime.getSeconds() < 10 ? "0" : "") + currenttime.getSeconds();
},1000)
*/ Test rugby IQ*/
/* ==========================================================================
   RUGBY IQ QUIZ - JavaScript Logic
   ========================================================================== */

// 1. QUESTION BANK (Exactly 6 Questions)
const quizQuestions = [
  {
    category: "Laws & Formations",
    question: "How many players from each team participate in a standard packed scrum in Rugby Union?",
    options: ["6 Players", "8 Players", "11 Players", "15 Players"],
    answer: 1,
    explanation: "A full Rugby Union scrum consists of 8 players from each team (3 forwards in the front row, 2 in the second row, and 3 in the back row)."
  },
  {
    category: "World Cup History",
    question: "Which nation won the inaugural Men's Rugby World Cup held in 1987?",
    options: ["Australia", "England", "New Zealand", "South Africa"],
    answer: 2,
    explanation: "New Zealand's All Blacks won the first-ever Rugby World Cup in 1987, defeating France 29–9 in the final at Eden Park."
  },
  {
    category: "Positions & Numbers",
    question: "In standard Rugby Union squad numbering, which position traditionally wears the No. 9 jersey?",
    options: ["Fly-Half", "Scrum-Half", "Fullback", "Hooker"],
    answer: 1,
    explanation: "The Scrum-Half wears jersey No. 9 and acts as the key link between the forwards and the backs."
  },
  {
    category: "Scoring Rules",
    question: "How many points is a successful Penalty Kick or Drop Goal worth in Rugby Union?",
    options: ["2 Points", "3 Points", "5 Points", "7 Points"],
    answer: 1,
    explanation: "A successful Penalty Kick and a Drop Goal are both worth 3 points. A Try is worth 5 points, and a Conversion is worth 2."
  },
  {
    category: "Match Officiating",
    question: "What is the mandatory restart signal after an unintentional forward pass or knock-on?",
    options: ["Penalty Kick", "Lineout", "Scrum", "Free Kick"],
    answer: 2,
    explanation: "An accidental knock-on or forward pass results in a scrum awarded to the non-offending team."
  },
  {
    category: "Assistant Referees",
    question: "How does an assistant referee signal that a ball has gone into touch (out of bounds)?",
    options: ["Raises flag vertically", "Points flag towards goalposts", "Blows whistle loudly", "Waves flag in circle"],
    answer: 0,
    explanation: "When the ball enters touch, the assistant referee raises their flag straight up in the air and points in the direction of the team throwing in."
  }
];

// 2. STATE MANAGEMENT
let currentUser = { name: "", email: "" };
let currentQuestionIndex = 0;
let userScore = 0;
let selectedOption = null;

// 3. DOM ELEMENTS
const authView = document.getElementById("auth-view");
const quizView = document.getElementById("quiz-view");
const resultsView = document.getElementById("results-view");
const regForm = document.getElementById("reg-form");

const fullNameInput = document.getElementById("full-name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const nameError = document.getElementById("name-error");
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");

const userBadge = document.getElementById("user-badge");
const badgeUserName = document.getElementById("badge-user-name");

const questionCategory = document.getElementById("question-category");
const questionCounter = document.getElementById("question-counter");
const progressBar = document.getElementById("progress-bar");
const questionText = document.getElementById("question-text");
const optionsGrid = document.getElementById("options-grid");
const explanationBox = document.getElementById("explanation-box");
const explanationText = document.getElementById("explanation-text");
const nextBtn = document.getElementById("next-btn");

const finalScoreText = document.getElementById("final-score-text");
const finalPercentText = document.getElementById("final-percent-text");
const scoreRingFill = document.getElementById("score-ring-fill");
const rankTitle = document.getElementById("rank-title");
const rankDescription = document.getElementById("rank-description");
const topScoreDetails = document.getElementById("top-score-details");
const leaderboardBody = document.getElementById("leaderboard-body");

const restartBtn = document.getElementById("restart-btn");
const clearScoresBtn = document.getElementById("clear-scores-btn");

// 4. INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    lucide.createIcons();
  }
  regForm.addEventListener("submit", handleRegistration);
  nextBtn.addEventListener("click", handleNextQuestion);
  restartBtn.addEventListener("click", restartQuiz);
  clearScoresBtn.addEventListener("click", clearLeaderboard);
});

// 5. FORM VALIDATION & SUBMISSION
function handleRegistration(e) {
  e.preventDefault();
  let isValid = true;

  const nameVal = fullNameInput.value.trim();
  const emailVal = emailInput.value.trim();
  const passVal = passwordInput.value.trim();

  // Reset errors
  document.querySelectorAll(".input-group").forEach(el => el.classList.remove("invalid"));

  // Validate Full Name
  if (nameVal.length < 3) {
    fullNameInput.closest(".input-group").classList.add("invalid");
    isValid = false;
  }

  // Validate Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailVal)) {
    emailInput.closest(".input-group").classList.add("invalid");
    isValid = false;
  }

  // Validate Password
  if (passVal.length < 6) {
    passwordInput.closest(".input-group").classList.add("invalid");
    isValid = false;
  }

  if (!isValid) {
    authView.classList.add("shake");
    setTimeout(() => authView.classList.remove("shake"), 400);
    return;
  }

  // Set user details
  currentUser = {
    name: nameVal,
    email: maskEmail(emailVal)
  };

  badgeUserName.textContent = currentUser.name;
  userBadge.classList.remove("hidden");

  // Transition to Quiz View
  switchView(authView, quizView);
  startQuiz();
}

function maskEmail(email) {
  const parts = email.split("@");
  if (parts[0].length <= 2) return email;
  return parts[0].substring(0, 2) + "***@" + parts[1];
}

// 6. QUIZ LOGIC
function startQuiz() {
  currentQuestionIndex = 0;
  userScore = 0;
  loadQuestion();
}

function loadQuestion() {
  const q = quizQuestions[currentQuestionIndex];
  selectedOption = null;

  // Update UI Elements
  questionCategory.textContent = q.category;
  questionCounter.textContent = `Question ${currentQuestionIndex + 1} of 6`;
  progressBar.style.width = `${((currentQuestionIndex + 1) / 6) * 100}%`;
  questionText.textContent = q.question;

  // Reset Explanation & Next Button
  explanationBox.classList.add("hidden");
  nextBtn.classList.add("hidden");

  // Build Options Grid
  optionsGrid.innerHTML = "";
  const letters = ["A", "B", "C", "D"];

  q.options.forEach((optText, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option-card";
    btn.innerHTML = `
      <span class="option-letter">${letters[idx]}</span>
      <span class="option-label">${optText}</span>
    `;
    btn.addEventListener("click", () => handleOptionSelect(idx));
    optionsGrid.appendChild(btn);
  });
}

function handleOptionSelect(optionIndex) {
  if (selectedOption !== null) return; // Prevent changing answer
  selectedOption = optionIndex;

  const q = quizQuestions[currentQuestionIndex];
  const optionCards = optionsGrid.querySelectorAll(".option-card");

  // Disable all options
  optionCards.forEach((card, idx) => {
    card.classList.add("disabled");
    if (idx === q.answer) {
      card.classList.add("correct");
    }
  });

  if (optionIndex === q.answer) {
    userScore++;
  } else {
    optionCards[optionIndex].classList.add("wrong");
  }

  // Show explanation & Next button
  explanationText.textContent = q.explanation;
  explanationBox.classList.remove("hidden");
  nextBtn.classList.remove("hidden");
  
  if (currentQuestionIndex === quizQuestions.length - 1) {
    nextBtn.innerHTML = `View IQ Results <i data-lucide="check-circle"></i>`;
    if (window.lucide) lucide.createIcons();
  }
}

function handleNextQuestion() {
  if (currentQuestionIndex < quizQuestions.length - 1) {
    currentQuestionIndex++;
    loadQuestion();
  } else {
    finishQuiz();
  }
}

// 7. RESULTS & LEADERBOARD LOGIC
function finishQuiz() {
  switchView(quizView, resultsView);

  const total = quizQuestions.length; // 6
  const percentage = Math.round((userScore / total) * 100);

  // Update Score Displays
  finalScoreText.textContent = `${userScore}/${total}`;
  finalPercentText.textContent = `${percentage}%`;

  // Animate SVG score ring
  const strokeDash = 326.7;
  const offset = strokeDash - (strokeDash * percentage) / 100;
  setTimeout(() => {
    scoreRingFill.style.strokeDashoffset = offset;
  }, 100);

  // Determine Rank Title & Description
  let rank = "";
  let desc = "";

  if (percentage === 100) {
    rank = "World-Class Captain";
    desc = "Flawless performance! You master every law and tactic of the game.";
  } else if (percentage >= 80) {
    rank = "First XV Starter";
    desc = "Outstanding rugby IQ! You clearly know your way around the pitch.";
  } else if (percentage >= 50) {
    rank = "Impact Sub";
    desc = "Solid effort! A little more study on the laws and you will reach top tier.";
  } else {
    rank = "Academy Rookie";
    desc = "Hit the rulebook and practice fields again to build up your knowledge!";
  }

  rankTitle.textContent = rank;
  rankDescription.textContent = desc;

  // Save to LocalStorage
  saveResultToLocalStorage(currentUser.name, currentUser.email, userScore, total, percentage);

  // Refresh Leaderboard Display
  renderLeaderboard();
}

function saveResultToLocalStorage(name, email, score, total, percentage) {
  try {
    const existing = JSON.parse(localStorage.getItem("rugbyQuizScores")) || [];
    const dateStr = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    const newRecord = { name, email, score, total, percentage, date: dateStr };
    existing.push(newRecord);

    // Sort descending by score
    existing.sort((a, b) => b.percentage - a.percentage || b.score - a.score);

    localStorage.setItem("rugbyQuizScores", JSON.stringify(existing));
  } catch (e) {
    console.error("Unable to save score to localStorage:", e);
  }
}

function renderLeaderboard() {
  try {
    const records = JSON.parse(localStorage.getItem("rugbyQuizScores")) || [];

    // Render All-Time Best Card
    if (records.length > 0) {
      const best = records[0];
      topScoreDetails.textContent = `${best.name} - ${best.score}/6 (${best.percentage}%)`;
    } else {
      topScoreDetails.textContent = "No records yet";
    }

    // Render Table Rows
    leaderboardBody.innerHTML = "";
    if (records.length === 0) {
      leaderboardBody.innerHTML = `<tr><td colspan="5" class="empty-state">No attempts recorded yet.</td></tr>`;
      return;
    }

    records.forEach((rec, idx) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>#${idx + 1}</strong></td>
        <td>${escapeHTML(rec.name)}</td>
        <td><strong>${rec.score}</strong> / ${rec.total}</td>
        <td><span class="percentage-tag">${rec.percentage}%</span></td>
        <td>${rec.date}</td>
      `;
      leaderboardBody.appendChild(tr);
    });
  } catch (e) {
    console.error("Unable to render leaderboard:", e);
  }
}

function clearLeaderboard() {
  if (confirm("Are you sure you want to clear all high scores?")) {
    localStorage.removeItem("rugbyQuizScores");
    renderLeaderboard();
  }
}

function restartQuiz() {
  scoreRingFill.style.strokeDashoffset = 326.7;
  switchView(resultsView, quizView);
  startQuiz();
}

// 8. UTILITIES
function switchView(fromView, toView) {
  fromView.classList.remove("active");
  setTimeout(() => {
    fromView.style.display = "none";
    toView.style.display = "block";
    setTimeout(() => toView.classList.add("active"), 20);
  }, 200);
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}