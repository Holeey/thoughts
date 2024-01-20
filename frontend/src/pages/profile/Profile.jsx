import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { profile, reset } from "../../features/auth/authSlice";

import avatar from "../../images/avatar.jpg";
import { toast } from "react-toastify";


const Profile = () => {
  const [formData, setFormData] = useState({
    profile_image: "",
    bio: "",
    newPassword: "", 
    confirmPassword: "",
    nick_name: "", 
    newEmail: ""
  });

  const { profile_image, bio, newPassword, confirmPassword, nick_name, newEmail } = formData;

  const dispatch = useDispatch();


  const { user, isSuccess, isError, message } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isError) {
        toast.error(message)
    }
    else if (isSuccess) {
        toast.success('profile Updated!')  
    }
    dispatch(reset())
  }, [user, isSuccess, isError, message, dispatch])
 
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
  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.id]: e.target.value,
    }))
  };
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const base64 = await convsertToBase64(file);
    setFormData((prevData) => ({
      ...prevData,
      profile_image: base64,
    }))
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      profile_image,
      bio,
      nick_name,
      password: newPassword,
      email: newEmail
    };
    // Check if any field is filled
    if (Object.values(userData).some(value => value !== undefined && value !== '')) {
        dispatch(profile({ id: user.id, userData }));
    } else {
      toast.error('Empty field(s)');
    }
  };
  return (
    <>
      <div>
        <h1>Set up your profile</h1>
      </div>
      <form onSubmit={handleSubmit}>
        {}
        <label htmlFor="profile_image">
          <img width={100} src={user?.profile_image || avatar} alt="profile_picture" />
        </label>

        <input
          onChange={handleFileUpload}
          type="file"
          name="profile_image"
          id="profile_image"
          label="image"
          accept=".jpeg, .png, .jpg"
        />
        <label htmlFor="bio">Bio:</label>
        <input
          onChange={handleChange}
          type="text"
          name="bio"
          id="bio"
          value={bio}
          placeholder="bio"
        />
        <label htmlFor="nick_name">Psuedo name: </label>
        <input
          onChange={handleChange}
          type="text"
          name="nick_name"
          id="nick_name"
          value={nick_name}
        />
        <label htmlFor="newEmail">Email:</label>
        <input
          onChange={handleChange}
          type="email"
          name="newEmail"
          id="newEmail"
          value={newEmail}
        />
        <div>
        <label htmlFor="newPassword">New Password:</label>
        <input  onChange={handleChange} type="Password" id="newPassword" name="newPassword" value={newPassword} />
        <label htmlFor="newPassword">Confirm Password:</label>
        <input onChange={handleChange} type="password" id="confirmPassword" name="confirmPassword" value={confirmPassword} />
        </div>
         <div>
          <button type="submit">Save</button>
        </div>

      </form>
    </>
  );
};

export default Profile;
