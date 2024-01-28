import axios from "axios";

const API_URL = 'comment'

const postComment = async (postId, reply, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    try {
        const response = await axios.post(`${API_URL}/postComment/${postId}`, {reply}, config);
        return response.data
    } catch (error) {
        console.error('post comment error:', error.respone.data)
        throw error
    }
}

const getComments = async (postId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    try {
        const response = await axios.get(`${API_URL}/${postId}`, config);
        return response.data
    } catch (error) {
        console.error('get comment error:', error.respone.data)
        throw error
    }
}

const commentService = {
    postComment,
    getComments
}

export default commentService