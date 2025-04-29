const baseURL = " https://api-yemencareers.up.railway.app/";
const axiosInstance = axios.create({
    baseURL: baseURL,
    withCredentials: true,
  });

  export default axiosInstance