let quizzes = [];
let currentQuizIndex = null;

// Gắn sự kiện cho các nút
document.getElementById("createQuizButton").addEventListener("click", showCreateQuiz);
document.getElementById("showQuizListButton").addEventListener("click", showQuizList);
document.getElementById("generateQuestionsButton").addEventListener("click", generateQuestions);
document.getElementById("saveQuizButton").addEventListener("click", saveQuiz);
document.getElementById("goBackButton").addEventListener("click", goBack);
document.getElementById("goBackFromListButton").addEventListener("click", goBack);
document.getElementById("submitQuizButton").addEventListener("click", submitQuiz);
document.getElementById("goBackFromQuizButton").addEventListener("click", goBack);
document.getElementById("retryQuizButton").addEventListener("click", retryQuiz);
document.getElementById("goBackFromResultButton").addEventListener("click", goBack);

function showCreateQuiz() {
    document.getElementById("mainMenu").classList.add("hidden");
    document.getElementById("createQuiz").classList.remove("hidden");
}

function goBack() {
    document.querySelectorAll(".container").forEach(container => {
        container.classList.add("hidden");
    });
    document.getElementById("mainMenu").classList.remove("hidden");
    renderQuizList();
}

function generateQuestions() {
    const quizName = document.getElementById("quizName").value;
    const numberOfQuestions = document.getElementById("numberOfQuestions").value;
    const questionsContainer = document.getElementById("questionsContainer");

    if (!quizName || numberOfQuestions <= 0) {
        alert("Vui lòng nhập tên bài tập và số lượng câu hỏi hợp lệ!");
        return;
    }

    questionsContainer.innerHTML = "";
    for (let i = 0; i < numberOfQuestions; i++) {
        const questionDiv = document.createElement("div");
        questionDiv.innerHTML = `
            <label for="question${i}">Câu hỏi ${i + 1}:</label>
            <input type="text" id="question${i}" required><br>
            <label>Đáp án A:</label>
            <input type="text" id="answer${i}A" required><br>
            <label>Đáp án B:</label>
            <input type="text" id="answer${i}B" required><br>
            <label>Đáp án C:</label>
            <input type="text" id="answer${i}C" required><br>
            <label>Đáp án D:</label>
            <input type="text" id="answer${i}D" required><br>
            <label>Đáp án đúng:</label>
            <select id="correctAnswer${i}">
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
            </select>
        `;
        questionsContainer.appendChild(questionDiv);
    }

    questionsContainer.classList.remove("hidden");
    document.getElementById("saveQuizButton").classList.remove("hidden");
}

function saveQuiz() {
    const quizName = document.getElementById("quizName").value;
    const numberOfQuestions = document.getElementById("numberOfQuestions").value;
    const questions = [];

    for (let i = 0; i < numberOfQuestions; i++) {
        const questionText = document.getElementById(`question${i}`).value;
        const answerA = document.getElementById(`answer${i}A`).value;
        const answerB = document.getElementById(`answer${i}B`).value;
        const answerC = document.getElementById(`answer${i}C`).value;
        const answerD = document.getElementById(`answer${i}D`).value;
        const correctAnswer = document.getElementById(`correctAnswer${i}`).value;

        if (!questionText || !answerA || !answerB || !answerC || !answerD) {
            alert("Vui lòng điền đầy đủ câu hỏi và đáp án!");
            return;
        }

        questions.push({
            question: questionText,
            answers: { A: answerA, B: answerB, C: answerC, D: answerD },
            correct: correctAnswer
        });
    }

    quizzes.push({ name: quizName, questions });
    alert("Bài tập đã được lưu!");
    goBack();
}

function showQuizList() {
    document.getElementById("mainMenu").classList.add("hidden");
    document.getElementById("quizList").classList.remove("hidden");
    renderQuizList();
}

function renderQuizList() {
    const quizContainer = document.getElementById("quizContainer");
    quizContainer.innerHTML = "";

    if (quizzes.length === 0) {
        quizContainer.innerHTML = "<p>Chưa có bài tập nào được tạo.</p>";
        return;
    }

    quizzes.forEach((quiz, index) => {
        const quizDiv = document.createElement("div");
        quizDiv.innerHTML = `
            <span>${quiz.name}</span>
            <button onclick="startQuiz(${index})">Làm</button>
            <button onclick="deleteQuiz(${index})">Xóa</button>
        `;
        quizContainer.appendChild(quizDiv);
    });
}

function startQuiz(index) {
    currentQuizIndex = index;
    const quiz = quizzes[index];
    const quizQuestions = document.getElementById("quizQuestions");
    quizQuestions.innerHTML = "";

    quiz.questions.forEach((question, i) => {
        const questionDiv = document.createElement("div");
        questionDiv.innerHTML = `
            <p>${i + 1}. ${question.question}</p>
            <label><input type="radio" name="answer${i}" value="A"> A: ${question.answers.A}</label><br>
            <label><input type="radio" name="answer${i}" value="B"> B: ${question.answers.B}</label><br>
            <label><input type="radio" name="answer${i}" value="C"> C: ${question.answers.C}</label><br>
            <label><input type="radio" name="answer${i}" value="D"> D: ${question.answers.D}</label><br>
        `;
        quizQuestions.appendChild(questionDiv);
    });

    document.getElementById("quizList").classList.add("hidden");
    document.getElementById("startQuiz").classList.remove("hidden");
}

function submitQuiz() {
    const quiz = quizzes[currentQuizIndex];
    let correctCount = 0;

    quiz.questions.forEach((question, i) => {
        const selectedAnswer = document.querySelector(`input[name="answer${i}"]:checked`);
        if (selectedAnswer && selectedAnswer.value === question.correct) {
            correctCount++;
        }
    });

    document.getElementById("startQuiz").classList.add("hidden");
    document.getElementById("quizResult").classList.remove("hidden");

    document.getElementById("resultSummary").innerHTML = `
        <p>Bạn đã trả lời đúng ${correctCount}/${quiz.questions.length} câu hỏi.</p>
    `;
}

function deleteQuiz(index) {
    quizzes.splice(index, 1);
    renderQuizList();
}

function retryQuiz() {
    startQuiz(currentQuizIndex);
}