const Theatre = require("../models/theatreModel");

const addTheatre = async (req, res) => {
  try {
    const newTheatre = new Theatre(req.body);
    await newTheatre.save();
    res.status(201).json({
      success: true,
      message: "Theatre added successfully",
      theatre: newTheatre,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const updateTheatre = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    const updatedTheatre = await Theatre.findByIdAndUpdate(id, updateData);
    if (!updatedTheatre) {
      return res.status(404).json({
        success: false,
        message: "Theatre not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Theatre updated successfully",
      theatre: updatedTheatre,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const deleteTheatre = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTheatre = await Theatre.findByIdAndDelete(id);
    if (!deletedTheatre) {
      return res.status(404).json({
        success: false,
        message: "Theatre not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Theatre deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const getTheatreByOwner = async (req, res) => {
  try {
    const { id } = req.params;
    const theatre = await Theatre.find({ owner: id });
    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: "Theatre not found",
      });
    }
    res.status(200).json({
      success: true,
      theatre,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
const getAllTheatres = async (req, res) => {
  try {
    const theatres = await Theatre.find().populate("owner");
    res.status(200).json({
      success: true,
      theatres,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = {
  addTheatre,
  updateTheatre,
  deleteTheatre,
  getAllTheatres,
  getTheatreByOwner,
};
