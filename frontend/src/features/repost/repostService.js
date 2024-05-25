import axios from "axios";

const API_URL = 'post'

const createRepost = async (id, repostComment, token) => {
    try {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response =  await axios.post(`${API_URL}/createRepost/${id}`, { repostComment }, config)
    return response.data
    } catch (error) {
        console.error('create repost error:', error.response.data)
        throw error; 
        }
    }
const getAllReposts = async () => {
    try {
        const response = await axios.get(`${API_URL}/repost`)
        return response.data
    } catch (error) {
        console.error('get all reposts:', error.response.data)
        throw error
    }
}
const updateRepost = async (id, updatedPost, token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const response =  await axios.put(`${API_URL}/updateRepost/${id}`, updatedPost, config)
        return response.data
    } catch (error) {
        console.error('update error:', error.response.data)
        throw error
    }
}
const deleteRepost = async (id, token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const response = await axios.delete(`${API_URL}/deleteRepost/${id}`, config)
        return response.data
    } catch (error) {
        console.error('delete error:', error.response.data)
        throw error
    }
}
const upvote_repost = async (id, token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const response = await axios.post(`${API_URL}/upvote_repost/${id}`, null, config)
        return response.data
    } catch (error) {
        console.error('upvote error:', error.response.data)
        throw error
    }
}
const downvote_repost = async (id, token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const response = await axios.post(`${API_URL}/downvote_repost/${id}`, null, config)
        return response.data
    } catch (error) {
        console.error('downvote error:', error.response.data)
        throw error
    }
}

const postService = {
    createRepost,
    getAllReposts,
    updateRepost,
    deleteRepost,
    upvote_repost,
    downvote_repost,

}

export default postService