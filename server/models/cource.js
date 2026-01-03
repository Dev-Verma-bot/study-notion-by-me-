const mongoose = require("mongoose");

const cource = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    required: true,
    trim: true,
  },

  duration: {
    type: String,
  },

  progress_percentage: {
    type: String,
  },

  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },

  what_you_will_learn: {
    type: String,
    required: true,
    trim: true,
  },

  cource_content: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "section",
      required: true,
    },
  ],

  rating_and_review: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rating_and_review",
    },
  ],

  price: {
    type: Number,
    required: true,
    trim: true,
  },

  thumbnail: {
    type: String,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
  },

  tag: {
    type: [String],
    required: true,
  },

  students_enrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  ],

  status: {
    type: String,
    enum: ["Draft", "Published"],
    default: "Draft",
  },

  created_at: {
    type: Date,
    default: Date.now, 
  },

  instructions: {
    type: [String],
  },
});

module.exports = mongoose.model("cource", cource);
