import mongoose from "mongoose";

mongoose.pluralize(null);

const collection = "Tickets";

const schema = new mongoose.Schema(
  {
    code: { type: String, unique: true },
    amount: { type: Number, required: true, default: 0.0 },
    purchaser_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Cart",
    },
  },
  {
    timestamps: true,
  }
);

const model = mongoose.model(collection, schema);

export default model;
