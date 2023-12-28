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
    password2: ""
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { first_name, last_name, nick_name, dob, email, password, password2 } = formData
  const { user, isError, isSuccess, message } = useSelector((state) => state.auth)

   useEffect(() => {
    if (isError) {
      toast.error(message)
    }
    if (isSuccess || user) {
      toast.success('Sign up successful')
      navigate('/dashboard')
    }
    dispatch(reset())
   }, [isError, isSuccess, user, message, navigate, dispatch]);

   const handleSubmit = (e) => {
    e.preventDefault()
  
    if (password !== password2) {
      toast.error('passwords do not match')
    } else {
    const userData = {
      first_name: first_name, 
      last_name: last_name, 
      nick_name: nick_name,
      email: email, 
      dob: dob,
      password: password
    }
      dispatch(register( userData ))
    }
  }

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
            <label htmlFor="first_name">
              <input
                onChange={handleChange}
                type="text"
                name="first_name"
                id="first_name"
                value={first_name}
                placeholder="First Name"
              />
            </label>
            <label htmlFor="last_name">
              <input
                onChange={handleChange}
                type="text"
                name="last_name"
                id="last_name"
                value={last_name}
                placeholder="Last Name"
              />
            </label>
          </div>
          <input
          onChange={handleChange}
          type="text"
          name="nick_name"
          id="nick_name"
          value={nick_name}
          placeholder="(nickname)"
        />
          <label htmlFor="email">
            <input
              onChange={handleChange}
              type="email"
              name="email"
              id="email"
              value={email}
              placeholder="Email"
              
            />
          </label>
          <input
          onChange={handleChange}
          type="date"
          name="dob"
          id="dob"
          value={dob}
          placeholder="dd/mm/yy"
        />
          <label htmlFor="password">
            <input
              onChange={handleChange}
              type="text"
              name="password"
              id="password"
              value={password}
              placeholder="Enter password"
              
            />
          </label>
          <label htmlFor="password2">
            <input
              onChange={handleChange}
              type="text"
              name="password2"
              id="password2"
              value={password2}
              placeholder="Confirm password"
              
            />
          </label>
          <div>
            <button type="submit">SignUp</button>
          </div>
        </form>
    </>
  );
};

export default Register;
