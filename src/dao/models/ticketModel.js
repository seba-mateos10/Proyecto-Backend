const mongoose = require("mongoose");

const { Schema, model } = require("mongoose");

const collection = "tickets";

const ticketSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  purchaseDatetime: {
    type: Date,
    default: Date.now,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    required: true,
  },
});

const ticketModel = mongoose.models.Ticket || model("Ticket", ticketSchema);

module.exports = {
  ticketModel,
};
