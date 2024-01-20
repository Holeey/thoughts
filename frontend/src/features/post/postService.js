import axios from "axios";


const API_URL = '/post'

const createPost = async (payload, token) => {

    try {
    const config = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }
    console.log("config:", config);

    const response =  await axios.post(`${API_URL}/createPost`, payload, config)
    if(response.data) {
        localStorage.setItem('post', response.data)
    }        
    } catch (error) {
        console.error(
            "Error creating post:",
            error.response.data || error.message || error
          );
          throw error; // Rethrow the error or handle it accordingly
        }
    }
const getAllPosts = async () => {
    try {
        const response = await axios.get(`${API_URL}/getAllPost`)
        return response.data
    } catch (error) {
        throw error
    }
}




const postService = {
    createPost,
}

export default postService