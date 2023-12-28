import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { profile, reset } from "../../features/auth/authSlice";

import avatar from "../../images/avatar.jpg";
import { toast } from "react-toastify";

const Profile = () => {
  const [formData, setFormData] = useState({
    profile_image: "",
    bio: "",
  });

  const { profile_image, bio } = formData;

  const dispatch = useDispatch();

  // const {user, isSuccess, isError, message} = useSelector((state) => state.auth)

  // useEffect(() => {
  //   if (isError) {
  //       toast.error(message)
  //   }
  //   // if (isSuccess) {
  //   //     toast.success('profile Updated!')
  //   // }
  // })

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.id]: e.target.value,
    }));
  };
  // convert image to base64 for profile pic upload
  const convsertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const base64 = await convsertToBase64(file);
    setFormData((prevData) => ({
      ...prevData,
      profile_image: base64,
    }));
    console.log("profileImg:", profile_image);
  };

  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      profile_image: profile_image,
      bio: bio,
    };
    if (user) {
      dispatch(profile({ id: user.id, userData }));
    }
    console.log("userId:", user.id, "userData:", userData);
  };

  return (
    <>
      <div>
        <h1>Set up your profile</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="profile_image">
          <img width={100} src={avatar} alt="profile_picture" />
        </label>

        <input
          onChange={handleFileUpload}
          type="file"
          name="profile_image"
          id="profile_image"
          label="image"
          accept=".jpeg, .png, .jpg"
        />
        <input
          onChange={handleChange}
          type="text"
          name="bio"
          id="bio"
          value={bio}
          placeholder="bio"
        />

        <div>
          <button type="submit">Save</button>
        </div>
      </form>
    </>
  );
};

export default Profile;
