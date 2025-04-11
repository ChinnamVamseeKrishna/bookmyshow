import { axiosInstance } from ".";

export const getAllMovies = async () => {
  try {
    const response = await axiosInstance.get("/api/movies/get-all-movies");
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const addMovie = async (movie) => {
  try {
    const response = await axiosInstance.post("/api/movies/add-movie", movie);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateMovie = async (movie) => {
  try {
    const response = await axiosInstance.put("/api/movies/update-movie", movie);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteMovie = async (movieId) => {
  try {
    const response = await axiosInstance.post(`/api/movies/delete-movie`, {
      id: movieId,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
