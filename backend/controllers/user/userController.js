const bcrypt = require("bcryptjs");
const { generateToken } = require("../../middleware/authMiddleware.js");

const userModel = require("../../model/userModel.js");


exports.getUserData = async (req, res) => {
  try {
    const { id } = req.params
    const userProfile = await userModel.findOne({ _id: id });
    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }
    return res.status(201).json({ userProfile });
  } catch (error) {
    console.error('getUserProfile Error:', error)
    res.status(500).json('Internal error')
  }
}


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

    user.save()

    if (user) {
      res.status(200).json({
        id: user._id,
        nick_name: user.nick_name,
        email: user.email,
        verified_email: user.verified_email,
        profile_image: user.profile_image,
        bio: user.bio,
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
    
    user.save()

    res.status(200).json({
      id: user._id,
      nick_name: user.nick_name,
      email: user.email,
      verified_email: user.verified_email,
      profile_image: user.profile_image,
      bio: user.bio,
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
      nick_name, 
      email,
      password
    } = req.body;
    const {id}  = req.params;

    if (!id) {
      return res.status(401).json("Not authorized");
    }

   const updateFields = {};

   if (profile_image) updateFields.profile_image = profile_image
   if (bio) updateFields.bio = bio
   if (nick_name) updateFields.nick_name = nick_name
   if (email) updateFields.email = email
   if (password) updateFields.password = password

   if (Object.keys(updateFields).length === 0) {
    res.status(401).json({message:'No fields to update'})
   }
    const user = await userModel.findByIdAndUpdate(
        id,
      { $set: updateFields },
      { new: true }
    );

    user.save()

    if (!user) {
      return res.status(401).json("User not found!");
    }else{
      res.status(200).json({ 
        id: user._id,
        nick_name: user.nick_name,
        email: user.email,
        verified_email: user.verified_email,
        profile_image: user.profile_image,
        bio: user.bio,
        token: generateToken(user._id)
      })
    }
  } catch (error) {
    console.error("profile:", error);
    return res.status(500).json("Internal Server Error");
  }
};
