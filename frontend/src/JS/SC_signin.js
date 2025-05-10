import axiosInstance from './config.js' 

document.getElementById("signInBtn").addEventListener("click", function (event) {
    event.preventDefault();

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    //Check Valid Username
    const emailIsValid =
    /^[^\s@]+@[^\s@]+\.(com|net|org|edu|gov|mil|info|io|co)$/i.test(email);
    //Check Valid Password
    const passwordIsValid = /((?=.*\d)|(?=.*\w+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(password);

    if (!email || !password) {
      Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: "Please fill in both username and password.",
        confirmButtonColor: "#d33",
      });
      return;
    } else if (!emailIsValid) {
      Swal.fire({
        icon: "error",
        title: "Invalid Email",
        text: "Email must be 5-255 characters",
        confirmButtonColor: "#d33",
      });
      return;  // ← هذا يمنع استمرار الكود
    }else if (!passwordIsValid) {
      Swal.fire({
        icon: "warning",
        title: "Weak Password ⚠️",
        text: "Your password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number or symbol.",
        confirmButtonColor: "#efb700",
      });
      return;  // ← هذا يمنع استمرار الكود
    }

    axiosInstance.post(`/api/v1/user/login`, {
      "email": email,
      "password": password
    })
    .then((response) => {
      // Save token to local storage
      localStorage.setItem("accessToken", response.data.accessToken);
      
      Swal.fire({
        icon: "success",
        title: "Login Successful ✅",
        text: "Welcome",
        confirmButtonText: "OK",
        confirmButtonColor: "#efb700",
      }) .then(() => {
        window.location.href = "/src/HTML/home.html";
      })

    })
    .catch((error) => {
      console.error("❌ Login Error:", error);

      let errorMessage = "An error occurred. Please try again.";

      if (error.response) {
        console.error("Error Response Data:", error.response.data);
        console.error("Status Code:", error.response.status);

        if (error.response.status === 400) {
          errorMessage = "Invalid username or password.";
        }else if (error.response.status === 401) {
          errorMessage = "Incorrect password. Please try again.";
       }else if (error.response.status === 429) {
          errorMessage = "Too many login attempts. Please try again later.";
        } else if (error.response.status === 404) {
          errorMessage = "User not found, not registered.";
        } else if (error.response.status === 451) {
          errorMessage = "Your data under review.";
        } else if (error.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      }

      Swal.fire({
        icon: "error",
        title: "Login Failed ❌",
        text: errorMessage,
        confirmButtonColor: "#d33",
      }) .then(() => {
        document.getElementById("password").value = "";
      })
    });
  });

//toggle for password field
document
.getElementById("togglePassword")
.addEventListener("click", function () {
  const passwordInput = document.getElementById("password");
  const eyeIcon = document.getElementById("eyeIcon");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeIcon.classList.remove("fa-eye-slash");
    eyeIcon.classList.add("fa-eye");
  } else {
    passwordInput.type = "password";
    eyeIcon.classList.remove("fa-eye");
    eyeIcon.classList.add("fa-eye-slash");
  }
});