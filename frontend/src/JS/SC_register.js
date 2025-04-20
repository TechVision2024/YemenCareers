const input = document.getElementById("customFileInput");
const label = document.getElementById("fileName");

input.addEventListener("change", function () {
  if (this.files.length > 0) {
    label.textContent = this.files[0].name;
  } else {
    label.textContent = "اختيار الصورة";
  }
});

document.getElementById("signup").addEventListener("click", function (event) {
  event.preventDefault();

  const company_name = document.getElementById("company-name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirm_password = document
    .getElementById("confirm-password")
    .value.trim();
  //Check Name no have any numbers or symbols
  const nameIsValid = /^[a-zA-Z\u0600-\u06FF\s]+$/.test(company_name);
  //Check Valid Email
  const emailIsValid =
    /^[^\s@]+@[^\s@]+\.(com|net|org|edu|gov|mil|info|io|co)$/i.test(email);

  if (!company_name || !email || !password || !confirm_password) {
    Swal.fire({
      icon: "warning",
      title: "حقول ناقصة",
      text: "يرجى تعبئة جميع الحقول.",
      confirmButtonColor: "#efb700",
    });
  } else if (!nameIsValid) {
    Swal.fire({
      icon: "error",
      title: "اسم الشركة غير صالح",
      text: "يجب أن لا يحتوي اسم الشركة على أرقام أو رموز.",
      confirmButtonColor: "#d33",
    });
  } else if (!emailIsValid) {
    Swal.fire({
      icon: "error",
      title: "البريد الإلكتروني غير صالح",
      text: "يرجى إدخال بريد إلكتروني صحيح.",
      confirmButtonColor: "#d33",
    });
  } else if (password.length < 8) {
    Swal.fire({
      icon: "warning",
      title: "كلمة المرور ضعيفة ⚠️",
      text: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.",
      confirmButtonColor: "#efb700",
    });
  } else if (confirm_password != password) {
    Swal.fire({
      icon: "error",
      title: "تأكيد كلمة المرور ليست متطابقة لكلمة المرور",
      text: "يرجى إدخال تأكيد كلمة المرور الصحيحة.",
      confirmButtonColor: "#d33",
    });
  }
});

//toggle for password field
document
  .getElementById("togglePassword1")
  .addEventListener("click", function () {
    const passwordInput = document.getElementById("password");
    const eyeIcon = document.getElementById("eyeIcon1");

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

// toggle for confirm password field
document
  .getElementById("togglePassword2")
  .addEventListener("click", function () {
    const passwordInput = document.getElementById("confirm-password");
    const eyeIcon = document.getElementById("eyeIcon2");

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
