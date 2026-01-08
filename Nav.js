const urlParams = new URLSearchParams(window.location.search);
const Subject = urlParams.get('s');

/**
 * Opens the Viewer Page with specific PDF files.
 * * @param {string} qFile - The filename of the Question PDF (e.g., 'quiz1.pdf')
 * @param {string} aFile - The filename of the Answer PDF (e.g., 'ans1.pdf')
 */ 
function openExam(qFile, aFile) {
    // 1. Define the name of your viewer HTML file (the one we built previously)
    const viewerPage = "display.html"; 

    // 2. Encode parameters to be URL-safe
    const qParam = encodeURIComponent(qFile);
    const aParam = encodeURIComponent(aFile);

    // 3. Construct the URL: index.html?q=quiz1.pdf&a=ans1.pdf
    const url = `${viewerPage}?q=${qParam}&a=${aParam}&s=${Subject}`;

    // 4. Open in the same tab (use '_blank' for new tab)
    window.open(url, '_self');
}

// function openExam(qFile, aFile) {
//     const url = `index.html?q=${encodeURIComponent(qFile)}&a=${encodeURIComponent(aFile)}`;
//     window.location.href = url;
// }

function openSubject(SubjectName) {
            const Subject = encodeURIComponent(SubjectName);
            const url = `Nav.html?s=${Subject}`;
            window.open(url, '_self');
        }

const HeaderText = document.querySelector('.main-header>h1');

if(Subject==null){
    HeaderText.innerHTML = `ExamPOG`;
} else {
    HeaderText.innerHTML = `ExamPOG ${Subject}`;
    document.title=`ExamPOG ${Subject}`;
}
