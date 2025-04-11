const express = require("express");
const {
  addTheatre,
  updateTheatre,
  deleteTheatre,
  getTheatreByOwner,
  getAllTheatres,
} = require("../controllers/theatreController");
const theatreRouter = express.Router();

theatreRouter.post("/add-theatre", addTheatre);
theatreRouter.put("/update-theatre", updateTheatre);
theatreRouter.delete("/delete-theatre/:id", deleteTheatre);
theatreRouter.get("/get-theatre/:id", getTheatreByOwner);
theatreRouter.get("/get-all-theatres", getAllTheatres);

module.exports = theatreRouter;
