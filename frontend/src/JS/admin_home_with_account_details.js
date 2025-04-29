const params = new URLSearchParams(window.location.search);
const id = params.get("id"); 

// when Click on and div
async function showInformationOfUser (token,id) {

    try {
        let response = await axiosInstance.patch(`/api/v1/user/info/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    
        let data = response.data;
        document.getElementById("logo_request").setAttribute("src", data.profile_image_url)
        document.getElementById("company_name_request").innerHTML = data.name;
        document.getElementById("site_request").setAttribute("href", data.website);
        document.getElementById("email_request").setAttribute("href", data.email);
        document.getElementById("company_type_request").innerHTML = data.company_type;
        document.getElementById("address_request").innerHTML = data.address;
        document.getElementById("phone_request").innerHTML = data.phone;
        document.getElementById("description_request").innerHTML = data.description;
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


const accept_action =  async (token, id) => {
    
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

const reject_action =  async (token, id) => {
    
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

document.getElementById("accept_request_btn").addEventListener("click", () => accept_action(token, id));
document.getElementById("reject_request_btn").addEventListener("click", () => reject_action(token, id));

// still to deal with links
