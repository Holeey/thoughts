import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Link } from "react-router-dom";
import avatar from "../../images/avatar.jpg";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { user } = useSelector((state) => state.auth);
  
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div>
        <div>
          <img src={avatar} width={100} alt="profile" />
          <h3>{user && user.first_name}</h3>
          <Link to={'/profile'}><span>Account</span></Link>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="search"
              id="search"
              value={searchTerm}
              placeholder="search"
              onChange={handleChange}
            />
          </div>
          <div>
            <button type="submit">search</button>
          </div>
        </form>
        <div><h2>Topics</h2></div>
      </div>
    </>
  );
};

export default Dashboard;
