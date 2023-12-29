const bcrypt = require("bcryptjs");
const { generateToken } = require("../../middleware/authMiddleware.js");

const userModel = require("../../model/userModel.js");

exports.registerUser = async (req, res) => {
  try {
    const { first_name, last_name, nick_name, dob, gender, email, password } = req.body;

    if (!( first_name || last_name || email || password || nick_name || dob || gender )) {
      return res.status(400).json("Please fill in all fields");
    }
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(400).json("User already exist");
   }
    const salt = await bcrypt.genSalt(5);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      nick_name,
      dob,
      gender
    });

    if (user) {
      res.status(200).json({
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        nick_name: user.nick_name,
        email: user.email,
        verified_email: user.verified_email,
        dob: user.dob,
        gender: user.gender,
        password: user.password,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    console.error("registration error:", error);
    return res.status(500).json("Internal Server Error");
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json("User not available!");
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json("Invalid password!");
    }
    res.status(200).json({
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      nick_name: user.nick_name,
      email: user.email,
      verified_email: user.verified_email,
      dob: user.dob,
      gender: user.gender,
      password: user.password,
      token: generateToken(user._id)
     });
  } catch (error) {
    console.error("Login error", error);
    return res.status(500).json("Internal Server Error");
  }
};

exports.userProfile = async (req, res) => {
  try {
    const {
      profile_image,
      bio,
    } = req.body;
    const {id}  = req.params;

    if (!id) {
      return res.status(401).json("Not me authorized");
    }

    const user = await userModel.findByIdAndUpdate(
        id,
      {
        profile_image,
        bio,
      },
      { new: true }
    );

    if (!user) {
      return res.status(401).json("User not found!");
    }else{
      res.status(200).json({ 
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        nick_name: user.nick_name,
        email: user.email,
        verified_email: user.verified_email,
        dob: user.dob,
        gender: user.gender,
        password: user.password,
        token: generateToken(user._id)
      })
    }
  } catch (error) {
    console.error("profile:", error);
    return res.status(500).json("Internal Server Error");
  }
};
