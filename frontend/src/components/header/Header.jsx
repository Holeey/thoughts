import { useDispatch, useSelector } from "react-redux"
import { useState } from "react"
import {logout, reset} from '../../features/auth/authSlice.js'
import { Link } from "react-router-dom"
import avatar from "../../images/avatar.jpg";
import './header.css'
import { resetSearchPosts, searchPost } from "../../features/post/postSlice.js";
import SearchList from "../header/searchList/SearchList.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons"

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isResult, setIsResult] = useState(false);

  const dispatch = useDispatch()

  const {user} = useSelector((state) => state.auth)

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.length > 1)
    dispatch(searchPost(searchTerm))
   handleResultVisibility()
   setSearchTerm('')
  }

  const handleLogout = () => {
    dispatch(logout())
    dispatch(reset());
    window.location.replace('/');
  }
  const handleResultVisibility = () => {
    setIsResult(!isResult)
    dispatch(resetSearchPosts())
  }
  
  return (
    <>
    <div className="nav_bar">
      <Link to={'/'}>
        <h1>Logo</h1>
      </Link>
      { user && <>
      <div >
          <form className="search_bar" onSubmit={handleSearch}>
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
            <button type="submit" className="search_btn" onClick={handleSearch}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
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
      { isResult &&
      <div className="searchResult"><SearchList />
      <FontAwesomeIcon onClick={handleResultVisibility} className='close_btn' icon={faXmark} />
      </div> }

      </>
      }
    </div>
    </>
  )
}

export default Header