import { axiosInstance } from ".";

export const addShow = async (data) => {
  try {
    const response = await axiosInstance.post("/api/shows/add-show", data);
    return response.data;
  } catch (error) {
    console.error("Error adding show:", error);
  }
};

export const updateShow = async (data) => {
  try {
    const response = await axiosInstance.put(
      `/api/shows/update-show/${data?.showId}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating show:", error);
  }
};

export const getAllShowsByTheatreId = async (data) => {
  try {
    const response = await axiosInstance.get(
      `/api/shows/get-shows-for-theatre/${data?.theatreId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching shows by theatre ID:", error);
  }
};

export const deleteShow = async (showId) => {
  try {
    const response = await axiosInstance.delete(
      `/api/shows/delete-show/${showId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting show:", error);
  }
};

export const getAllTheatresForMovie = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/api/shows/get-theatres-for-movie",
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching theatres for movie:", error);
  }
};

export const getShowById = async (showId) => {
  try {
    const response = await axiosInstance.post(`/api/shows/get-show-by-id`, {
      id: showId,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching show by ID:", error);
  }
};
