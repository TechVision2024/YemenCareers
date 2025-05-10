import axiosInstance from './config.js' 

document.addEventListener("DOMContentLoaded", async function () {
    try {
        const refreshResponse = await axiosInstance.get(`/api/v1/user/refresh`);
        localStorage.setItem("accessToken", refreshResponse.data.accessToken);
        let header = document.getElementById("header-container");
        if(header)
        {
            header.id = "user-header-container";
        }
    } catch(error) {
        console.log("Error: " + error);
    }
})