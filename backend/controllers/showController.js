const Show = require("../models/showModel");

const addShow = async (req, res) => {
  try {
    const { name, movie, theatre, date, time, totalSeats, ticketPrice } =
      req.body;

    const newShow = new Show({
      name,
      movie,
      theatre,
      date,
      time,
      totalSeats,
      ticketPrice,
    });

    await newShow.save();

    res.status(201).json({
      success: true,
      message: "Show added successfully",
      show: newShow,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const deleteShow = async (req, res) => {
  try {
    const { id } = req.params;

    const show = await Show.findById(id);
    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    await Show.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Show deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateShow = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, movie, theatre, date, time, totalSeats, ticketPrice } =
      req.body;

    const show = await Show.findById(id);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    show.name = name || show.name;
    show.movie = movie || show.movie;
    show.theatre = theatre || show.theatre;
    show.date = date || show.date;
    show.time = time || show.time;
    show.totalSeats = totalSeats || show.totalSeats;
    show.ticketPrice = ticketPrice || show.ticketPrice;

    await show.save();

    res.status(200).json({
      success: true,
      message: "Show updated successfully",
      show,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllShowsByTheatreId = async (req, res) => {
  try {
    const { id } = req.params;

    const shows = await Show.find({ theatre: id }).populate("movie");

    if (!shows.length) {
      return res.status(200).json({
        data: [],
        success: false,
        message: "No shows found for this theatre",
      });
    }

    res.status(200).json({
      success: true,
      data: shows,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllTheatresForMovie = async (req, res) => {
  try {
    const { id, date } = req.body;
    const shows = await Show.find({ movie: id, date }).populate("theatre");
    //  Filter out unique theatres

    const uniqueTheatresAlongWithShows = shows.reduce((acc, show) => {
      const theatreId = show.theatre._id.toString();
      if (!acc.some((theatre) => theatre._id.toString() === theatreId)) {
        const showsOfTheatre = shows.filter(
          (show) => show.theatre._id.toString() === theatreId
        );

        acc.push({
          ...show.theatre._doc,
          shows: showsOfTheatre,
        });
      }
      return acc;
    }, []);

    res.status(200).json({
      success: true,
      data: uniqueTheatresAlongWithShows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getShowById = async (req, res) => {
  try {
    const { id } = req.body;

    const show = await Show.findById(id).populate("movie theatre");

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    res.status(200).json({
      success: true,
      data: show,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addShow,
  deleteShow,
  updateShow,
  getAllShowsByTheatreId,
  getAllTheatresForMovie,
  getShowById,
};
