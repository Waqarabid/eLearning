import User from "../models/user";
import { hashPassword, comparePassword } from "../utils/auth";

export const register = async (req, res) => {
  try {
    // console.log("req.body", req.body);
    const { name, email, password } = req.body;
    // validation
    if (!name) return res.status(400).send("Name is required");
    if (!password || password.length < 6) {
      return res
        .status(400)
        .send("Password must be at least 6 characters long");
    }
    // check if user already exists
    let userExist = await User.findOne({ email }).exec();
    if (userExist) return res.status(400).send("User already exists");

    // hash password
    const hashedPassword = await hashPassword(password);

    // register user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    return res.status(201).send("User created");
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Please try again");
  }
};
