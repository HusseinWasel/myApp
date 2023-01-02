const mongoose = require("mongoose");
const tripSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["Hiking", "Cities", "Island"],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ref: String,
});

tripSchema.index({ title: "text", description: "text", category: "text" });
const trip = mongoose.model("trip", tripSchema);
trip.createIndexes();

module.exports = trip;