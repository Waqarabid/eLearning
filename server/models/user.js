import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
      min: 6,
      max: 128,
    },
    picture: {
      type: String,
      default: "/avatar.png",
    },
    role: {
      type: [String],
      default: ["Subscriber"],
      enum: ["Subscriber", "Instructor", "Admin"],
    },
    stripe_account_id: "",
    stripe_seller: {},
    stripeSession: {},
  },
  { timestamps: true }
);

export default mongoose.modal("User", userSchema);