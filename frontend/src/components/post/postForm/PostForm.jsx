import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./postForm.css";
import {
  createPost,
  updatePost,
  reset,
  resetEditingPost,
} from "../../../features/post/postSlice";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faImage } from "@fortawesome/free-solid-svg-icons";
import { base64ToFile } from "../../imageCropper/base64Converter";
import ImgCropper from "../../imageCropper/ImgCropper";

const PostForm = ({ isVisible, setIsVisible }) => {
  const [imageAfterCrop, setImageAfterCrop] = useState(null);
  const [isCropPage, setIsCropPage] = useState(false);
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
    setIsCropPage(true);
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
    formData.append("postTitle", postTitle);
    formData.append("postBody", postBody);
    formData.append("postImg", postImg);

    dispatch(createPost(formData));
    handleResetForm();
    setIsVisible(!isVisible);
  };
  const handleUpdatePost = (e) => {
    e.preventDefault();

    if (editingPost) {
      const formData = new FormData();
      formData.append("postTitle", postTitle);
      formData.append("postBody", postBody);
      formData.append("postImg", postImg);
      formData.append("id", editingPost._id);

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
    // dispatch(reset());
    dispatch(resetEditingPost());
    setIsVisible(false);
  };

  const onCropDone = (imgCroppedArea, base64Img, filename) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = imgCroppedArea.width;
    canvas.height = imgCroppedArea.height;

    let img = new Image();
    img.src = base64Img;
    img.onload = () => {
      context.drawImage(
        img,
        imgCroppedArea.x,
        imgCroppedArea.y,
        imgCroppedArea.width,
        imgCroppedArea.height,
        0,
        0,
        imgCroppedArea.width,
        imgCroppedArea.height
      );
      const dataURL = canvas.toDataURL("image/jpeg");
      setImageAfterCrop(dataURL);
      setIsCropPage(false);
      const convertedImg = base64ToFile(dataURL, filename);
      setFormData((prevData) => ({
        ...prevData,
        postImg: convertedImg,
      }));
    };
  };

  const onCropCancel = () => {
    setFormData((prevData) => ({
      ...prevData,
      postImg: "",
    }));
    setIsCropPage(false);
  };

  return (
    <Fragment>
      <div className="post_form_container">
        {isCropPage ? (
          <ImgCropper
            onCropDone={onCropDone}
            onCropCancel={onCropCancel}
            selectedImage={postImg}
          />
        ) : (
          <>
            
            <div ref={clickRef}>
              <form
                encType="multipart/form-data"
                onSubmit={editingPost ? handleUpdatePost : handleSubmit}
                className="post_form"
              >
                <div className="form_close_btn">
                  {" "}
                  <FontAwesomeIcon
                    id="post_cancel_button"
                    onClick={handleResetForm}
                    style={{ cursor: "pointer" }}
                    size={"2x"}
                    icon={faClose}
                  />
                </div>
                <div className="middle_eelements">
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
                </div>

                <div className="selectImg_and_post-button_container">
                  <div>
                    <input
                      onChange={handleFileUpload}
                      type="file"
                      name="postImg"
                      id="postImg"
                      accept=".jpg, .png, .jpeg"
                      style={{ display: "none" }} // Hide the default input
                    />
                    <label htmlFor="postImg" className="custom-file-upload">
                      <FontAwesomeIcon
                        style={{ cursor: "pointer" }}
                        size={"2x"}
                        icon={faImage}
                      />
                    </label>
                    <span className="file-name">{postImg?.name}</span>
                  </div>

                  <div>
                    {editingPost ? (
                      <button type="submit" id="post_button">
                        Update
                      </button>
                    ) : (
                      <button type="submit" id="post_button">
                        Share
                      </button>
                    )}{" "}
                  </div>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </Fragment>
  );
};

export default PostForm;
