import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux" 
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { setNewPassword, reset } from "../../features/auth/authSlice";

const SetNewPassword = () => {
    const [passwordData, SetPasswordData] = useState({
        newPassword: "",
        confirmPassword: ""
    })

    const {newPassword, confirmPassword} = passwordData
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isError, message, isSuccess } = useSelector((state) => state.auth)

    useEffect(() => {
        if (isError) {
            toast.error(message || 'server error')
            return
        }else if (isSuccess) {
            toast.success('Password updated')
        }
    }, [isError, message, isSuccess])

    const handleChange = (e) => {
        SetPasswordData((prev) => ({
            ...prev,
            [e.target.id]: e.target.value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error('Incorrect password!')
            return
        }
        dispatch(setNewPassword({newPassword: newPassword}))
    }

    const navigateToLoginPage = () => {
        dispatch(reset())
        navigate('/', { replace: true })
    }

  return (
    <>
    <div>
        { isSuccess ? 
        <>
        <p>New password has been sent to your email!</p> 
        <button type="button" onClick={navigateToLoginPage}>Proceed to login</button>
        </>
        :
       <form onSubmit={handleSubmit}>
        <div>
        <label htmlFor="newPassword">New Password:</label>
        <input  onChange={handleChange} type="Password" id="newPassword" name="newPassword" value={newPassword} />
        </div>
        <div>
        <label htmlFor="newPassword">Confirm Password:</label>
        <input  onChange={handleChange} type="password" id="confirmPassword" name="confirmPassword" value={confirmPassword} />
        </div>
        <div><button type="submit">Send</button></div>
    </form> 
}    
    </div>

    </>
  )
}

export default SetNewPassword