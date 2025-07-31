import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generate_token } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { full_name, email, password } = req.body;
  try {
    // hash password? use bcryptjs
    // One way hashing but it is deterministic
    if (!full_name || !email || !password) {
      return res
        .status(400)
        .send({ message: "Please fill out all the fields" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .send({ message: "Password must be atleast 6 characters" });
    }
    const user = await User.findOne({ email }); // {email}
    if (user) {
      return res.status(400).send({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10); // 10 is general convention
    const hashed_password = await bcrypt.hash(password, salt);

    const new_user = new User({
      full_name, //full_name: full_name,
      email,
      password: hashed_password,
    });

    if (new_user) {
      // generate jwt token
      generate_token(new_user._id, res);
      await new_user.save(); // save user to db

      res.status(201).json({
        //201 - something is created successfully
        _id: new_user._id,
        full_name: new_user.full_name,
        email: new_user.email,
        profile_pic: new_user.profile_pic,
      });
    } else {
      return res.status(400).send({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" }); // The malicious user should not know which one is wrong
    }
    const is_correct_password = await bcrypt.compare(password, user.password);

    if (!is_correct_password) {
      return res.status(400).json({ message: "Invalid Credentials" }); // The malicious user should not know which one is wrong
    }

    generate_token(user._id, res);

    res.status(200).json({
      _id: user._id,
      full_name: user.full_name,
      email: user.email,
      profile_pic: user.profile_pic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  // Just clearing out the cookies
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged Out Successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// to update profile image, we need a service so that we can uplaod our images into - cloudnary

export const update_profile = async (req, res) => {
  try {
    const { profile_pic } = req.body;
    const userId = req.user._id;

    if (!profile_pic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profile_pic); // cloudinary is not a db, its jus a bucket for our images
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profile_pic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in check Auth: " + error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
