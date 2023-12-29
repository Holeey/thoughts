import axios from 'axios'

const API_URL = 'http://localhost:5000/user/'

const register = async (userData) => {
    const response = await axios.post(`${API_URL}register`, userData)

if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
}
return response.data
}
const login = async (userData) => {
    const response = await axios.post(`${API_URL}login`, userData)

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }
    return response.data
}
const profile = async (userId, userData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    try {
        const response = await axios.put(`${API_URL}/profile/${userId}`, userData, config)
        if (response.data) {
         localStorage.setItem('user', JSON.stringify(response.data))   
        }
        return response.data
    } catch (error) {
        console.error('profile:', error)
    }
}
const logout = () => {
    localStorage.removeItem('user')
}

const authService = {
    register,
    login,
    logout, 
    profile
}

export default authService