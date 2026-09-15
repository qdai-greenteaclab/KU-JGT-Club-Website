document.addEventListener('DOMContentLoaded', () => {
  const quizApp = document.getElementById('quiz-app');
  if (!quizApp || typeof teaQuizQuestions === 'undefined') {
    return;
  }

  const startScreen = document.getElementById('quiz-start');
  const beginnerBtn = document.getElementById('quiz-start-beginner-btn');
  const intermediateBtn = document.getElementById('quiz-start-intermediate-btn');
  const playArea = document.getElementById('quiz-play');
  const levelBadge = document.getElementById('quiz-level-badge');
  const progressText = document.getElementById('quiz-progress-text');
  const progressFill = document.getElementById('quiz-progress-fill');
  const questionBox = document.getElementById('quiz-question-box');
  const questionEl = document.getElementById('quiz-question');
  const choicesEl = document.getElementById('quiz-choices');
  const feedbackEl = document.getElementById('quiz-feedback');
  const feedbackResultEl = document.getElementById('quiz-feedback-result');
  const feedbackExplanationEl = document.getElementById('quiz-feedback-explanation');
  const nextBtn = document.getElementById('quiz-next-btn');
  const resultEl = document.getElementById('quiz-result');
  const resultTitleEl = document.getElementById('quiz-result-title');
  const resultScoreEl = document.getElementById('quiz-result-score');
  const resultMessageEl = document.getElementById('quiz-result-message');
  const restartBtn = document.getElementById('quiz-restart-btn');
  const levelSelectBtn = document.getElementById('quiz-level-select-btn');

  // 問題プールが何問に増えても、1回のプレイで出題するのはこの数だけ。
  const QUESTIONS_PER_ROUND = 10;

  const LEVEL_LABELS = {
    beginner: '初級編（○×）',
    intermediate: '中級編（5択）'
  };

  let questions = [];
  let currentIndex = 0;
  let score = 0;
  let currentChoices = [];
  let currentAnswerIndex = -1;
  let currentLevel = null;

  function shuffle(array) {
    const result = array.slice();
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function startQuiz(level) {
    currentLevel = level;
    const pool = teaQuizQuestions.filter(q => q.level === level);
    const roundSize = Math.min(QUESTIONS_PER_ROUND, pool.length);
    questions = shuffle(pool).slice(0, roundSize);
    currentIndex = 0;
    score = 0;
    levelBadge.textContent = LEVEL_LABELS[level] || '';
    startScreen.hidden = true;
    resultEl.hidden = true;
    playArea.hidden = false;
    questionBox.hidden = false;
    renderQuestion();
  }

  function showLevelSelect() {
    resultEl.hidden = true;
    playArea.hidden = true;
    startScreen.hidden = false;
  }

  function renderQuestion() {
    const total = questions.length;
    const q = questions[currentIndex];
    const rawChoices = q.type === 'tf' ? ['〇', '×'] : q.choices;
    const order = shuffle(rawChoices.map((_, i) => i));
    currentChoices = order.map(i => rawChoices[i]);
    currentAnswerIndex = order.indexOf(q.answerIndex);

    progressText.textContent = `問題 ${currentIndex + 1} / ${total}`;
    progressFill.style.width = `${(currentIndex / total) * 100}%`;

    questionEl.textContent = q.question;
    feedbackEl.hidden = true;
    choicesEl.innerHTML = '';

    currentChoices.forEach((choiceLabel, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz-choice-btn';
      btn.textContent = choiceLabel;
      btn.addEventListener('click', () => handleAnswer(index, btn));
      choicesEl.appendChild(btn);
    });
  }

  function handleAnswer(selectedIndex, selectedBtn) {
    const q = questions[currentIndex];
    const isCorrect = selectedIndex === currentAnswerIndex;

    if (isCorrect) {
      score += 1;
    }

    Array.from(choicesEl.children).forEach((btn, index) => {
      btn.disabled = true;
      if (index === currentAnswerIndex) {
        btn.classList.add('correct');
      } else if (index === selectedIndex) {
        btn.classList.add('incorrect');
      }
    });

    feedbackResultEl.textContent = isCorrect ? '正解！' : '残念、不正解…';
    feedbackResultEl.classList.toggle('is-correct', isCorrect);
    feedbackResultEl.classList.toggle('is-incorrect', !isCorrect);
    feedbackExplanationEl.textContent = q.explanation;
    feedbackEl.hidden = false;

    nextBtn.textContent = currentIndex + 1 < questions.length ? '次の問題へ' : '結果を見る';
  }

  function goNext() {
    currentIndex += 1;
    if (currentIndex >= questions.length) {
      showResult();
    } else {
      renderQuestion();
    }
  }

  function showResult() {
    progressFill.style.width = '100%';
    progressText.textContent = `問題 ${questions.length} / ${questions.length}`;
    questionBox.hidden = true;
    resultEl.hidden = false;

    const total = questions.length;
    resultTitleEl.textContent = `${LEVEL_LABELS[currentLevel] || ''} クイズ終了！`;
    resultScoreEl.textContent = `${total}問中 ${score}問正解`;

    const rate = score / total;
    let message;
    if (rate === 1) {
      message = 'パーフェクト！日本茶マスターですね。';
    } else if (rate >= 0.7) {
      message = 'かなり詳しいですね。日本茶ラボ系向きかも？';
    } else if (rate >= 0.4) {
      message = 'まずまず！和茶話茶会でお茶談義してみませんか。';
    } else {
      message = 'これを機に、日本茶の世界をのぞいてみませんか。';
    }
    resultMessageEl.textContent = message;
  }

  beginnerBtn.addEventListener('click', () => startQuiz('beginner'));
  intermediateBtn.addEventListener('click', () => startQuiz('intermediate'));
  nextBtn.addEventListener('click', goNext);
  restartBtn.addEventListener('click', () => startQuiz(currentLevel));
  levelSelectBtn.addEventListener('click', showLevelSelect);
});
