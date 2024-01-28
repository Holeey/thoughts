import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, reset } from "../../features/auth/authSlice.js";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import "./login.css"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    } else if (isSuccess || user) {
      navigate("/dashboard");
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, dispatch, navigate]);

  const { email, password } = formData;

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email: email,
      password: password,
    };
    dispatch(login(userData));
  };

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <>
      <div>
        <h1>Login</h1>
      </div>
      <form className="login_form" onSubmit={handleSubmit}>
        <input
          required
          type="email"
          name="email"
          id="email"
          value={email}
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          required
          type="password"
          name="password"
          id="password"
          value={password}
          placeholder="Enter your password"
          onChange={handleChange}
        />

        <div>
          <button type="submit">Login</button>
          <Link to={"/register"}>
            <button>Sign Up</button>
          </Link>
        </div>
      </form>
      <div>
        {" "}
        <Link to={"/recoverPassword"}>
          <span>Forgot password ?</span>
        </Link>
      </div>
    </>
  );
};

export default Login;
