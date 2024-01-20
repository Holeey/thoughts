import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import './post.css'
import { createPost } from "../../features/post/postSlice";
import {toast} from "react-toastify"

const Post = () => {
  const [isVisible, setIsVisible] = useState(false)

  const [formData, setFormData] = useState({
    postTitle: "",
    post_img: "",
    postBody: "",
  });
  const { postTitle, post_img, postBody } = formData;

  const dispatch = useDispatch()
  const {
    isError,
    isSuccess,
    errorMessage,
    successMessage } = useSelector((state) => state.post)

  useEffect(() => {
    if(isError) {
      toast.error(errorMessage)
      return
    }else if (isSuccess){
      toast.success(successMessage)
    }
  })

  const converToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const filerReader =  new FileReader()
      filerReader.readAsDataURL(file)
      filerReader.onload = () => {
        resolve(filerReader.result)
      }
      filerReader.onerror = (error) => {
        reject(error)
      }
    })
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    const base64 = await converToBase64(file)
    setFormData((prevData) => ({
      ...prevData,
      post_img: base64
    }))
  }

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault()

    const Post = {
      // post_img,
      postTitle: postTitle,
      postBody: postBody
    }

    dispatch(createPost({ Post }))
  }

  return (
    <div>
        { !isVisible &&
        <input onClick={()=> setIsVisible(!isVisible)} placeholder="Share your thoughts"/> 
        }
        {' '}
        { isVisible &&
      <div className="post_form_container">
        <form  onSubmit={handleSubmit} className="post_form">
          <div>
            <input
              onChange={handleFileUpload}
              type="file"
              name="post_img"
              id="post_img"
              value={post_img}
              accept=".jpg, .png, .jpeg"
            />
          </div>
          <div>
          <input
              onChange={handleChange}
              type="text"
              placeholder="Title"
              name="postTitle"
              id="postTitle"
              value={postTitle}
            />
          </div>
          <div>
            <input
              onChange={handleChange}
              type="text"
              placeholder="say something..."
              name="postBody"
              id="postBody"
              value={postBody}
            />
          </div>
          <button id="post_cancel_button" onClick={() => setIsVisible(false)}>close</button>
          <button type="submit" id="post_button" onClick={() => setIsVisible(false)}>post</button>
        </form>
      </div>
}
    </div>
  );
};

export default Post;

