import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { register, reset } from "../../features/auth/authSlice.js";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    nick_name: "",
    email: "",
    dob: "",
    gender: "",
    password: "",
    password2: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    first_name,
    last_name,
    nick_name,
    dob,
    gender,
    email,
    password,
    password2,
  } = formData;
  const { user, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess || user) {
      navigate("/dashboard");
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== password2) {
      toast.error("passwords do not match");
    } else {
      const userData = {
        first_name: first_name,
        last_name: last_name,
        nick_name: nick_name,
        email: email,
        gender: gender,
        dob: dob,
        password: password,
      };
      dispatch(register(userData));
    }
  };

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <>
      <div>Sign Up</div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="first_name">First nmae: </label>
          <input
            onChange={handleChange}
            type="text"
            name="first_name"
            id="first_name"
            value={first_name}
          />

          <label htmlFor="last_name">Last name: </label>
          <input
            onChange={handleChange}
            type="text"
            name="last_name"
            id="last_name"
            value={last_name}
          />
        </div>
        <label htmlFor="nick_name">Psuedo name: </label>
        <input
          onChange={handleChange}
          type="text"
          name="nick_name"
          id="nick_name"
          value={nick_name}
        />
        <label htmlFor="email">Email:</label>
        <input
          onChange={handleChange}
          type="email"
          name="email"
          id="email"
          value={email}
        />

        <label htmlFor="gender">Date of birth (dob): </label>
        <input
          onChange={handleChange}
          type="date"
          name="dob"
          id="dob"
          value={dob}
        />
        <label htmlFor="gender">Gender: </label>
        <select id="gender" name="gender">
          <option value={"male"}>Male</option>
          <option value={"female"}>Female</option>
        </select>

        <label htmlFor="password">Password:</label>
        <input
          onChange={handleChange}
          type="text"
          name="password"
          id="password"
          value={password}
        />

        <label htmlFor="password2">Confirm password:</label>
        <input
          onChange={handleChange}
          type="text"
          name="password2"
          id="password2"
          value={password2}
        />

        <div>
          <button type="submit">SignUp</button>
        </div>
      </form>
    </>
  );
};

export default Register;
