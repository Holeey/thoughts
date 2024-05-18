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
const upvotes_repost = async (id, token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const response = await axios.post(`${API_URL}/upvotes_repost/${id}`, null, config)
        return response.data
    } catch (error) {
        console.error('upvote error:', error.response.data)
        throw error
    }
}
const downvotes_repost = async (id, token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const response = await axios.post(`${API_URL}/downvotes_repost/${id}`, null, config)
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
    upvotes_repost,
    downvotes_repost,

}

export default postService