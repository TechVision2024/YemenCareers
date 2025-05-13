// import {axiosInstance} from "./config.js";
const filter_icon = document.getElementById("filter-icon");
const filter_container = document.getElementById("filter-container");   
const jobs_container = document.getElementById("jobs_container"); 
const search_icon = document.getElementById("search_icon"); 
let accessToken = localStorage.getItem("accessToken");
let hasMoreJobs = false;
let next_jobs_container = document.getElementById("next_jobs");

next_jobs_container.style.display = "none";

let createdAtPicker = null;

document.getElementById("created_at").addEventListener("focus", () => {
  if (!createdAtPicker) {
    createdAtPicker = flatpickr("#created_at", {
      dateFormat: "Y/m/d",
    });
  }
});

document.getElementById("created_at").addEventListener("blur", () => {
  if (createdAtPicker) {
    createdAtPicker.destroy();
    createdAtPicker = null;
  }
});


document.getElementById("end_date").addEventListener("focus", () => {
  if (!createdAtPicker) {
    createdAtPicker = flatpickr("#end_date", {
      dateFormat: "Y/m/d",
    });
  }
});

document.getElementById("end_date").addEventListener("blur", () => {
  if (createdAtPicker) {
    createdAtPicker.destroy();
    createdAtPicker = null;
  }
});
  
let start,end;  


// Showing Filter Section
filter_icon.addEventListener("click", () => {
    const isHidden = filter_container.classList.contains("max-h-0");

    if (isHidden) {
        filter_container.classList.remove("max-h-0", "opacity-0", "py-0", "mt-0", "space-y-0", "scale-y-95");
        filter_container.classList.add("max-h-[500px]", "opacity-100", "py-4", "mt-2", "space-y-4", "scale-y-100");
    } else {
        filter_container.classList.remove("max-h-[500px]", "opacity-100", "py-4", "mt-2", "space-y-4", "scale-y-100");
        filter_container.classList.add("max-h-0", "opacity-0", "py-0", "mt-0", "space-y-0", "scale-y-95");
    }
});


// to get number of jobs depending on width of screen
document.addEventListener("DOMContentLoaded", () => {
    function checkScreenWidth() {
      if (window.innerWidth >= 640) {
        // العرض 640 بكسل أو أكثر
        start = 0;
        end = 19;
    } else {
        // العرض أقل من 640 بكسل
        start = 0;
        end = 9;
      }
    }
  
    // تنفيذ عند التحميل
    checkScreenWidth();
  
    // إعادة الفحص عند تغيير حجم النافذة
    window.addEventListener("resize", checkScreenWidth);
  });

const getJobsInformation = async (token, start, end, filters = {}) => {
    try {
        let response = await axiosInstance.get(`/api/v1/job/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }, params : {
                s: start, e: end , ...filters
            }
        });

        let data = response.data;
                hasMoreJobs = data.length >= (window.innerWidth >= 640 ? 20 : 10);

        if(data.length === 0) {
            jobs_container.innerHTML = `
            <div class="flex justify-center items-center h-full">
                <p class="text-gray-500">لا توجد حسابات</p>
            </div>`;
        } else if (data.length > 0)  {
            jobs_container.innerHTML = data.map(job => {
                return `<!-- Job -->
              <div key=${job.id} class="w-full rounded-2xl h-30 p-4 border grid grid-cols-4 grid-rows-3 space-y-8 mt-4 border-[#CACECB] transition-all duration-350 hover:border-b-8 hover:border-primary-color md:grid-cols-4 md:grid-rows-1 md:py-12 md:h-64 md:gap-x-1 lg:gap-x-4 lg:px-14 xl:pl-8 xl:gap-x-8 dark:border-[#8080808C] dark:hover:border-dark-primary-color">
                <div class="row-span-2 md:row-span-1">
                  <img src="${job.company_image}" alt="Logo" loading="lazy" class="size-12 rounded-2xl hover:border md:size-24 hover:border-blue-500">
                </div>
                 <!-- Job Title -->
                  <div class="md:flex justify-center items-center translate-x-4 md:translate-x-0"> 
                    <h3 class=" font-inter-700 text-[14px] text-[#090909] font-bold md:text-2xl dark:text-white">${job.type}</h3>
                  </div>
                <!-- Line -->
                 <div class="flex justify-end items-center">
                  <span class="hidden w-[1px] h-14 bg-[#CACECB] after:right-4-5 md:flex md:justify-end dark:bg-dark-border-color lg:-translate-x-1 xl:translate-x-6"></span>
                 </div>
                 <!-- Company Name -->
                <div class=" col-start-2 row-start-2 translate-x-4 md:flex md:pr-2 md:translate-x-0 md:col-start-auto md:row-start-auto md:justify-center lg:justify-start ">
                  <p class="font-inter-700 text-[14px] text-light-blue font-bold md:translate-y-5 md:text-2xl lg:-translate-x-1/2 dark:text-[#4AC8E0]">${job.company_name}</p>
                </div>
                
                <div class="flex justify-center col-start-4 row-start-2 space-x-2 md:items-center md:translate-y-0 md:space-x-0 md:relative md:col-start-auto md:row-start-auto">
                  <!-- Location Icon -->
                  <svg  class=" w-2.5 h-4 md:h-5 md:w-4 md:translate-x-4 text-[#CACECB] dark:text-[#FFFFFF66]" viewBox="0 0 15 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_120_91)">
                    <path d="M7.5 0C3.3582 0 0 3.3582 0 7.5C0 10.5238 1.05352 11.3684 6.73047 19.5977C7.10277 20.1355 7.89883 20.1355 8.27109 19.5977C13.9453 11.3672 15 10.5234 15 7.5C15 3.3582 11.6406 0 7.5 0ZM7.5 10.5898C5.77617 10.5898 4.375 9.18828 4.375 7.46484C4.375 5.74141 5.77734 4.33984 7.5 4.33984C9.22266 4.33984 10.625 5.74141 10.625 7.46484C10.625 9.18828 9.22266 10.5898 7.5 10.5898Z" fill="currentColor"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_120_91">
                    <rect width="15" height="20" fill="currentColor"/>
                    </clipPath>
                    </defs>
                    </svg>
                <!-- City -->
                  <p class="font-inter-700 font-bold text-[#B3B3B3] text-[12px] md:absolute md:left-0 md:text-[20px] lg:text-2xl  dark:dark:text-dark-text-color">${job.city}</p>
                </div>

                   <!-- Days Left -->
                  <div class="col-start-4 row-start-1 md:col-start-auto md:row-start-auto md:flex md:justify-center md:items-center">
                    <div class="border px-2 roundeed-[5px] bg-green-100 flex items-center justify-center ${setColor(job.status)}  md:rounded-none md:h-7 md:w-40 dark:bg-transparent">
                      <p class="font-semi-bold text-[11px]  font-semibold md:text-[13px] ">${job.remaining_days} يوم متبقي</p>
                    </div>
                  </div>
                <div class="flex justify-center mt-2 col-span-2 row-start  md:mt-0 md:justify-start md:row-start-auto md:col-auto">
                  <p class="font-inter-700 font-bold text-[#B3B3B3] text-[12px] md:text-[20px] lg:text-2xl dark:text-dark-text-color">انشاء: ${job.created_at}</p>
                </div>
                <div class="flex justify-end mt-2 pl-4 col-start-3 col-span-2 row-start-3 md:justify-start md:col-start-auto md:row-start-auto md:col-auto md:mt-0 md:pl-0 ">
                  <p class="font-inter-700 font-bold text-[#B3B3B3] text-[12px] md:text-[20px] lg:text-2xl dark:text-dark-text-color">انهاء: ${job.end_at}</p>
                </div>
              </div>
              `
            }).join(' ');
        }

        if (hasMoreJobs) {
            next_jobs_container.style.display = "block";
        } else {
            next_jobs_container.style.display = "none";
        }
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
                            text: "Invalid start or end.",
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

function getJobsByFilters() {
    let filters = {}
    const regexForDate = /^\d{4}\/\d{2}\/\d{2}$/;

    let job_title = document.getElementById("job_title").value.trim();
    let city = document.getElementById("city").value.trim();
    let type = document.getElementById("type").value.trim();
    let company_name = document.getElementById("company_name").value.trim();
    let department = document.getElementById("department").value.trim();
    let created_at = document.getElementById("created_at").value.trim();
    let end_date = document.getElementById("end_date").value.trim();

    if(job_title && typeof(job_title) === "string" && job_title.length >= 2 && job_title.length <= 255) {
        filters.job_title = job_title;
    }
    
    if(type && typeof(type) === "string" && type.length >= 3 && type.length <= 100) {
        filters.type = type;
    }
    
    if(department && typeof(department) === "string" && department.length >= 3 && department.length <= 100) {
        filters.department = department;
    }

    if(created_at && regexForDate.test(created_at)) {
        filters.created_at = created_at;
    }
    
    if(end_date && regexForDate.test(end_date)) {
        filters.end_date = end_date;
    }


    if(city && typeof(city) === "string" && city.length >= 2 && city.length <= 255) {
        filters.city = city;
    }
    
    if(company_name && typeof(company_name) === "string" && company_name.length >= 2 && company_name.length <= 255) {
        filters.company_name = company_name;
    }

    return filters;
}

async function getNextJobs() {
   if (!hasMoreJobs) return;
    if (window.innerWidth >= 640) {
        // العرض 640 بكسل أو أكثر
        start+=20
        end+=20;
    } else {
        // العرض أقل من 640 بكسل
        start+=10;
        end+=10;
      }

    await getJobsInformation(accessToken, start, end, getJobsByFilters());

}

document.getElementById("next_jobs").addEventListener("click", getNextJobs);

getJobsInformation(accessToken, start, end, getJobsByFilters); 


// When Clicking on Search Icon
search_icon.addEventListener("click", () => getJobsInformation(accessToken, start, end, getJobsByFilters)); 