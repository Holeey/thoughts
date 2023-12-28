import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {login} from '../../features/auth/authSlice.js'
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"


const Login = () => {

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {user, isError, isSuccess, message} = useSelector((state) => state.auth)

    useEffect(() => {
        if (isError) {
            toast.error(message)
        }
        if (isSuccess || user) {
            navigate('/dashboard')
        }
        
    }, [user, isError, isSuccess, message, dispatch, navigate])

    const {email, password} = formData

    const handleSubmit = (e) => {
        e.preventDefault()

        const userData = {
            email: email,
            password: password
        }
        dispatch(login( userData ))
    }

    const handleChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }


  return (
    <>
    <div><h1>Login</h1></div>
    <form onSubmit={handleSubmit}>
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
</div>

    </form>    
    </>
  )
}

export default Login