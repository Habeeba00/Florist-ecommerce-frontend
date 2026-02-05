const loginForm = document.querySelector(".form.login");
const registerForm = document.querySelector(".form.register");

const goRegister = document.getElementById("goRegister");
const goLogin = document.getElementById("goLogin");

function showRegister() {
  loginForm.classList.remove("active");

  setTimeout(() => {
    registerForm.classList.add("active");
  }, 10);
}

function showLogin() {
  registerForm.classList.remove("active");

  setTimeout(() => {
    loginForm.classList.add("active");
  }, 10);
}

goRegister.addEventListener("click", showRegister);
goLogin.addEventListener("click", showLogin);

// ========================
// Switch Forms
// ========================
const loginFormUI = document.querySelector(".form.login");
const registerFormUI = document.querySelector(".form.register");

document.getElementById("goRegister").addEventListener("click", () => {
  loginFormUI.classList.remove("active");
  registerFormUI.classList.add("active");
});

document.getElementById("goLogin").addEventListener("click", () => {
  registerFormUI.classList.remove("active");
  loginFormUI.classList.add("active");
});

// ========================
// Helpers
// ========================
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(pass) {
  return pass.length >= 6;
}

// ========================
// Register
// ========================
document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim().toLowerCase();
  const password = document.getElementById("regPassword").value;
  
  // Reference the HTML element where the message will appear
  const msgBox = document.getElementById("form-message"); 
  
  // Reset message box style and text
  msgBox.innerText = "";
  msgBox.style.color = "red";

  // Validation
  if (name.length < 3) {
    msgBox.innerText = "Name must be at least 3 characters";
    return;
  }

  if (!isValidEmail(email)) {
    msgBox.innerText = "Please enter a valid email";
    return;
  }

  if (!isValidPassword(password)) {
    msgBox.innerText = "Password must be at least 6 characters";
    return;
  }

  let users = getUsers();

  // check if email already exists
  const exists = users.find(u => u.email === email);
  if (exists) {
    msgBox.innerText = "This email is already registered!";
    return;
  }

  // create user
  const newUser = {
    id: Date.now(),
    name,
    email,
    password 
  };

  users.push(newUser);
  saveUsers(users);

  // Success state
  msgBox.style.color = "green";
  msgBox.innerText = "Account created successfully ✅";

  // Small delay so the user can actually read the success message before switching forms
  setTimeout(() => {
    registerFormUI.classList.remove("active");
    loginFormUI.classList.add("active");
    
    // clear inputs and message
    this.reset();
    msgBox.innerText = "";
  }, 1500); 
});

// ========================
// Login
// ========================
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value;
  const rememberMe = document.getElementById("rememberMe").checked;

  // Reference the HTML element for messages
  const loginMsg = document.getElementById("login-message");
  
  // Reset message state
  loginMsg.innerText = "";
  loginMsg.style.color = "red";

  if (username === "" || password === "") {
    loginMsg.innerText = "Please fill all fields";
    return;
  }

  const users = getUsers();

  const user = users.find(u =>
    (u.email === username.toLowerCase() || u.name.toLowerCase() === username.toLowerCase())
    && u.password === password
  );

  if (!user) {
    loginMsg.innerText = "Invalid username/email or password ❌";
    return;
  }

  // Save user session
  sessionStorage.setItem("currentUser", JSON.stringify(user));

  if (rememberMe) {
    localStorage.setItem("rememberUser", JSON.stringify(user));
  } else {
    localStorage.removeItem("rememberUser");
  }

  // Success state
  loginMsg.style.color = "green";
  loginMsg.innerText = "Login successful! Redirecting...";

  this.reset();

  // Redirect to home.html after a short delay
  setTimeout(() => {
    window.location.href = "home.html";
  }, 1200);
});

// ========================
// Auto Login if remembered
// ========================
window.addEventListener("load", () => {
  const remembered = localStorage.getItem("rememberUser");
  if (remembered) {
    sessionStorage.setItem("currentUser", remembered);
    const user = JSON.parse(remembered);
    console.log("Auto login as:", user.name);
  }
});


function logout() {
  sessionStorage.removeItem("currentUser");

  alert("Logged out successfully 👋");
}

window.logout = logout;
