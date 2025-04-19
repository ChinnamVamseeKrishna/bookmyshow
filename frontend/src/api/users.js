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

export const ForgotPassword = async (value) => {
  try {
    const response = await axiosInstance.patch(
      "/api/users/forgot-password",
      value
    );
    return response.data;
  } catch (error) {
    return { status: error?.status, errorMessage: error.response.data.message };
  }
};
export const ResetPassword = async (value, email) => {
  try {
    const response = await axiosInstance.patch(
      `/api/users/reset-password/${email}`,
      value
    );
    return response.data;
  } catch (error) {
    return { status: error?.status, errorMessage: error.response.data.message };
  }
};
