const themeButton = document.getElementById('theme-toggle');
const body = document.body;
const progressFill = document.querySelector('.progress-fill');
const questionTitle = document.getElementById('question-title');
const answerContainer = document.getElementById('answer-options');
const questionIndex = document.getElementById('question-index');
const progressLabel = document.getElementById('progress-label');
const resultsSection = document.getElementById('resultados');
const resultSummary = document.getElementById('result-summary');
const resultList = document.getElementById('result-list');
const viewResultsBtn = document.getElementById('view-results-btn');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');

const questions = [
  {
    text: '¿Te distraes fácilmente con ruidos o estímulos visuales?',
    options: [
      { text: 'Casi siempre', values: { tdah: 2, tea: 1, ansiedad: 1 } },
      { text: 'A veces', values: { tdah: 1, tea: 1 } },
      { text: 'Rara vez', values: { dislexia: 0 } }
    ]
  },
  {
    text: '¿Te cuesta mantener la concentración durante tareas largas?',
    options: [
      { text: 'Sí, con frecuencia', values: { tdah: 2, ansiedad: 1 } },
      { text: 'Depende de la tarea', values: { tdah: 1 } },
      { text: 'No mucho', values: { tea: 0 } }
    ]
  },
  {
    text: '¿Te molestan ciertos sonidos, luces o texturas?',
    options: [
      { text: 'Sí, me afectan mucho', values: { tea: 2, ansiedad: 1 } },
      { text: 'A veces', values: { tea: 1 } },
      { text: 'No mucho', values: { tdah: 0 } }
    ]
  },
  {
    text: '¿Sueles hiperfocalizarte en temas que te interesan?',
    options: [
      { text: 'Sí, por horas', values: { tdah: 2, tea: 1 } },
      { text: 'Algunas veces', values: { tdah: 1 } },
      { text: 'No tanto', values: { ansiedad: 0 } }
    ]
  },
  {
    text: '¿Te resulta difícil leer o procesar textos largos?',
    options: [
      { text: 'Sí, prefiero formatos visuales', values: { dislexia: 2 } },
      { text: 'A veces', values: { dislexia: 1 } },
      { text: 'No, mi lectura es cómoda', values: { tdah: 0 } }
    ]
  }
];

const trends = [
  { label: 'TDAH', description: 'Atención activa y necesidad de estructura flexible.' },
  { label: 'TEA', description: 'Sensibilidad sensorial y comunicación diversa.' },
  { label: 'Ansiedad', description: 'Emociones intensas y atención al bienestar emocional.' },
  { label: 'Dislexia', description: 'Procesamiento del lenguaje con ritmo propio.' }
];

const answers = Array(questions.length).fill(null);
let currentQuestion = 0;

function updateTheme() {
  const isDark = body.classList.toggle('dark');
  themeButton.textContent = isDark ? 'Modo claro' : 'Modo oscuro';
}

function renderQuestion() {
  const question = questions[currentQuestion];
  questionTitle.textContent = question.text;
  questionIndex.textContent = `${currentQuestion + 1} de ${questions.length}`;
  const answered = answers[currentQuestion] !== null;
  const allAnswered = answers.every((answer) => answer !== null);
  progressLabel.textContent = `${Math.round((answers.filter((answer) => answer !== null).length / questions.length) * 100)}% completado`;
  progressFill.style.width = `${(answers.filter((answer) => answer !== null).length / questions.length) * 100}%`;
  nextBtn.disabled = !answered || currentQuestion === questions.length - 1;
  nextBtn.classList.toggle('hidden', currentQuestion === questions.length - 1);
  prevBtn.disabled = !answered || currentQuestion === 0;
  viewResultsBtn.classList.toggle('hidden', !allAnswered);

  answerContainer.innerHTML = '';
  question.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'answer-button';
    button.textContent = option.text;
    if (answers[currentQuestion] === index) {
      button.classList.add('active');
    }
    button.addEventListener('click', () => {
      answers[currentQuestion] = index;
      renderQuestion();
      computeResults();
    });
    answerContainer.appendChild(button);
  });

  if (!answered) {
    resultsSection.classList.add('hidden');
  }
}

function computeResults() {
  const allAnswered = answers.every((answer) => answer !== null);
  if (!allAnswered) {
    resultsSection.classList.add('hidden');
    return;
  }

  const totals = answers.reduce(
    (acc, answerIndex, index) => {
      const option = questions[index].options[answerIndex];
      Object.keys(option.values).forEach((key) => {
        acc[key] += option.values[key];
      });
      return acc;
    },
    { tdah: 0, tea: 0, ansiedad: 0, dislexia: 0 }
  );

  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  resultList.innerHTML = '';

  sorted.forEach(([key, value]) => {
    const trend = trends.find((item) => item.label.toLowerCase() === key);
    const article = document.createElement('article');
    article.className = 'result-card';
    article.innerHTML = `
      <h4>${trend.label}</h4>
      <p>${trend.description}</p>
      <p style="margin-top:0.75rem;font-weight:700;">Puntaje: ${value}</p>
    `;
    resultList.appendChild(article);
  });

  const [topTrend] = sorted;
  const descriptions = {
    tdah: 'Puedes tener más tendencia hacia el TDAH: una mente activa que se beneficia de estructura flexible y apoyos visuales.',
    tea: 'Tus respuestas apuntan a una tendencia TEA: sensibilidad sensorial y formas únicas de procesar el mundo que merecen respeto y acompañamiento.',
    ansiedad: 'Hay una señal más fuerte de Ansiedad: cuidar la calma, los límites y el autocuidado puede ayudarte a sentirte más seguro.',
    dislexia: 'La tendencia principal es Dislexia: utilizar formatos visuales, lectura pausada y herramientas adaptadas puede hacer la información más accesible.'
  };

  resultSummary.innerHTML = `
    <strong>Resultado sugerido:</strong>
    <p style="margin:0.75rem 0 0;">${descriptions[topTrend[0]]}</p>
  `;
  resultsSection.classList.remove('hidden');
  viewResultsBtn.classList.remove('hidden');
}

function toggleDetail(detailId) {
  const detail = document.getElementById(`detail-${detailId}`);
  if (detail) {
    detail.hidden = !detail.hidden;
  }
}

themeButton.addEventListener('click', updateTheme);
nextBtn.addEventListener('click', () => {
  currentQuestion = Math.min(currentQuestion + 1, questions.length - 1);
  renderQuestion();
});
prevBtn.addEventListener('click', () => {
  currentQuestion = Math.max(currentQuestion - 1, 0);
  renderQuestion();
});

renderQuestion();
