import { axiosInstance } from ".";

export const addTheatre = async (data) => {
  try {
    const response = await axiosInstance.post(
      "/api/theatres/add-theatre",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error adding theatre:", error);
  }
};

export const getAllTheatres = async () => {
  try {
    const response = await axiosInstance.get("/api/theatres/get-all-theatres");
    return response.data;
  } catch (error) {
    console.error("Error fetching theatres:", error);
  }
};

export const getTheatreByOwnerId = async (ownerId) => {
  try {
    const response = await axiosInstance.get(
      `/api/theatres/get-theatre/${ownerId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching theatre by owner ID:", error);
  }
};

export const updateTheatre = async (data) => {
  try {
    const response = await axiosInstance.put(
      "/api/theatres/update-theatre",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating theatre:", error);
  }
};

export const deleteTheatre = async (theatreId) => {
  try {
    const response = await axiosInstance.delete(
      `/api/theatres/delete-theatre/${theatreId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting theatre:", error);
  }
};
