import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./postForm.css";
import {
  createPost,
  updatePost,
  reset,
  resetEditingPost,
} from "../../../features/post/postSlice";
import { toast } from "react-toastify";


const PostForm = ({ isVisible, setIsVisible }) => {
  const [formData, setFormData] = useState({
    postTitle: "",
    postImg: null,
    postBody: "",
  });
  const { postTitle, postImg, postBody } = formData;

  

  const dispatch = useDispatch();

  const { editingPost } = useSelector((state) => state.post);

  const clickRef = useRef(null);

  const handleOutsideClick = useCallback(
    (e) => {
      if (clickRef.current && !clickRef.current.contains(e.target)) {
        setIsVisible(false);
      }
    },
    [setIsVisible]
  );

  useEffect(() => {
    if (editingPost) {
      setFormData({
        postTitle: editingPost.postTitle,
        postBody: editingPost.postBody,
        postImg: editingPost.postImg,
      });
    } 
    document.addEventListener("click", handleOutsideClick, true);
    return () => {
      document.removeEventListener("click", handleOutsideClick, true);
    };
  }, [editingPost, handleOutsideClick, dispatch]);


  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      postImg: file,
    }));
  };

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
formData.append('postTitle', postTitle);
formData.append('postBody', postBody);
formData.append('postImg', postImg);


    dispatch(
      createPost(formData)
    );
    handleResetForm()
    setIsVisible(!isVisible);
  };
  const handleUpdatePost = (e) => {
    e.preventDefault();
  
    if (editingPost) {
      const formData = new FormData();
      formData.append('postTitle', postTitle);
      formData.append('postBody', postBody);
      formData.append('postImg', postImg);
      formData.append('id', editingPost._id); // Include the post ID in the form data
      console.log('formData:', formData)
      dispatch(updatePost(formData));
      handleResetForm();
      setIsVisible(!isVisible);
    }
  };
  
  const handleResetForm = () => {
    setFormData({
      postTitle: "",
      postBody: "",
      postImg: null,
    });
    dispatch(reset());
    dispatch(resetEditingPost());
    setIsVisible(false);
  };

  return (
    <div className="post_form_container">
      <div ref={clickRef}>
        <form
          encType="multipart/form-data"
          onSubmit={editingPost ? handleUpdatePost : handleSubmit}
          className="post_form"
        >
          <div>
            <input
              onChange={handleFileUpload}
              type="file"
              name="postImg"
              id="postImg"
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
            <textarea
              onChange={handleChange}
              type="text"
              placeholder="say something..."
              name="postBody"
              id="postBody"
              value={postBody}
            />
          </div>
          <button id="post_cancel_button" onClick={handleResetForm}>
            close
          </button>
          {editingPost ? (
            <button type="submit" id="post_button">
              update
            </button>
          ) : (
            <button type="submit" id="post_button">
              post
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostForm;
