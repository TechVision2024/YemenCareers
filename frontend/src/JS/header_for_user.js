document.addEventListener("DOMContentLoaded", function () {
  const userHeaderHTML = ` <!-- الهيدر -->
    <header
      class="box-shadow shadow-md h-24 flex justify-between items-center md:h-19 md:px-6 lg:h-27 lg:px-12 xl:px-10"
    >
      <!-- الجانب الايمن للشاشات الكبيرة -->
      <ul id = "myList"
        class="flex items-center pt-4 md:space-x-6 lg:space-x-8 xl:space-x-8"
      >
        <li
          class="text-light-blue font-bold text-3xl pr-3 sm:text-4xl sm:pr-4 md:pr-0 md:text-4xl lg:text-[30px] xl:text-[35px] dark:text-dark-primary-color"
        >
        <a href="/src/HTML/home.html" alt="يمن كريرز">
          يمن كريرز
          </a>
        </li>
        <li
          class="hidden lg:block w-0.5 h-8 bg-primary-color/40 rounded-full"
        ></li>
        <li
          class="text-light-blue hidden lg:block lg:text-lg xl:text-xl font-bold dark:text-dark-secondary-color"
        >
        <a href="/src/HTML/home.html" alt="الصفحة الرئيسية">
          الصفحة الرئيسية
          </a>
        </li>
        <li
          class="hidden lg:block lg:text-lg xl:text-xl font-bold cursor-pointer dark:text-[#FFFFFF]"
        >
          <a href="/src/HTML/search_for_job.html">البحث</a>
        </li>
        <li
          class="hidden lg:block lg:text-lg xl:text-xl font-bold cursor-pointer dark:text-white"
        >
          <a href="/src/HTML/add_new_job.html">اضف طلب توظيف جديد</a>
        </li>
        <li
          class="hidden lg:block lg:text-lg xl:text-xl font-bold cursor-pointer dark:text-white"
        >
          <a href="/src/HTML/Myjob.html">وظائفي</a>
        </li>
        <!-- زر القائمة للشاشة الأقل من أو يساوي md -->
        <button
          id="menu-toggle"
          class="text-gray-500 focus:outline-none z-30 absolute left-10 lg:hidden"
        >
          <span id="menu-icon"><img src="/src/Images/list.svg" alt="" /></span>
        </button>

        <!-- تراك شفاف للخلفية -->
        <div id="backdrop" class="fixed inset-0 bg-opacity-0 z-30 hidden"></div>
        <!-- القائمة الجانبية -->
        <div
          id="mobile-menu"
          class="fixed top-0 left-0 h-full w-64 bg-white dark:bg-[var(--color-dark-theme-color)] shadow-lg transform -translate-x-full transition-transform duration-300 ease-in-out z-40 text-right"
        >
          <!-- رأس القائمة -->
          <div
            class="flex items-center justify-between p-4 border-b text-gray-300 mx-4"
          >
            <button id="menu-close" class="text-gray-500 text-6xl">
              &times;
            </button>
            <!--  mobile screen -->
            <!-- القائمة المنسدلة الجانبية للشاشات الكبيرة بعد تسجيل الدخول-->
            <!--
  <div class="relative group md:hidden">
  <button
    id = "account-menu-button"
      class="flex items-center  md:hidden lg:w-40 lg:h-10 xl:w-50 xl:h-12 mt-4 mr-0 space-x-2 bg-gray-100 px-2 py-2 rounded-lg hover:bg-gray-200 transition justify-between dark:bg-[#323232] "
      onclick="toggleDropdown()"
  >
      <div class="flex items-center space-x-2 ">
      <i id="dropdown-icon" class="fas fa-chevron-down mr-1 text-gray-600 transition-transform duration-300"></i>
      <span class="company_name font-Cairo-bold text-sm text-black  lg:mr-4 xl:mr-12 dark:text-white"></span>
      <img src="/src/Images/logo.jpeg" alt="Logo" class="w-8 h-8 rounded-full" />
      </div>
  </button>
  <!-- القائمة المنسدلة للشاشات الكبيرة -->
        <div
            id="account-dropdown"
            class="absolute left-1 mt-2 w-50 bg-white border border-gray-200 rounded-xl shadow-lg hidden z-50 dark:bg-[#323232] "
        >
        <div class="p-4 border-b border-gray-200">
        <div class="flex flex-row-reverse items-center">
            <!-- صورة الحساب -->
            <img src="/src/Images/logo.jpeg" alt="Logo" class="w-12 h-12 rounded-full mr-3" />    
            <!-- اسم الحساب والبريد -->
            <div class="flex flex-col items-end text-right">
            <div class="company_name text-lg font-Cairo-bold text-gray-900 dark:text-white"></div>
            <div id ="email" class="text-[10px] text-blue-600 dark:text-[#5AF3E9]"></div>
            
            </div>
        </div>
        </div>
            <ul>
            <li>
            <a href="#" class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm dark:text-white dark:hover:text-black dark:hover:bg-gray-50">
            <i class="fas fa-user ml-2"></i>
            معلومات الحساب
            </a>
            </li>
            <li>
            <a href="#" class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm dark:text-white dark:hover:text-black dark:hover:bg-gray-50">
            <i class="fas fa-sliders-h ml-2"></i>
            إعدادات الحساب
            </a>
            </li>
            <li>
            <button id="themeToggle" class="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm dark:text-white dark:hover:text-black dark:hover:bg-gray-50" >
            <img id="themeIcon" src="/src/Images/moon.svg" alt="Theme Icon" class="size-3.5 ml-2 transition-all duration-500 ease-in-out" />
            الوضع المظلم
            </button>
            </li>
            <hr class="my-1" />
            <li>
             <button id=logOut_btn href="#" class="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm dark:text-white dark:hover:text-black dark:hover:bg-gray-50">
            <i class="fas fa-sign-out-alt ml-2"></i>
            تسجيل الخروج
            </button>
            </li>
            </ul>    
        </div>
        </div>
        <!--
          </div>
          <!-- الحاوية الكاملة -->
          <div
            class="flex flex-col justify-between h-[calc(100%-80px)] px-4 py-6 space-y-8 overflow-y-auto"
          >
            <!-- روابط التنقل الخاص بالجوال -->
            <nav
              class="flex flex-col items-center space-y-20 font-Cairo-bold text-xl"
            >
              <a
                href="/src/HTML/home.html"
                class="text-light-blue font-bold hover:text-primary-color"
              >
                الصفحة الرئيسية
              </a>
              <a
                href="/src/HTML/search_job.html"
                class="hover:text-primary-color dark:text-[#FFFFFF]"
                >البحث</a
              >
              <a
                href="/src/HTML/add_new_job.html"
                class=" hover:text-primary-color dark:text-[#FFFFFF]"
                >اضف طلب توظيف جديد</a
              >
              <a
                href="/src/HTML/Myjob.html"
                class=" hover:text-primary-color dark:text-[#FFFFFF]"
                >وظائفي</a
              >
            </nav>

            <!-- فاصل -->
            <div class="border-b border-gray-300 w-full"></div>

           

            <!-- التذييل -->
            <footer class="text-center text-gray-500 text-sm space-y-2 pt-4">
              <span class="text-light-blue font-Cairo-bold text-lg">
                يمن كريرز
              </span>
              <div
                class="flex justify-center items-center space-x-1 rtl:space-x-reverse dark:text-[#FFFFFF]"
              >
                <span class="text-primary-color text-xl pt-1">©</span>
                <span>جميع الحقوق محفوظة ليمن كريرز</span>
              </div>
            </footer>
          </div>
        </div>
      </ul>

      
    
     <!-- القائمة المنسدلة الجانبية للشاشات الكبيرة بعد تسجيل الدخول-->
  <div class="relative group">
  <button
    id = "account-menu-button"
      class=" hidden lg:flex items-center lg:w-40 lg:h-10 xl:w-50 xl:h-12 mt-4 mr-0 space-x-2 bg-gray-100 px-2 py-2 rounded-lg hover:bg-gray-200 transition justify-between dark:bg-[#323232] "
      onclick="toggleDropdown()"
  >
      <div class="flex items-center space-x-2 ">
      <i id="dropdown-icon" class="fas fa-chevron-down mr-1 text-gray-600 transition-transform duration-300"></i>
      <span class="company_name font-Cairo-bold text-sm text-black  lg:mr-4 xl:mr-12 dark:text-white"></span>
      <img src="/src/Images/logo.jpeg" alt="Logo" class="w-8 h-8 rounded-full" />
      </div>
  </button>
  <!-- القائمة المنسدلة للشاشات الكبيرة -->
        <div
            id="account-dropdown"
            class="absolute right-0 mt-2 w-50 bg-white border border-gray-200 rounded-xl shadow-lg hidden z-50 dark:bg-[#323232] "
        >
        <div class="p-4 border-b border-gray-200">
        <div class="flex flex-row-reverse items-center">
            <!-- صورة الحساب -->
            <img src="/src/Images/logo.jpeg" alt="Logo" class="w-12 h-12 rounded-full mr-3" />    
            <!-- اسم الحساب والبريد -->
            <div class="flex flex-col items-end text-right">
            <div class="company_name text-lg font-Cairo-bold text-gray-900 dark:text-white"></div>
            <div id ="email" class="text-[10px] text-blue-600 dark:text-[#5AF3E9]"></div>
            
            </div>
        </div>
        </div>
            <ul>
            <li>
            <a href="#" class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm dark:text-white dark:hover:text-black dark:hover:bg-gray-50">
            <i class="fas fa-user ml-2"></i>
            معلومات الحساب
            </a>
            </li>
            <li>
            <a href="#" class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm dark:text-white dark:hover:text-black dark:hover:bg-gray-50">
            <i class="fas fa-sliders-h ml-2"></i>
            إعدادات الحساب
            </a>
            </li>
            <li>
            <button id="themeToggle" class="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm dark:text-white dark:hover:text-black dark:hover:bg-gray-50" >
            <img id="themeIcon" src="/src/Images/moon.svg" alt="Theme Icon" class="size-3.5 ml-2 transition-all duration-500 ease-in-out" />
            الوضع المظلم
            </button>
            </li>
            <hr class="my-1" />
            <li>
             <button id=logOut_btn href="#" class="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm dark:text-white dark:hover:text-black dark:hover:bg-gray-50">
            <i class="fas fa-sign-out-alt ml-2"></i>
            تسجيل الخروج
            </button>
            </li>
            </ul>    
        </div>
        </div>
    </header> `;

  // إدراج الهيدر داخل عنصر في الصفحة
  const userHeaderContainer = document.getElementById("user-header-container");
  if (userHeaderContainer) userHeaderContainer.innerHTML = userHeaderHTML;
  let accessToken = localStorage.getItem("accessToken");
  const logOut_btn = document.getElementById("logOut_btn");

  


  // Handle LogOut Button
  async function handleLogout() {
    const { isConfirmed } = await Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to log out?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel"
    });

    // إذا لم يؤكد المستخدم تسجيل الخروج، يتم الخروج من الدالة
    if (!isConfirmed) {
        return;
    }

    try {
        await axiosInstance.post(`/api/v1/user/logout`, null, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        
        localStorage.removeItem("accessToken");

        window.location.href = "/index.html";
    }
    catch (error) {
        if (error.response) {
            const status = error.response.status;

            if (status === 401) {
                try {
                    const refreshResponse = await axiosInstance.get(`/api/v1/user/refresh`);
                    localStorage.setItem("accessToken", refreshResponse.data.accessToken);
                    return handleLogout.click();
                } catch (refreshError) {
                    Swal.fire({
                        icon: "error",
                        title: "Session Expired",
                        text: "You have to log in again.",
                        confirmButtonColor: "#d33"
                    }).then(() => {
                        window.location.href = "/src/HTML/welcome.html";
                    });
                }
            }else if (status === 429) {
                Swal.fire({
                    icon: "error",
                    title: "Too Many Requests",
                    text: "You are making too many requests. Please try again later.",
                    confirmButtonColor: "#d33",
                });
            } else if (status === 500) {
                Swal.fire({
                    icon: "error",
                    title: "Server Error",
                    text: "Something went wrong. Please try again later.",
                    confirmButtonColor: "#d33",
                });
            }
        } else {
            Swal.fire({
                icon: "error",
                title: "Network Error",
                text: "Please check your internet connection and try again.",
                confirmButtonColor: "#d33",
            });
        }
    }
  }
logOut_btn.addEventListener("click", handleLogout);

});

// Get some Information of user
  async function getUserInfo(accessToken) {
    try {
            const user_id = localStorage.getItem("user_id");
            let response = await axiosInstance.get(`/api/v1/user/info/${user_id}`);
            let data = response.data;
            if(header)
            {
                header.id = "user-header-container";
                document.querySelector(".company_name").textContent = data.name;
                document.querySelector("#email").textContent = data.email;
            }

        } catch(error) {
             if (error.response) {
            const status = error.response.status;
            if (status === 401) {
                try {
                    const refreshResponse = await axiosInstance.get(`/api/v1/user/refresh`);
                    localStorage.setItem("accessToken", refreshResponse.data.accessToken);
                    return delete_account_btn.click();
                } catch (refreshError) {
                    Swal.fire({
                        icon: "error",
                        title: "Session Expired",
                        text: "You have to log in again.",
                        confirmButtonColor: "#d33"
                    }).then(() => {
                        window.location.href = "/src/HTML/welcome.html";
                    });
                }
              } else {
                console.log("Error: " + error);
        } 
        }
  }};


