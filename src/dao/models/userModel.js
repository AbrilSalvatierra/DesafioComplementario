import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: { type: String },
  last_name: { type: String },
  email: { type: String, required: true },
  age: { type: Number },
  password: { type: String, required: true },
  role: { type: String, default: "usuario" },
});

const User = mongoose.model("User", userSchema);

export default User;
