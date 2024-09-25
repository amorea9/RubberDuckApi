document.getElementById("userForm").addEventListener("submit", (e) => {
  //avoid reloading the page
  e.preventDefault();

  const userEmail = document.getElementById("userEmail").value;
  const userName = document.getElementById("userName").value;
  const userPassword = document.getElementById("userPassword").value;
  const user = { mail: "", name: "", password: "" };

  if (userEmail === "" || userName === "" || userPassword === "") {
    alert("Please make sure you have entered all required fields.");
  } else if (userPassword.length < 8) {
    alert("Password must be at least 8 characters long");
  } else if (!userEmail.includes("@") || !userEmail.includes(".")) {
    alert("This email address is invalid. Please make sure to enter a valid email address. Example: 'email@example.com'");
  } else if (userName.length > 15 || userName.length < 4) {
    alert("Username must be between 4 and 15 characters long");
  } else {
    alert(`User signed in. Welcome back ${userName}!`);
    user.mail = userEmail;
    user.name = userName;
    user.password = userPassword;
    localStorage.setItem("users", JSON.stringify(user));
    console.log(user);
  }
});
