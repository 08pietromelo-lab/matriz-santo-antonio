const exploreButton = document.querySelector('.hero .button');
exploreButton.addEventListener('click', (event) => {
  event.preventDefault();
  document.body.classList.add('exploring');
  window.setTimeout(() => {
    document.querySelector('#explorar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 80);
});

const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.textContent = isOpen ? '×' : '☰';
});

mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = '☰';
  });
});

// Reading progress and back-to-top control
const readingProgress = document.getElementById('readingProgress');
const backToTop = document.getElementById('backToTop');
function updateScrollUI() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  readingProgress.style.width = `${progress}%`;
  backToTop.classList.toggle('visible', window.scrollY > 500);
}
window.addEventListener('scroll', updateScrollUI, { passive: true });
updateScrollUI();

// Photo lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
document.querySelectorAll('.gallery-item img').forEach((img) => {
  img.addEventListener('click', (event) => {
    event.preventDefault();
    lightboxImage.src = img.currentSrc || img.src;
    lightboxImage.alt = img.alt;
    lightboxCaption.textContent = img.alt;
    lightbox.classList.add('open');
  });
});
function closeLightbox() {
  lightbox.classList.remove('open');
  lightboxImage.src = '';
}
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox();
});

// Short knowledge quiz
const quizQuestions = [
  { q: 'Em qual cidade fica a Matriz de Santo Antônio?', a: ['Ouro Preto', 'Tiradentes', 'Mariana'], correct: 1, info: 'A Matriz fica no Centro Histórico de Tiradentes, em Minas Gerais.' },
  { q: 'Segundo a Paróquia, de que ano data a primeira igreja construída no local?', a: ['1702', '1750', '1822'], correct: 0, info: 'A página de história da Paróquia indica 1702 para a primeira igreja no local.' },
  { q: 'Qual estilo artístico é especialmente associado à decoração da Matriz?', a: ['Art déco', 'Gótico moderno', 'Barroco'], correct: 2, info: 'A Matriz é reconhecida pela arte barroca e por sua talha ornamental.' },
  { q: 'Qual instituição tombou individualmente a Matriz em 1949?', a: ['IPHAN', 'IBGE', 'INMET'], correct: 0, info: 'A Matriz consta entre os bens tombados pelo Instituto do Patrimônio Histórico e Artístico Nacional.' }
];
let quizIndex = 0;
let quizPoints = 0;
let answered = false;
const quizQuestion = document.getElementById('quizQuestion');
const quizOptions = document.getElementById('quizOptions');
const quizFeedback = document.getElementById('quizFeedback');
const quizNext = document.getElementById('quizNext');
const quizStep = document.getElementById('quizStep');
const quizScore = document.getElementById('quizScore');

function renderQuestion() {
  const item = quizQuestions[quizIndex];
  answered = false;
  quizStep.textContent = `PERGUNTA ${quizIndex + 1} DE ${quizQuestions.length}`;
  quizScore.textContent = `PONTOS: ${quizPoints}`;
  quizQuestion.textContent = item.q;
  quizFeedback.textContent = 'Escolha uma resposta para continuar.';
  quizOptions.innerHTML = '';
  item.a.forEach((answer, index) => {
    const button = document.createElement('button');
    button.className = 'quiz-option';
    button.textContent = answer;
    button.addEventListener('click', () => chooseAnswer(index, button));
    quizOptions.appendChild(button);
  });
  quizNext.disabled = true;
  quizNext.querySelector('span').textContent = '→';
  quizNext.childNodes[0].textContent = quizIndex === quizQuestions.length - 1 ? 'VER RESULTADO ' : 'PRÓXIMA PERGUNTA ';
}
function chooseAnswer(index, selected) {
  if (answered) return;
  answered = true;
  const item = quizQuestions[quizIndex];
  [...quizOptions.children].forEach((button, i) => {
    button.disabled = true;
    if (i === item.correct) button.classList.add('correct');
  });
  if (index === item.correct) {
    quizPoints++;
    quizFeedback.textContent = `Resposta certa! ${item.info}`;
  } else {
    selected.classList.add('incorrect');
    quizFeedback.textContent = `Ainda não! ${item.info}`;
  }
  quizScore.textContent = `PONTOS: ${quizPoints}`;
  quizNext.disabled = false;
}
quizNext.addEventListener('click', () => {
  if (!answered) return;
  if (quizIndex < quizQuestions.length - 1) {
    quizIndex++;
    renderQuestion();
  } else {
    quizQuestion.textContent = `Você acertou ${quizPoints} de ${quizQuestions.length} perguntas!`;
    quizOptions.innerHTML = '';
    quizFeedback.textContent = quizPoints === quizQuestions.length
      ? 'Excelente! Você prestou atenção aos detalhes da história.'
      : 'Boa! Explore novamente a história e as fontes para descobrir mais detalhes.';
    quizNext.disabled = false;
    quizNext.querySelector('span').textContent = '↻';
    quizNext.childNodes[0].textContent = 'REFAZER QUIZ ';
    quizNext.onclick = () => { quizIndex = 0; quizPoints = 0; quizNext.onclick = null; renderQuestion(); };
  }
});
renderQuestion();

// If a deep link is opened directly, reveal the navigation.
if (window.location.hash && window.location.hash !== '#inicio') {
  document.body.classList.add('exploring');
}
