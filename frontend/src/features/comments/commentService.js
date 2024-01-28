import axios from "axios";

const API_URL = 'comment'

const postComment = async (id, comment, token) => {
    const config = {
        Headers: {
            Authorization: `Bearer ${token}`
        }
    }
    try {
        const response = await axios.post(`${API_URL}/postComment/${id}`, comment, config)
        return response.data
    } catch (error) {
        console.error('post comment error:', error.respone.data)
        throw error
    }
}

const commentService = {
    postComment,
}

export default commentService