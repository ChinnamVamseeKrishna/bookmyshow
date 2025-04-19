import { axiosInstance } from ".";

export const makePayment = async (amount) => {
  try {
    const response = await axiosInstance.post("/api/booking/make-payment", {
      amount,
    });
    return response?.data;
  } catch (error) {
    console.log("Error while making payment", error);
  }
};

export const bookShow = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/api/booking/book-show",
      payload
    );
    return response?.data;
  } catch (error) {
    console.log("Error while booking show", error);
  }
};

export const getAllBookings = async () => {
  try {
    const response = await axiosInstance.get("/api/booking/get-all-bookings");
    return response?.data;
  } catch (error) {
    console.log("Error while getting all bookings", error);
  }
};
