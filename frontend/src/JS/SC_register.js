import axiosInstance from './config.js' 

const input = document.getElementById("customFileInput");
const profileImage = document.getElementById("profileImage");

input.addEventListener("change", function () {
  if (this.files.length > 0) {
    profileImage.textContent = this.files[0].name;
  } else {
    profileImage.textContent = "اختيار الصورة";
  }
});

document.getElementById("signup").addEventListener("click", function (event) {
  event.preventDefault();

  const company_name = document.getElementById("company-name").value.trim();
  const description = document.getElementById("description").value.trim();
  const email = document.getElementById("email").value.trim();
  const company_type = document.getElementById("company_type").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const website = document.getElementById("website").value.trim();
  const social_url_1 = document.getElementById("social_url_1").value.trim();
  const social_url_2 = document.getElementById("social_url_2").value.trim();
  const social_url_3 = document.getElementById("social_url_3").value.trim();
  const social_url_4 = document.getElementById("social_url_4").value.trim();
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
  } else if (!nameIsValid ||( company_name.length < 2 || company_name.length > 255) ) {
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
  } else if (description.length < 10 || description.length > 1000) {
    Swal.fire({
      icon: "warning",
      title: "الوصف ناقص",
      text: "يجب ان يحتوي الوصف على الاقل 10 احرف",
      confirmButtonColor: "#efb700",
    });
  } else if (company_type.length < 3 || company_type.length > 100) {
    Swal.fire({
      icon: "warning",
      title: "نوع الوظيفة",
      text: "يجب ان يحتوي توع الوظيفة على الاقل 3 احرف",
      confirmButtonColor: "#efb700",
    });
  } else if (address.length < 3 || address.length > 255) {
    Swal.fire({
      icon: "warning",
      title: "العنوان ناقص",
      text: "يجب ان يحتوي العنوان على الاقل 3 احرف",
      confirmButtonColor: "#efb700",
    });
  } 
  
  else {
    const formData = new FormData();
    formData.append("name", company_name);
    formData.append("description", description);
    formData.append("email", email);
    formData.append("company_type", company_type);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("password", password);
    formData.append("confirmation", confirm_password);

      // رفع الصورة إن وُجدت
    if (input.files.length > 0) {
      formData.append("profileImage", input.files[0]);
    }

    if(website){
      formData.append("website", website);
    }
    
    if(social_url_1) {
      formData.append("social_url_1", social_url_1);
    }
    if(social_url_2) {
      formData.append("social_url_2", social_url_2);
    }
    if(social_url_3) {
      formData.append("social_url_3", social_url_3);
    }
    if(social_url_4) {
      formData.append("social_url_4", social_url_4);
    }
    console.log(typeof(website));
    
    for (let pair of formData.entries()) {
  console.log(pair[0]+ ': ' + pair[1]);
}

    axiosInstance
      .post(`/api/v1/user/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        // Save token to local storage
        localStorage.setItem("accessToken", response.data.accessToken);

        Swal.fire({
          icon: "success",
          title: "Registration Successful 🎉",
          text: "Your account has been created!",
          confirmButtonColor: "#efb700",
        }).then(() => {
          window.location.href = "/src/HTML/signin.html";
        });
      })
      .catch((error) => {
        

        if (error.response) {
          const status = error.response.status;

          console.error("Error Response Data:", error.response.data);
          console.error("Status Code:", status);

          if (status === 302) {
            Swal.fire({
              icon: "error",
              title: "Username or Email Taken",
              text: "This username or email is already registered. Try another one!",
              confirmButtonColor: "#d33",
            });
          } else if (status === 400) {
            Swal.fire({
              icon: "warning",
              title: "Invalid Request",
              text: "Please check your inputs and try again.",
              confirmButtonColor: "#efb700",
            });
          } else if (status === 429) {
            Swal.fire({
              icon: "error",
              title: "Too Many Requests",
              text: "You're making too many requests! Try again later.",
              confirmButtonColor: "#d33",
            });
          } else if (status === 500) {
            Swal.fire({
              icon: "error",
              title: "Server Error",
              text: "Something went wrong on our end. Please try again later.",
              confirmButtonColor: "#d33",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Unknown Error",
              text: "An unexpected error occurred. Please try again.",
              confirmButtonColor: "#d33",
            });
          }
        } else if (error.response && error.response.data && error.response.data.message) {
          console.error("No Response Received:", error.request);
          Swal.fire({
          icon: "error",
          title: "حدث خطأ في الإدخال",
          text: error.response.data.message,
          confirmButtonColor: "#d33",
        });
        }
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
