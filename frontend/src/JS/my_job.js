// اسماء الأعمدة
document.addEventListener("DOMContentLoaded", function () {
  fetch("/src/JSON/field-labels.json")
    .then((res) => res.json())
    .then((labels) => {
      document.querySelectorAll(".field-label").forEach((el) => {
        const key = el.getAttribute("data-key");
        if (labels[key]) {
          el.textContent = labels[key];
        }
      });
    })
    .catch((error) => console.error("فشل في تحميل بيانات الحقول:", error));
});

// تحديد الكل
const selectAllCheckboxes = document.querySelectorAll(".select-all-checkbox");
const jobCheckboxes = document.querySelectorAll(".jobCheckbox");

selectAllCheckboxes.forEach((selectAllCheckbox) => {
  selectAllCheckbox.addEventListener("change", function () {
    jobCheckboxes.forEach((checkbox) => {
      checkbox.checked = selectAllCheckbox.checked;
    });
  });
});

// تحديث حالة "تحديد الكل" تلقائيًا
jobCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    const allChecked = [...jobCheckboxes].every((cb) => cb.checked);
    selectAllCheckboxes.forEach((selectAllCheckbox) => {
      selectAllCheckbox.checked = allChecked;
    });
  });
});

let jobs_container = document.getElementById("jobs_container");

let start;
let end;
let currentPage = 1;
const jobsPerPageDesktop = 20;
const jobsPerPageMobile = 10;
let totalJobs = 0;

let accessToken = localStorage.getItem("accessToken");
// to get number of jobs depending on width of screen
document.addEventListener("DOMContentLoaded", () => {
    function checkScreenWidth() {
  const jobsPerPage = window.innerWidth >= 640 ? jobsPerPageDesktop : jobsPerPageMobile;
  start = (currentPage - 1) * jobsPerPage;
  end = start + jobsPerPage - 1;
}
  
    // تنفيذ عند التحميل
    checkScreenWidth();
  
    // إعادة الفحص عند تغيير حجم النافذة
    window.addEventListener("resize", checkScreenWidth);
  });

  const getJobsInformation = async (token, start, end,) => {
    try {
        let response = await axiosInstance.get(`/api/v1/job/your`, {
            headers: {
                Authorization: `Bearer ${token}`
            }, params : {
                s: start, e: end ,
            }
        });

        let data = response.data;
        totalJobs = data.length;

        if(data.length === 0) {
            jobs_container.innerHTML = `
            <div class="flex justify-center items-center h-full">
                <p class="text-gray-500">لاتوجد وظائف</p>
            </div>`;
             // إخفاء Pagination إذا لم تكن هناك وظائف
          const oldPagination = document.querySelector('.pagination');
          if (oldPagination) {
            oldPagination.remove();
          }
          return;

        } else if (data.length > 0 && window.innerWidth >= 640)  {
            jobs_container.innerHTML = data.map(job => {
              return `<!-- عرض الجدول في الشاشات الكبيرة فقط -->
      <div class="hidden md:block">
        <div
          class="md:bg-gray-100 md:dark:bg-dark-third-color md:dark:text-[#ffffff] md:p-1 md:border-separate md:rounded-lg md:mx-4 lg:mx-4 xl:mx-0"
        >
          <div
            class="hidden md:grid md:grid-cols-8 md:justify-center md:items-center md:text-xs md:px-1 md:py-1 lg:py-1 lg:px-2 lg:text-sm"
          >
            <div class="flex md:pr-1 lg:pr-4 xl:pr-4">
              <input
                type="checkbox"
                class="select-all-checkbox form-checkbox xl:scale-125 accent-medium-blue"
              />
            </div>
            <div class="md:col-span-1 md:pr-2 lg:pr-4 xl:pr-2">
              <span
                class="field-label text-medium-blue md:text-gray-500 dark:text-gray-300"
                data-key="name"
              ></span>
            </div>
            <div class="md:pr-6 xl:pr-7">
              <span
                class="field-label text-medium-blue md:text-gray-500 dark:text-gray-300"
                data-key="department"
              ></span>
            </div>
            <div class="md:pr-2 lg:pr-4 xl:pr-5">
              <span
                class="field-label text-medium-blue md:text-gray-500 dark:text-gray-300"
                data-key="daysLeft"
              ></span>
            </div>
            <div class="md:pr-8 lg:pr-12 xl:pr-15">
              <span
                class="field-label text-medium-blue md:text-gray-500 dark:text-gray-300"
                data-key="type"
              ></span>
            </div>
            <div class="md:text-center">
              <span
                class="field-label text-medium-blue md:text-gray-500 dark:text-gray-300"
                data-key="city"
              ></span>
            </div>
            <div class="md:pr-4 lg:pr-7 xl:pr-10">
              <span
                class="field-label text-medium-blue md:text-gray-500 dark:text-gray-300"
                data-key="endDate"
              ></span>
            </div>
            <div class="md:pr-3 lg:pr-6 xl:pr-8">
              <span
                class="hidden field-label md:block md:text-gray-500 dark:text-gray-300"
                data-key="EditDelete"
              ></span>
            </div>
          </div>
          <!-- Job info -->
          <div class="space-y-2">
            <div job_id =${job.id}
              class="font-Cairo-bold text-black shadow md:bg-white md:dark:bg-dark-theme-color md:dark:text-[#ffffff] md:grid md:grid-cols-8 md:p-2 md:text-[10px] lg:text-xs lg:items-center lg:p-2 lg:text-center xl:text-sm xl:space-y-1"
            >
              <div
                class="flex md:gap-4 md:col-span-2 lg:pr-4 lg:col-span-2 xl:items-center xl:justify-start"
              >
                <input
                  type="checkbox"
                  class="jobCheckbox form-checkbox xl:scale-125 accent-medium-blue"
                />
                <span class="text-gray-700 dark:text-gray-300"
                  >${job.type}</span
                >
              </div>
              <div class="lg:pl-7 xl:pl-10">
                <span class="text-gray-700 dark:text-gray-300"
                  >${job.department}</span
                >
              </div>
              <div class="md:pr-5 lg:pr-9 xl:pr-6">
                <span
                  class="md:w-10 md:h-4 lg:w-12 lg:h-5 xl:w-16 xl:h-5 flex items-center justify-center rounded border ${setColor(job.status)} bg-green-50 dark:bg-dark-third-color"
                  >${job.remaining_days}</span
                >
              </div>
              <div class="">
                <span class="text-gray-700 dark:text-gray-300"
                  >${job.title}</span
                >
              </div>
              <div class="md:pr-8 lg:pr-1">
                <span class="text-gray-700 dark:text-gray-300">${job.city}</span>
              </div>
              <div class="md:text-center lg:pr-2 xl:pr-3">
                <span class="text-gray-700 dark:text-gray-300">${job.end_date}</span>
              </div>
              <div
                class="flex justify-center items-center md:pr-4 md:gap-4 lg:pr-4 lg:gap-4 xl:pr-4 xl:gap-4"
              >
                <button class="text-blue-600 hover:text-blue-800">
                  <a href="#"><img src="/src/Images/pen.svg" alt="edit" /></a>
                </button>
                <button job_id =${job.id} id ="delete_btn" class="text-red-600 hover:text-red-800 cursor-pointer">
                  <img src="/src/Images/trash.svg" alt="delete" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>`
            }).join(' ');
        } else if (data.length > 0 && window.innerWidth <= 640)  {
            jobs_container.innerHTML = data.map(job => {
              return `<!-- عرض الجدول في الشاشات الصغيرة فقط -->
              <div class="block md:hidden">
        <div class="flex justify-around pt-2 gap-34 sm:gap-50">
          <div class="pt-1">
            <input
              type="checkbox"
              class="select-all-checkbox form-checkbox accent-medium-blue scale-125"
            />
            <span class="text-gray-400 text-sm pr-1 sm:text-lg"
              >تحديد الكل</span
            >
          </div>
          <a
            href="#"
            class="text-medium-blue text-xs font-Cairo-bold pt-2 sm:text-lg"
            >إضافة وظيفة جديدة</a
          >
        </div>

        <!-- قائمة الوظائف كبطاقات -->
        <div class="space-y-4 p-4">
          <div job_id =${job.id}
            class="bg-white dark:bg-dark-theme-color shadow p-2 grid gap-4 grid-cols-[auto_2px_1fr] items-start relative"
          >
            <div class="pt-14 sm:pt-20 sm:pr-4">
              <input
                type="checkbox"
                class="jobCheckbox form-checkbox accent-cyan-600 scale-125"
              />
            </div>
            <div
              class="h-full w-[2px] mt-4 bg-gray-300 dark:bg-dark-border-color"
            ></div>
            <div
              class="grid grid-cols-4 gap-y-4 text-xs sm:text-lg text-black dark:text-[#ffffff] pt-4 pr-2"
            >
              <div class="col-span-2 flex">
                <span
                  class="field-label font-medium text-medium-blue font-Cairo-bold"
                  data-key="name"
                ></span>
                <span class="pr-3">${job.type}</span>
              </div>
              <div class="col-span-2 flex">
                <span
                  class="field-label font-medium text-medium-blue font-Cairo-bold"
                  data-key="department"
                ></span>
                <span class="pr-3 sm:pr-3">${job.department}</span>
              </div>
              <div class="col-span-2 flex">
                <span
                  class="field-label font-medium text-medium-blue font-Cairo-bold"
                  data-key="city"
                ></span>
                <span class="pr-3">${job.city}</span>
              </div>
              <div class="col-span-2 flex">
                <div
                  class="field-label font-medium text-medium-blue font-Cairo-bold"
                  data-key="type"
                ></div>
                <div class="pr-1 sm:pr-4">${job.title}</div>
              </div>
              <div class="col-span-2 flex">
                <div
                  class="field-label font-medium text-medium-blue font-Cairo-bold"
                  data-key="daysLeft"
                ></div>
                <div class="pr-1 sm:pr-2">
                  <span
                    class="${setColor(job.status)} bg-green-50 dark:bg-dark-theme-color flex w-10 h-4 sm:w-16 sm:h-6 rounded border items-center justify-center"
                    >${job.remaining_days}</span
                  >
                </div>
              </div>
              <div class="col-span-2 flex">
                <span
                  class="field-label text-medium-blue font-Cairo-bold"
                  data-key="endDate"
                ></span>
                <span class="pr-1">${job.end_date}</span>
              </div>
            </div>
            <div
              class="col-span-3 flex items-center justify-center gap-30 mt-4 pb-2 sm:gap-70"
            >
              <button class="text-blue-600 hover:text-blue-800 pr-8">
                <a href="#">
                  <img
                    src="/src/Images/pen.svg"
                    alt="edit"
                    class="sm:w-7 sm:-h-5"
                  />
                </a>
              </button>
              <button job_id =${job.id} id ="delete_btn" class="text-red-600 hover:text-red-800 cursor-pointer">
                <img
                  src="/src/Images/trash.svg"
                  alt="delete"
                  class="sm:w-7 sm:-h-5"
                />
              </button>
            </div>
          </div>
        
          
        </div>
      </div>`
            }).join(' ');
        }

         renderPagination();
    } catch(error) 
    {
        if (error.response) {
                    const status = error.response.status;
                    if (status === 401) {
                        try {
                            const refreshResponse = await axiosInstance.get(`/api/v1/user/refresh`);
                            localStorage.setItem("accessToken", refreshResponse.data.accessToken);
                            accessToken = refreshResponse.data.accessToken;
                            return getJobsInformation(accessToken, start, end, getJobsByFilters); 
                        } catch (refreshError) {
                            if (refreshError.response && refreshError.response.status === 401) {
                                Swal.fire({
                                    icon: "error",
                                    title: "Session Expired",
                                    text: "You have to log in again.",
                                    confirmButtonColor: "#d33",
                                }).then(() => {
                                    window.location.href = "/src/HTML/home.html";
                                });
                            }
                        }
                    } else if (status === 400) {
                        Swal.fire({
                            icon: "error",
                            title: "BadRequest",
                            text: "Number of job requested is out of range.",
                            confirmButtonColor: "#d33",
                        });
                    } else if (status === 404) {
                        Swal.fire({
                            icon: "error",
                            title: "NotFound",
                            text: "There is no jobs.",
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


function setColor(status) {
    if(status === "open") {
        return"text-[#00B448] border-[#00B448] md:text-medium-blue";
    } else if (status === "close") {
        return"text-[#FF4747] border-[#FF4747] md:text-[#FF4747";
    }
}


// استخدم event delegation للتعامل مع أزرار الحذف
document.addEventListener('click', async function(e) {
  // تحقق إذا كان العنصر المضغوط هو زر الحذف أو بداخله
  const deleteBtn = e.target.closest('#delete_btn');
  
  if (deleteBtn) {
    e.preventDefault(); // منع السلوك الافتراضي إذا كان الزر داخل <a>
    
    const { isConfirmed } = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "هل تريد حقاً حذف هذه الوظيفة؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "نعم",
      cancelButtonText: "إلغاء"
    });

    if (!isConfirmed) return;

    const job_id = deleteBtn.getAttribute("job_id");
    
    try {
      await axiosInstance.post(`/api/v1/job/delete/${job_id}`, null, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      // عرض رسالة نجاح
      await Swal.fire({
        title: "تم الحذف!",
        text: "تم حذف الوظيفة بنجاح.",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
      
      // إعادة تحميل البيانات بعد الحذف
      checkScreenWidth();
      getJobsInformation(accessToken, start, end);
      
    } catch (error) {
      if (error.response) {
        const status = error.response.status;

        if (status === 401) {
          try {
            const refreshResponse = await axiosInstance.get(`/api/v1/user/refresh`);
            localStorage.setItem("accessToken", refreshResponse.data.accessToken);
            accessToken = refreshResponse.data.accessToken;
            // إعادة محاولة الحذف بعد تجديد التوكن
            return deleteBtn.click(); 
          } catch (refreshError) {
            Swal.fire({
              icon: "error",
              title: "انتهت الجلسة",
              text: "يجب عليك تسجيل الدخول مرة أخرى.",
              confirmButtonColor: "#d33"
            }).then(() => {
              window.location.href = "/login";
            });
          }
        } else if (status === 429) {
          Swal.fire({
            icon: "error",
            title: "طلبات كثيرة جداً",
            text: "لقد تجاوزت الحد المسموح من الطلبات. يرجى المحاولة لاحقاً.",
            confirmButtonColor: "#d33",
          });
        } else if (status === 404) {
          Swal.fire({
            icon: "error",
            title: "غير موجود",
            text: "الوظيفة غير موجودة.",
            confirmButtonColor: "#d33",
          });
        } else if (status === 500) {
          Swal.fire({
            icon: "error",
            title: "خطأ في الخادم",
            text: "حدث خطأ ما. يرجى المحاولة مرة أخرى لاحقاً.",
            confirmButtonColor: "#d33",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "خطأ في الشبكة",
          text: "يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.",
          confirmButtonColor: "#d33",
        });
      }
    }
  }
});


function renderPagination() {
  // حساب عدد العناصر لكل صفحة حسب حجم الشاشة
  const jobsPerPage = window.innerWidth >= 640 ? jobsPerPageDesktop : jobsPerPageMobile;
  
  // حساب عدد الصفحات الكلي (مع التقريب لأعلى قيمة)
  const totalPages = Math.ceil(totalJobs / jobsPerPage);
  
  // إزالة أي pagination موجود مسبقاً
  const oldPagination = document.querySelector('.pagination');
  if (oldPagination) {
    oldPagination.remove();
  }
  
  // لا نعرض Pagination إذا كان العدد الكلي أقل من أو يساوي عناصر الصفحة الواحدة
  if (totalJobs <= jobsPerPage) {
    return;
  }
  
  // إنشاء عنصر Pagination الرئيسي
  const paginationContainer = document.createElement('div');
  paginationContainer.className = 'pagination flex justify-center items-center gap-2 my-4';
  
  // زر السابق
  const prevButton = document.createElement('button');
  prevButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
    </svg>
    السابق
  `;
  prevButton.className = `flex items-center gap-1 px-3 py-1 rounded transition-all duration-200 ${
    currentPage === 1 
      ? 'text-gray-400 cursor-not-allowed opacity-70' 
      : 'text-gray-700 hover:text-medium-blue dark:hover:text-dark-primary-color hover:bg-gray-100 dark:hover:bg-gray-700'
  }`;
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      checkScreenWidth();
      getJobsInformation(accessToken, start, end);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
  
  // أزرار الصفحات
  const pagesContainer = document.createElement('div');
  pagesContainer.className = 'flex gap-1';
  
  // تحديد عدد الأزرار المرئية حول الصفحة الحالية
  const maxVisibleButtons = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);
  
  // تعديل إذا وصلنا للنهاية
  if (endPage - startPage + 1 < maxVisibleButtons) {
    startPage = Math.max(1, endPage - maxVisibleButtons + 1);
  }
  
  // زر الصفحة الأولى (إذا لزم الأمر)
  if (startPage > 1) {
    const firstPageButton = createPageButton(1);
    pagesContainer.appendChild(firstPageButton);
    
    if (startPage > 2) {
      const ellipsis = document.createElement('span');
      ellipsis.className = 'px-2 py-1 text-gray-500';
      ellipsis.textContent = '...';
      pagesContainer.appendChild(ellipsis);
    }
  }
  
  // أزرار الصفحات المرئية
  for (let i = startPage; i <= endPage; i++) {
    const pageButton = createPageButton(i);
    pagesContainer.appendChild(pageButton);
  }
  
  // زر الصفحة الأخيرة (إذا لزم الأمر)
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      const ellipsis = document.createElement('span');
      ellipsis.className = 'px-2 py-1 text-gray-500';
      ellipsis.textContent = '...';
      pagesContainer.appendChild(ellipsis);
    }
    
    const lastPageButton = createPageButton(totalPages);
    pagesContainer.appendChild(lastPageButton);
  }
  
  // زر التالي
  const nextButton = document.createElement('button');
  nextButton.innerHTML = `
    التالي
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
    </svg>
  `;
  nextButton.className = `flex items-center gap-1 px-3 py-1 rounded transition-all duration-200 ${
    currentPage === totalPages 
      ? 'text-gray-400 cursor-not-allowed opacity-70' 
      : 'text-gray-700 hover:text-medium-blue dark:hover:text-dark-primary-color hover:bg-gray-100 dark:hover:bg-gray-700'
  }`;
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      checkScreenWidth();
      getJobsInformation(accessToken, start, end);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
  
  // إضافة الأزرار إلى الحاوية
  paginationContainer.appendChild(prevButton);
  paginationContainer.appendChild(pagesContainer);
  paginationContainer.appendChild(nextButton);
  
  // إضافة Pagination إلى الصفحة
  jobs_container.parentNode.insertBefore(paginationContainer, jobs_container.nextSibling);
  
  // دالة مساعدة لإنشاء أزرار الصفحات
  function createPageButton(pageNumber) {
    const button = document.createElement('button');
    button.textContent = pageNumber;
    button.className = `px-3 py-1 rounded transition-all duration-200 ${
      currentPage === pageNumber 
        ? 'bg-medium-blue text-white dark:bg-dark-primary-color' 
        : 'text-gray-600 hover:text-medium-blue dark:hover:text-dark-primary-color hover:bg-gray-100 dark:hover:bg-gray-700'
    }`;
    button.addEventListener('click', () => {
      if (currentPage !== pageNumber) {
        currentPage = pageNumber;
        checkScreenWidth();
        getJobsInformation(accessToken, start, end);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
    return button;
  }
}
