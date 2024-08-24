
// Password toggle functionality for Signup
const passwordField = document.getElementById('loginpassword');
const eyeOpenIcon = document.getElementById('eye-open');
const eyeClosedIcon = document.getElementById('eye-closed');

eyeOpenIcon.addEventListener('click', function () {
  passwordField.setAttribute('type', 'text');
  eyeOpenIcon.style.display = 'none';
  eyeClosedIcon.style.display = 'block';
});

eyeClosedIcon.addEventListener('click', function () {
  passwordField.setAttribute('type', 'password');
  eyeClosedIcon.style.display = 'none';
  eyeOpenIcon.style.display = 'block';
});

// Confirm password toggle functionality
const cpasswordField = document.getElementById('cpassword');
const cpasseyeOpenIcon = document.getElementById('eye-open-cpassword');
const cpasseyeClosedIcon = document.getElementById('eye-closed-cpassword');

cpasseyeOpenIcon.addEventListener('click', function () {
  cpasswordField.setAttribute('type', 'text');
  cpasseyeOpenIcon.style.display = 'none';
  cpasseyeClosedIcon.style.display = 'block';
});

cpasseyeClosedIcon.addEventListener('click', function () {
  cpasswordField.setAttribute('type', 'password');
  cpasseyeClosedIcon.style.display = 'none';
  cpasseyeOpenIcon.style.display = 'block';
});

// Signup functionality
document.getElementById('signup-form').addEventListener('submit', (e) => {
  e.preventDefault();
  console.log("Signup form submitted");

  const firstname = document.getElementById('first-name').value;
  const lastname = document.getElementById('last-name').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const cpassword = document.getElementById('cpassword').value;

  // Check if the passwords match
  if (password !== cpassword) {
    showToast("Passwords don't match!", " #2c2c2c", "error");
    return;
  }

  // Check if the user already exists
  if (localStorage.getItem(username)) {
    showToast("Username already exists.", " #2c2c2c", "error");
    return;
  }

  const user = {
    firstname: firstname,
    lastname: lastname,
    username: username,
    password: password
  };

  localStorage.setItem(username, JSON.stringify(user));

  showToast("Signup successful!", " #2c2c2c", "success");
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 2000);
  document.getElementById('signup-form').reset();
});



// Toastify function with animated bottom line and custom positioning
function showToast(message, background, type) {
  Toastify({
    text: message,
    duration: 3000,
    gravity: "top", // Positioning the toast 60% from the top
    position: "center",
    style: {
      background: background,
      top: "60%",
    },
    className: `toast-with-timer ${type}`,
    onClick: function () { } // Callback for click events
  }).showToast();
}


document.querySelectorAll('.logout').addEventListener('click', logout);

function logout() {
  localStorage.removeItem('authToken');
  window.location.href = 'login.html'; // If `login.html` is in the root directory

}
