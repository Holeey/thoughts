import { useDispatch, useSelector } from "react-redux"
import {logout, reset} from '../../features/auth/authSlice.js'
import { Link, useNavigate } from "react-router-dom"

const Header = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {user} = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    dispatch(reset());
    // window.location.replace('/');
    navigate('/')
  }
  
  return (
    <>
    <div>
      <div><h1>Logo</h1></div>
      <div onClick={handleLogout} style={{ cursor: 'pointer'}}>
        { user ? <h1>Logout</h1> :<Link to={'/register'}><button>Sign Up</button></Link> }
      </div>
    </div>
    </>
  )
}

export default Header