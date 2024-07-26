import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LogOut } from "./authSlice";

const useAxiosInstance = () => {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const axiosInstance = axios.create({
    baseURL: apiUrl, // Replace with your API URL
    headers: {
      "Content-Type": "application/json",
    },
  });

  useEffect(() => {
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const { status } = error.response;
          if (status === 401) {
            console.error("Token expired or invalid");
            localStorage.removeItem("accessToken"); // Clear token
            navigate("/"); // Redirect to login page
            LogOut();
          } else if (status === 403) {
            error.isForbidden = true; // Add custom property to error
          } else if (status === 404) {
            error.notFound = true;
          } else if (status === 500) {
            error.serverError = true;
          }
        } else if (error.request) {
          // Handle network errors (no response received)
          console.error("Network error:", error.message);
          error.isNetworkError = true;
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  return axiosInstance;
};

export default useAxiosInstance;
