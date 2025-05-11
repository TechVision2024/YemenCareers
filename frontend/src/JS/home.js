import axiosInstance from './config.js' 

document.addEventListener("DOMContentLoaded", async function () {
    try {
        const refreshResponse = await axiosInstance.get(`/api/v1/user/refresh`);
        localStorage.setItem("accessToken", refreshResponse.data.accessToken);
        let header = document.getElementById("header-container");

        let accessToken = localStorage.getItem("accessToken");
        getUserInfo(accessToken);
    } catch(error) {
        console.log("Error: " + error);
    }
})