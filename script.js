pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
const pdfFiles = { questions: 'quiz.pdf', answers: 'answer.pdf' };
let questionDoc = null, answerDoc = null, currentIndex = 0, totalQuizzes = 0, displayOrder = [], starredItems = new Set();

async function loadPDFs() {
    try {
        questionDoc = await pdfjsLib.getDocument(pdfFiles.questions).promise;
        answerDoc = await pdfjsLib.getDocument(pdfFiles.answers).promise;
        totalQuizzes = Math.min(questionDoc.numPages, answerDoc.numPages);
        displayOrder = [...Array(totalQuizzes).keys()];
        renderQuiz(); buildGrid();
    } catch (err) { console.error(err); }
}

async function renderQuiz() {
    if (!questionDoc || !answerDoc) return;
    const actualIdx = displayOrder[currentIndex];
    document.getElementById('mainScroll').scrollTop = 0;
    document.getElementById('answerSection').classList.add('hidden-viewport');
    document.getElementById('leakBtn').innerText = "Leak Answer";
    const qPage = await questionDoc.getPage(actualIdx + 1);
    await drawPage(qPage, 'questionCanvas');
    const aPage = await answerDoc.getPage(actualIdx + 1);
    await drawPage(aPage, 'answerCanvas');
    document.getElementById('progress').innerText = `${currentIndex + 1} / ${totalQuizzes}`;
    document.getElementById('starBtn').classList.toggle('active', starredItems.has(actualIdx));
}

async function drawPage(page, canvasId) {
    const canvas = document.getElementById(canvasId);
    const context = canvas.getContext('2d');
    const wrapper = canvas.parentElement;
    wrapper.style.height = "auto";
    const containerWidth = wrapper.clientWidth || 600;

    // Use initial viewport to get correct proportions first
    const unscaledViewport = page.getViewport({ scale: 1, rotation: page.rotate });
    const scale = containerWidth / unscaledViewport.width;
    const viewport = page.getViewport({ scale: scale * 2, rotation: page.rotate });

    canvas.width = viewport.width;
    canvas.height = viewport.height;
    wrapper.style.height = (viewport.height / 2) + "px";
    await page.render({ canvasContext: context, viewport: viewport }).promise;
}

function toggleAnswer() {
    const sec = document.getElementById('answerSection');
    const isHidden = sec.classList.toggle('hidden-viewport');
    document.getElementById('leakBtn').innerText = isHidden ? "Leak Answer" : "Hide Answer";
    if (!isHidden) {
        setTimeout(() => { document.getElementById('mainScroll').scrollTo({ top: document.getElementById('mainScroll').scrollHeight, behavior: 'smooth' }); }, 150);
    }
}

function nextQuiz() { if (currentIndex < totalQuizzes - 1) { currentIndex++; renderQuiz(); } }
function prevQuiz() { if (currentIndex > 0) { currentIndex--; renderQuiz(); } }
function toggleStar() {
    const idx = displayOrder[currentIndex];
    starredItems.has(idx) ? starredItems.delete(idx) : starredItems.add(idx);
    document.getElementById('starBtn').classList.toggle('active', starredItems.has(idx));
    buildGrid();
}
function setMode(mode) {
    displayOrder = (mode === 'random') ? displayOrder.sort(() => Math.random() - 0.5) : [...Array(totalQuizzes).keys()];
    currentIndex = 0; renderQuiz();
}
function buildGrid() {
    const table = document.getElementById('gridTable');
    table.innerHTML = ""; let row;
    for (let i = 0; i < totalQuizzes; i++) {
        if (i % 10 === 0) row = table.insertRow();
        const cell = row.insertCell(); cell.innerText = i + 1;
        if (starredItems.has(i)) cell.classList.add('starred');
        cell.onclick = () => { currentIndex = displayOrder.indexOf(i); renderQuiz(); toggleGrid(); };
    }
}
function toggleGrid() { document.getElementById('gridOverlay').classList.toggle('hidden'); }
window.addEventListener('resize', renderQuiz);
loadPDFs();