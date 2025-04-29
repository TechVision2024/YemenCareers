import axiosInstance from "./config.js";

const accounts_container = document.getElementById("accounts_container");
let accessToken = localStorage.getItem("accessToken");
let start,end;

const next_jobs_container = document.createElement("div");
next_jobs_container.id = "next_jobs";
next_jobs_container.className = "w-screen container";
next_jobs_container.innerHTML = `
  <button class="font-inter-700 font-bold text-black text-[14px] flex items-center cursor-pointer my-2 mr-4 dark:text-white">
    <svg class="ml-1 text-primary-color dark:text-dark-primary-color" width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 11L6 5.72393L1 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    التالي
  </button>
`;

// to get number of users depending on width of screen
document.addEventListener("DOMContentLoaded", () => {
    function checkScreenWidth() {
      if (window.innerWidth >= 640) {
        // العرض 640 بكسل أو أكثر
        start = 0;
        end = 20;
    } else {
        // العرض أقل من 640 بكسل
        start = 0;
        end = 10;
      }
    }
  
    // تنفيذ عند التحميل
    checkScreenWidth();
  
    // إعادة الفحص عند تغيير حجم النافذة
    window.addEventListener("resize", checkScreenWidth);
  });

const getUsersInformation = async (token, start, end) => {

    try{
        let response = await axiosInstance.get(`/api/v1/user/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }, params : {
                s: start, e: end ,
            }
        });

        let data = response.data;

        if(data.length === 0) {
            accounts_container.innerHTML = `
            <div class="flex justify-center items-center h-full">
                <p class="text-gray-500">لا توجد حسابات</p>
            </div>`;
        } else if (data.length > 0) {
            accounts_container.innerHTML = data.map((user) => {
                `<!-- Account Container -->
                  <div class=" w-10/12 container mx-auto my-4 pb-4 bg-white rounded-2xl h-40 p-4 border grid grid-cols-3 grid-rows-4 space-y-4 border-[#CACECB] transition-all duration-350 hover:border-b-8 hover:border-primary-color md:grid-cols-5 md:grid-rows-1 md:w-11/12 md:py-12 md:h-64 md:gap-x-1 lg:gap-x-4 lg:px-14 xl:pl-8 xl:gap-x-0 dark:bg-[#2B2B2B] dark:hover:border-[#2CE6D6] dark:border-[#8080808C] ">
                    <div class="row-span-2 md:row-span-1 md:-translate-x-4 lg:translate-x-0 ">
                      <img src=${user.profile_image_url} alt="Logo" class="size-12.5 rounded-2xl hover:border md:size-24 hover:border-blue-500">
                    </div>
                    <!-- Company Name -->
                      <di v class=" col-start-2 translate-x-4 translate-y-1 md:flex md:items-center md:-translate-x-8 lg:translate-x-0 md:col-span-2 lg:justify-center "> 
                        <h3 class=" font-inter-700 text-[14px] text-light-blue font-bold md:text-2xl dark:text-[#5AF3E9]">${user.name}</h3>
                      </di>
                      <!-- Email Account -->
                     <div class="col-span-2 row-start-3 flex justify-end md:col-span-2 md:col-start-auto md:justify-start md:row-start-auto" >
                      <div class="w-40 text-center mr-6 relative md:mt-0 md:translate-x-4 md:flex md:items-center md:before:w-[1px] md:before:h-14 before:bg-[#CACECB] md:before:absolute md:before:ml-4 md:before:-right-5.5 md:mr-9 lg:md:before:static lg:w-60 lg:mr-24 xl:mr-32 xl:before:ml-15 xl:w-fit">
                        <p class="font-inter-700 text-[12px] text-[#B3B3B3] font-bold md:text-[16px] md:text-black xl:translate-x-4 dark:text-white ">${user.email}</p> 
                      </div>
                     </div>
                    
                    <!-- site -->
                    <div class="flex justify-end col-span-2 col-start-3 row-start-4 md:mt-0 md:items-center md:translate-y-0 md:-translate-x-12 lg:-translate-x-36 md:col-start-1 md:row-start-2 md:col-auto">
                      <p class="font-inter-700 font-bold text-[#B3B3B3] text-[12px] md:text-[16px] lg:text-[16px] xl:text-[22px] dark:dark:text-dark-text-color">${user.website}</p> 
                    </div>
    
                       <!-- Phone Number -->
                      <div class="flex items-center translate-x-3 w-29 justify-center col-start-1 row-start-4 md:mt-0 md:flex md:justify-center md:items-center md:col-start-2 md:row-start-2 md:w-40 md:-translate-x-18 lg:-translate-x-40 xl:w-full">
                          <p class="font-inter-700 font-bold text-[#B3B3B3] text-[12px] md:text-[16px] xl:text-[22px] dark:text-dark-text-color">${user.phone}</p>
                      </div>
                      <!-- Days Left -->
                      <div class="col-start-3 row-span-2 translate-y-2  md:translate-y-0 md:-translate-x-18 md:flex md:justify-end md:items-center md:col-start-3 md:row-start-2 lg:-translate-x-36 xl:-translate-x-26">
                        <div class="border w-20 h-5 border-[#FF4747] rounded-[5px] bg-green-100 flex items-center justify-center md:rounded-none md:h-7 md:w-26 lg:w-32 xl:w-40 dark:bg-transparent">
                          <p class="font-semi-bold text-[11px] text-[#FF4747] font-semibold md:text-[13px] ">${user.days_since_creation}</p>
                        </div>
                      </div>
    
                      <!-- Location -->
                      <div class="h-7 translate-x-4 -translate-y-1 col-start-2 row-start-2 md:translate-y-0 md:col-start-4 md:row-start-2 md:flex md:justify-center md:-translate-x-9 lg:-translate-x-24 xl:-translate-x-8 ">
                        <p class="font-inter-700 font-bold text-[10px] text-[#B3B3B3] md:text-[20px] dark:text-dark-text-color">${user.address}</p>
                      </div>
    
                      <!-- Type Company -->
                      <div class="h-7 w-15 col-start-1 row-start-3 md:mt-0 md:w-full md:col-start-5 md:row-start-2 lg:-translate-x-12 xl:translate-x-8 ">
                        <p class="font-inter-700 font-bold text-[12px] text-[#B3B3B3] md:text-[20px] dark:text-dark-text-color">${user.company_type}</p>
                      </div>
                  </div>`
            }).join(" ");
        }

        if (window.innerWidth >= 640 && data.length > 20) {
            document.getElementById("main").appendChild(next_jobs_container)
        } else if (window.innerWidth < 640 && data.length > 10) {
            document.getElementById("main").appendChild(next_jobs_container)
        }

        
    } catch(error) { 
        if (error.response) {
            const status = error.response.status;

            if (status === 401) {
                try {
                    const refreshResponse = await axiosInstance.get(`/api/v1/user/refresh`);
                    localStorage.setItem("accessToken", refreshResponse.data.accessToken);
                    accessToken = refreshResponse.data.accessToken;
                    return getUsersInformation(accessToken, start, end); 
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
            } else if (status === 403) {
                Swal.fire({
                    icon: "error",
                    title: "Forbidden",
                    text: "You are not admin.",
                    confirmButtonColor: "#d33",
                });
            } else if (status === 404) {
                Swal.fire({
                    icon: "error",
                    title: "NotFound",
                    text: "There is no user requests.",
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

// when Click on and div
async function showInformationOfUser (token,id) {

    try {
        let response = await axiosInstance.patch(`/api/v1/user/info/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    
        let data = response.data;
        document.getElementById("t").setAttribute("key", data.id)
        document.getElementById("logo_request").setAttribute("src", data.profile_image_url)
        document.getElementById("company_name_request").innerHTML = data.name;
        document.getElementById("site_request").setAttribute("href", data.website);
        document.getElementById("email_request").setAttribute("href", data.email);
        document.getElementById("company_type_request").innerHTML = data.company_type;
        document.getElementById("address_request").innerHTML = data.address;
        document.getElementById("phone_request").innerHTML = data.phone;
        document.getElementById("description_request").innerHTML = data.description;
        document.getElementById("accept_request_btn").setAttribute("key", data.id);
    } catch(error) { 
        if (error.response) {
            const status = error.response.status;

            if (status === 401) {
                try {
                    const refreshResponse = await axiosInstance.get(`/api/v1/user/refresh`);
                    localStorage.setItem("accessToken", refreshResponse.data.accessToken);
                    accessToken = refreshResponse.data.accessToken;
                    return showInformationOfUser(accessToken,id); 
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
            } else if (status === 403) {
                Swal.fire({
                    icon: "error",
                    title: "Forbidden",
                    text: "You are not admin.",
                    confirmButtonColor: "#d33",
                });
            } else if (status === 404) {
                Swal.fire({
                    icon: "error",
                    title: "NotFound",
                    text: "User not found.",
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


const accept_action =  async (token) => {
    let id = document.getElementById("accept_request_btn").getAttribute("key");
    try{
        await axiosInstance.get(`/api/v1/user/active/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        Swal.fire({
            icon: "Success",
            title: "User Accepted ✅",
            text: `User (${id}) has been accepted successfully.`,
            confirmButtonText: "OK",
            confirmButtonColor: "#efb700",
        }) .then(() => {
            window.location.href = "/src/HTML/admin_home.html"
        })
        

    } catch(error) { 
        if (error.response) {
            const status = error.response.status;

            if (status === 401) {
                try {
                    const refreshResponse = await axiosInstance.get(`/api/v1/user/refresh`);
                    localStorage.setItem("accessToken", refreshResponse.data.accessToken);
                    accessToken = refreshResponse.data.accessToken;
                    return accept_action(accessToken); 
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
            } else if (status === 403) {
                Swal.fire({
                    icon: "error",
                    title: "Forbidden",
                    text: "You are not admin.",
                    confirmButtonColor: "#d33",
                });
            } else if (status === 404) {
                Swal.fire({
                    icon: "error",
                    title: "NotFound",
                    text: "User not found.",
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

const reject_action =  async (token) => {
    let id = document.getElementById("accept_request_btn").getAttribute("key");
    try{
        await axiosInstance.get(`/api/v1/user/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        Swal.fire({
            icon: "Success",
            title: "User Deleted ✅",
            text: `User (${id}) has been Deleted successfully.`,
            confirmButtonText: "OK",
            confirmButtonColor: "#efb700",
        }) .then(() => {
            window.location.href = "/src/HTML/admin_home.html"
        })

    } catch(error) { 
        if (error.response) {
            const status = error.response.status;

            if (status === 401) {
                try {
                    const refreshResponse = await axiosInstance.get(`/api/v1/user/refresh`);
                    localStorage.setItem("accessToken", refreshResponse.data.accessToken);
                    accessToken = refreshResponse.data.accessToken;
                    return reject_action(accessToken); 
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
            } else if (status === 403) {
                Swal.fire({
                    icon: "error",
                    title: "Forbidden",
                    text: "You are not admin.",
                    confirmButtonColor: "#d33",
                });
            } else if (status === 404) {
                Swal.fire({
                    icon: "error",
                    title: "NotFound",
                    text: "User not found.",
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
getUsersInformation(accessToken,start , end);

document.getElementById("accept_request_btn").addEventListener("click", () => accept_action(token));
document.getElementById("reject_request_btn").addEventListener("click", () => reject_action(token));


// still to do when clicking on the div
// still to deal with links