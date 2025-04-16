const validUsername = "admin";
const validPassword = "123456789";

document
  .getElementById("signInBtn")
  .addEventListener("click", function (event) {
    event.preventDefault();

    const account = document.getElementById("account").value.trim();
    const password = document.getElementById("password").value.trim();

    if (account === validUsername && password === validPassword) {
      Swal.fire({
        icon: "success",
        title: "Login Successful ✅",
        text: "Welcome back!",
        confirmButtonText: "OK",
        confirmButtonColor: "#efb700",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Login Failed ❌",
        text: "Incorrect username or password.",
        confirmButtonText: "Try Again",
        confirmButtonColor: "#d33",
      });
    }
  });
