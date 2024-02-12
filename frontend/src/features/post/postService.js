import axios from "axios";

const API_URL = 'post'

const createPost = async (payload, token) => {
    try {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response =  await axios.post(`${API_URL}/createPost`, payload, config)
    return response.data
    } catch (error) {
        console.error('create post error:', error.response.data)
        throw error; 
        }
    }
const getAllPosts = async () => {
    try {
        const response = await axios.get(`${API_URL}/`)
        return response.data
    } catch (error) {
        console.error('get all posts:', error.response.data)
        throw error
    }
}
const updatePost = async (id, updatedPost, token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const response =  await axios.put(`${API_URL}/updatePost/${id}`, updatedPost, config)
        return response.data
    } catch (error) {
        console.error('update error:', error.response.data)
        throw error
    }
}
const deletePost = async (id, token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const response = await axios.delete(`${API_URL}/deletePost/${id}`, config)
        return response.data
    } catch (error) {
        console.error('delete error:', error.response.data)
        throw error
    }
}
const searchPost = async (payload, token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const response = await axios.get(`${API_URL}/searchPost?q=${payload}`, config)
        return response.data
    } catch (error) {
        console.error('search error:', error.response.data)
        throw error
    }
}
const upvotes = async (id, token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const response = await axios.post(`${API_URL}/upvotes/${id}`, config)
        return response.data
    } catch (error) {
        throw error
    }
}
const downvotes = async (id, token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const response = await axios.post(`${API_URL}/downvotes/${id}`, config)
        return response.data
    } catch (error) {
        console.error('search error:', error.response.data)
        throw error
    }
}




const postService = {
    getAllPosts,
    createPost,
    updatePost,
    deletePost,
    searchPost,
    upvotes,
    downvotes
}

export default postService