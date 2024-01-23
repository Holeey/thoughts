import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import './postForm.css'
import { createPost, updatePost } from "../../../features/post/postSlice";
import {toast} from "react-toastify"


const PostForm = ({ isVisible, setIsVisible }) => {
    const [formData, setFormData] = useState({
    postTitle: "",
    post_img: "",
    postBody: "",
  });
  const { postTitle, post_img, postBody } = formData;

  const dispatch = useDispatch();

  const {
    isError,
    isSuccess,
    message,
    successMessage, editingPost } = useSelector((state) => state.posts)

    const clickRef = useRef(null);

    const handleOutsideClick = useCallback((e) => {
     if(clickRef.current && !clickRef.current.contains(e.target)) {
        setIsVisible(false);
      }
    }, [setIsVisible])
  
    useEffect(() => {  
      if (editingPost) {
        setFormData({
          postTitle: editingPost.postTitle,
          postBody: editingPost.postBody
        })
      } 
      document.addEventListener("click", handleOutsideClick, true); 
      return () => {
        document.removeEventListener("click", handleOutsideClick, true);
      };
    }, [editingPost, handleOutsideClick]);
 

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
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault()

    dispatch(createPost({
      postTitle: postTitle,
      postBody: postBody
    }))
  }

  const handleUpdatePost = (e) => {
    e.preventDefault()

    if(editingPost) {
    dispatch(updatePost( {id: editingPost._id}, { postTitle: postTitle , postBody: postBody} ))
    }
  }

  return (
    <div className="post_form_container">
      <div ref={clickRef} > 
      
        <form  onSubmit={editingPost ? handleUpdatePost : handleSubmit} className="post_form">
          <div>
            <input
              onChange={handleFileUpload}
              type="file"
              name="post_img"
              id="post_img"
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
              id= "postBody"
              value={postBody}
            />
          </div>
        <button id="post_cancel_button" onClick={()=> setIsVisible(false)} >close</button>
          {editingPost? (<button type="submit" id="post_button" >update</button>)
           : (<button type="submit" id="post_button" >post</button>)}
        </form>

      </div>

    </div>
  );
};

export default PostForm;

