import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {logout, reset} from '../../features/auth/authSlice.js'

const Header = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {user} = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    dispatch(reset());
    navigate('/login')
  }
  
  return (
    <>
    <div>
      <div><h1>Logo</h1></div>
      <div onClick={handleLogout} style={{ cursor: 'pointer'}}>
        { user ? <h1>Logout</h1> : ''}
      </div>
    </div>
    </>
  )
}

export default Header