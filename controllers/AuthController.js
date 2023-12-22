import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register new user
export const registerUser = async (req, res) => {
  const {username} = req.body

  try {
    // addition new
    const oldUser = await UserModel.findOne({ username });
    console.log(oldUser + 'the user')

    if (oldUser)
      return res.status(400).json({ message: "User already exists" });

    
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);
  req.body.password = hashedPass
  const newUser = new UserModel(req.body);
 
    // changed
    const user = await newUser.save();
   
    const token = jwt.sign(
      { username: user.username, id: user._id },
      'secret',
      { expiresIn: "1d" }
    );
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User

// Changed
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username: username });

    if (user) {
      const validity = await bcrypt.compare(password, user.password);

      if (!validity) {
        res.status(400).json("wrong password");
      } else {
        const token = jwt.sign(
          { username: user.username, id: user._id },
          'secret',
          { expiresIn: "1d" }
        );
        res.status(200).json({ user, token });
      }
    } else {
      res.status(404).json("User not found nicola");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
