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
        throw error; // Rethrow the error or handle it accordingly
        }
    }
const getAllPosts = async () => {
    try {
        const response = await axios.get(`${API_URL}/`)
        return response.data
    } catch (error) {
        throw error
    }
}




const postService = {
    getAllPosts,
    createPost,
}

export default postService