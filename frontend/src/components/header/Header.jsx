import { useDispatch, useSelector } from "react-redux"
import { useState } from "react"
import {logout, reset} from '../../features/auth/authSlice.js'
import { Link } from "react-router-dom"
import avatar from "../../images/avatar.jpg";
import './header.css'

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const dispatch = useDispatch()

  const {user} = useSelector((state) => state.auth)

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  const handleLogout = () => {
    dispatch(logout())
    dispatch(reset());
    window.location.replace('/');
  }
  
  return (
    <>
    <div className="nav_bar">
      <div>
        <h1>Logo</h1>
      </div>
      { user && <>
      <div >
          <form className="search_bar" onSubmit={handleSubmit}>
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
        </div>
      <div onClick={()=> setIsVisible(!isVisible)} className="user_profile">
          <div className="user_profile_img_container">
              <img
              className="user_profile_img"
              src={user?.profile_image || avatar}
               alt="profile"
            />
          </div> 
        { isVisible ? 
        <div className="account_tooltip"> 
          <Link to={"/profile"}>
           <p>{user?.nick_name}</p>
           </Link> 
            <p onClick={handleLogout}>Logout</p>
            <p>Settings</p>
            <p>Help</p>
          
           </div>: ''}
      </div>
      </>
      }
    </div>
    </>
  )
}

export default Header