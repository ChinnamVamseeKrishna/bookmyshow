import { axiosInstance } from "./";

export const RegisterUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/api/users/register", userData);
    return response;
  } catch (error) {
    return {
      status: error?.status,
      errorMessage: error.response.data?.message,
    };
  }
};

export const LoginUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/api/users/login", userData);
    return response;
  } catch (error) {
    return { status: error?.status, errorMessage: error.response.data.message };
  }
};

export const GetCurrentUser = async () => {
  try {
    const response = await axiosInstance.get("/api/users/get-current-user");
    return response.data;
  } catch (error) {
    return { status: error?.status, errorMessage: error.response.data.message };
  }
};
