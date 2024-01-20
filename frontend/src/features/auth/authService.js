import axios from 'axios'

const API_URL = 'user'

const register = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData)

if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
}
return response.data
}
const login = async (userData) => {
    const response = await axios.post(`${API_URL}/login`, userData)

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
        console.error('profile error:', error)
    }
}
const recoverPassword = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/recoverPassword`, userData)
        if (response.data) {
            localStorage.setItem('recoverPassword', JSON.stringify(response.data))   
           }
           return response.data
    } catch (error) {
        console.error('password recovery error:', error)  
    }
}
const setNewPassword = async (userData, token) => {
    try {
        const response = await axios.post(`${API_URL}/processPassword?token=${token}`, userData);
        if (response.data) {
            localStorage.setItem('recoverPassword', JSON.stringify(response.data));

            // Retrieve the value from local storage
            const recoveredPassword = JSON.parse(localStorage.getItem('recoverPassword'));

            // Clear local storage after using the value
            localStorage.removeItem('recoverPassword');

            return recoveredPassword;
        }
        return response.data;
    } catch (error) {
        console.error('process-password error:', error);
    }
};

const logout = () => {
    localStorage.removeItem('user')
}

const authService = {
    register,
    login,
    logout, 
    profile,
    recoverPassword,
    setNewPassword
}

export default authService