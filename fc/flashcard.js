let flashcards = [];
let savedFlashcardSets = [];
let currentSetName = null;

// Gắn sự kiện cho các nút
document.getElementById("setupCardsButton").addEventListener("click", setupCards);
document.getElementById("saveFlashcardsButton").addEventListener("click", saveCurrentFlashcards);
document.getElementById("startGameButton").addEventListener("click", startGame);
document.getElementById("resetGameButton").addEventListener("click", resetGame);

function setupCards() {
    const cardCount = document.getElementById("cardCount").value;
    const formContainer = document.getElementById("formContainer");
    const cardForm = document.getElementById("cardForm");

    if (cardCount <= 0) {
        alert("Số lượng thẻ bài phải lớn hơn 0!");
        return;
    }

    cardForm.innerHTML = "";
    for (let i = 0; i < cardCount; i++) {
        const cardDiv = document.createElement("div");
        cardDiv.innerHTML = `
            <label for="keyword${i}">Từ khóa ${i + 1}:</label>
            <input type="text" id="keyword${i}" required><br>
            <label for="definition${i}">Định nghĩa ${i + 1}:</label>
            <input type="text" id="definition${i}" required><br><br>
        `;
        cardForm.appendChild(cardDiv);
    }

    formContainer.classList.remove("hidden");
}

function saveCurrentFlashcards() {
    const cardForm = document.getElementById("cardForm");
    const inputs = cardForm.querySelectorAll("input");
    const cardCount = inputs.length / 2;

    flashcards = [];
    for (let i = 0; i < cardCount; i++) {
        const keyword = document.getElementById(`keyword${i}`).value;
        const definition = document.getElementById(`definition${i}`).value;

        if (!keyword || !definition) {
            alert("Vui lòng điền đầy đủ từ khóa và định nghĩa!");
            return;
        }

        flashcards.push({ keyword, definition });
    }

    const setName = prompt("Nhập tên cho bộ flashcards này:");
    if (!setName) {
        alert("Tên bộ flashcards không được để trống!");
        return;
    }

    savedFlashcardSets.push({ name: setName, cards: [...flashcards] });
    currentSetName = setName;
    renderFlashcardList();
    alert(`Bộ flashcards "${setName}" đã được lưu!`);
}

function renderFlashcardList() {
    const flashcardList = document.getElementById("flashcardList");
    flashcardList.innerHTML = "";

    if (savedFlashcardSets.length === 0) {
        flashcardList.innerHTML = "<p>Chưa có bộ flashcards nào được lưu.</p>";
        return;
    }

    savedFlashcardSets.forEach((set, index) => {
        const setDiv = document.createElement("div");
        setDiv.innerHTML = `
            <span>${set.name}</span>
            <button onclick="loadFlashcardSet(${index})">Chơi</button>
            <button onclick="renameFlashcardSet(${index})">Đổi tên</button>
            <button onclick="deleteFlashcardSet(${index})">Xóa</button>
        `;
        flashcardList.appendChild(setDiv);
    });
}

function loadFlashcardSet(index) {
    flashcards = [...savedFlashcardSets[index].cards];
    currentSetName = savedFlashcardSets[index].name;
    startGame();
}

function renameFlashcardSet(index) {
    const newName = prompt("Nhập tên mới cho bộ flashcards:", savedFlashcardSets[index].name);
    if (newName) {
        savedFlashcardSets[index].name = newName;
        renderFlashcardList();
    }
}

function deleteFlashcardSet(index) {
    if (confirm(`Bạn có chắc chắn muốn xóa bộ flashcards "${savedFlashcardSets[index].name}"?`)) {
        savedFlashcardSets.splice(index, 1);
        renderFlashcardList();
    }
}

function startGame() {
    const gameContainer = document.getElementById("gameContainer");
    const cardDisplay = document.getElementById("cardDisplay");

    cardDisplay.innerHTML = "";
    flashcards.forEach((card, index) => {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("flashcard");
        cardDiv.innerHTML = `<p>${card.keyword}</p>`;
        cardDiv.addEventListener("click", () => {
            if (cardDiv.classList.contains("flipped")) {
                cardDiv.innerHTML = `<p>${card.keyword}</p>`;
            } else {
                cardDiv.innerHTML = `<p>${card.definition}</p>`;
            }
            cardDiv.classList.toggle("flipped");
        });
        cardDisplay.appendChild(cardDiv);
    });

    gameContainer.classList.remove("hidden");
    document.getElementById("formContainer").classList.add("hidden");
}

function resetGame() {
    startGame();
}