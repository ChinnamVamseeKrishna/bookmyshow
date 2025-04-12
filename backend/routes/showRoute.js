const {
  addShow,
  updateShow,
  deleteShow,
  getAllShowsByTheatreId,
  getShowById,
  getAllTheatresForMovie,
} = require("../controllers/showController");

const showRouter = require("express").Router();

showRouter.post("/add-show", addShow);
showRouter.put("/update-show/:id", updateShow);
showRouter.delete("/delete-show/:id", deleteShow);
showRouter.get("/get-shows-for-theatre/:id", getAllShowsByTheatreId);
showRouter.post("/get-theatres-for-movie", getAllTheatresForMovie);
showRouter.post("/get-show-by-id", getShowById);

module.exports = showRouter;
