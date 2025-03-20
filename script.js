// Hiển thị modal đăng ký/đăng nhập
const loginButton = document.getElementById("loginButton");
const authModal = document.getElementById("authModal");
const closeModal = document.getElementById("closeModal");
const authForm = document.getElementById("authForm");
const authTitle = document.getElementById("authTitle");
const authSubmitButton = document.getElementById("authSubmitButton");
const toggleAuth = document.getElementById("toggleAuth");
const switchToRegister = document.getElementById("switchToRegister");

let isRegistering = false;

// Hiển thị modal khi nhấn nút "Đăng nhập"
loginButton.addEventListener("click", () => {
    authModal.classList.remove("hidden");
});

// Đóng modal khi nhấn nút đóng
closeModal.addEventListener("click", () => {
    authModal.classList.add("hidden");
});

// Chuyển đổi giữa đăng ký và đăng nhập
switchToRegister.addEventListener("click", (e) => {
    e.preventDefault();
    isRegistering = !isRegistering;

    if (isRegistering) {
        authTitle.textContent = "Đăng ký";
        authSubmitButton.textContent = "Đăng ký";
        toggleAuth.innerHTML = 'Đã có tài khoản? <a href="#" id="switchToRegister">Đăng nhập</a>';
    } else {
        authTitle.textContent = "Đăng nhập";
        authSubmitButton.textContent = "Đăng nhập";
        toggleAuth.innerHTML = 'Chưa có tài khoản? <a href="#" id="switchToRegister">Đăng ký</a>';
    }
});
// Xử lý đăng ký/đăng nhập
authForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    if (isRegistering) {
        // Đăng ký
        if (localStorage.getItem(`user_${username}`)) {
            alert("Tên đăng nhập đã tồn tại!");
        } else {
            localStorage.setItem(`user_${username}`, JSON.stringify({ password, history: [] }));
            alert("Đăng ký thành công! Vui lòng đăng nhập.");
            isRegistering = false;
            authTitle.textContent = "Đăng nhập";
            authSubmitButton.textContent = "Đăng nhập";
            toggleAuth.innerHTML = 'Chưa có tài khoản? <a href="#" id="switchToRegister">Đăng ký</a>';
        }
    } else {
        // Đăng nhập
        const userData = JSON.parse(localStorage.getItem(`user_${username}`));
        if (userData && userData.password === password) {
            localStorage.setItem("currentUser", username);
            alert(`Đăng nhập thành công! Chào mừng, ${username}`);
            authModal.classList.add("hidden");
        } else {
            alert("Tên đăng nhập hoặc mật khẩu không đúng!");
        }
    }
});

// Lưu lịch sử bài tập
function saveExerciseHistory(exercise) {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
        alert("Bạn cần đăng nhập để lưu lịch sử bài tập!");
        return;
    }

    const userData = JSON.parse(localStorage.getItem(`user_${currentUser}`));
    userData.history.push(exercise);
    localStorage.setItem(`user_${currentUser}`, JSON.stringify(userData));
}

// Lấy lịch sử bài tập
function getExerciseHistory() {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
        alert("Bạn cần đăng nhập để xem lịch sử bài tập!");
        return [];
    }

    const userData = JSON.parse(localStorage.getItem(`user_${currentUser}`));
    return userData.history || [];
}

// Kiểm tra trạng thái đăng nhập
function checkLoginStatus() {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
        loginButton.textContent = `Xin chào, ${currentUser}`;
        loginButton.href = "#";
        loginButton.addEventListener("click", () => {
            if (confirm("Bạn có muốn đăng xuất không?")) {
                localStorage.removeItem("currentUser");
                alert("Bạn đã đăng xuất.");
                location.reload();
            }
        });
    }
}

// Gọi hàm kiểm tra trạng thái đăng nhập khi tải trang
checkLoginStatus();