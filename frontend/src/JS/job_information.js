import axiosInstance from './config.js' 


let accessToken = localStorage.getItem("accessToken");
const params = new URLSearchParams(window.location.search);
const job_id = params.get("job-id");

document.addEventListener("DOMContentLoaded", async function () {
    try {
        const refreshResponse = await axiosInstance.get(`/api/v1/user/refresh`);
        localStorage.setItem("accessToken", refreshResponse.data.accessToken);
        let header = document.getElementById("header-container");
        header.id = "user-header-container";

        accessToken = localStorage.getItem("accessToken");
        getUserInfo(accessToken);
    } catch(error) {
        console.log("Error: " + error);
    }
})

const getJobInformation = async (token,jobId) => {
    try {
        let response = await axiosInstance.get(`/api/v1/job/info/${jobId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        let data = response.data;

        document.getElementById("job_title").textContent = data.title;
        document.getElementById("Company_name").textContent = data.company_name;
        document.getElementById("company_image").setAttribute("src", data.company_image);
        document.getElementById("job_type").textContent = data.type;
        document.getElementById("city").textContent = data.city;
        document.getElementById("department").textContent = data.department;
        document.getElementById("end_date").textContent = data.end_date;
        document.getElementById("remaining_days").textContent = data.remaining_days;
        document.getElementById("created_at").textContent = data.created_at;
        document.getElementById("end_at").textContent = data.updated_at;

        document.getElementById("body").textContent = data.body;
        document.getElementById("apply_url").setAttribute("href", data.apply_url);

        if(data.status === "open") {
            document.getElementById("remaining_days_container").classList.add(" text-[#00B448]","border-[#00B448  sm:text-medium-blue ");
        } else if (data.status === "close") {
            document.getElementById("remaining_days_container").classList.add("text-[#FF4747]","border-[#FF4747] sm:text-[#FF4747 ");
        }
    } catch(error) {
        if (error.response) {
            const status = error.response.status;

            if (status === 401) {
                try {
                    const refreshResponse = await axiosInstance.get(`/api/v1/user/refresh`);
                    localStorage.setItem("accessToken", refreshResponse.data.accessToken);
                    accessToken = refreshResponse.data.accessToken;
                    return getJobInformation(accessToken); 
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
            } else if (status === 404) {
                Swal.fire({
                    icon: "error",
                    title: "BadRequest",
                    text: "This job does not exist.",
                    confirmButtonColor: "#d33",
                });
            } else if (status === 404) {
                Swal.fire({
                    icon: "error",
                    title: "NotFound",
                    text: "There is no Jobs.",
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

getJobInformation(accessToken, job_id);