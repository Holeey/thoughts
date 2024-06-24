import { Fragment, useState, useRef, useCallback, useEffect } from "react";
import "./repostForm.css";
import RepostPreview from "../repostPreview/RepostPreview";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import {
  createRepost,
  resetEditingRepost,
  updateRepost,
} from "../../../../features/repost/repostSlice";

const RepostForm = ({
  post,
  setSharePost,
  imageSrc,
  isVisible,
  setIsVisible,
}) => {
  const [repostComment, setRepostComment] = useState(" ");

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { editingRepost } = useSelector((state) => state.repost);
 

  const repost = (e) => {
    e.preventDefault();

    const data = {
      id: post._id,
      repostComment,
    };
    dispatch(createRepost(data));
    setSharePost(false);
  };

  // const clickRef = useRef(null);

  // const handleOutsideClick = useCallback(
  //   (e) => {
  //     if (clickRef.current && !clickRef.current.contains(e.target)) {
  //       setIsVisible(false);
  //     }
  //   },
  //   [setIsVisible]
  // );

  useEffect(() => {
    if (editingRepost) {
      setRepostComment(editingRepost.repostComment);
    }
    // document.addEventListener("click", handleOutsideClick, true);
    // return () => {
    //   document.removeEventListener("click", handleOutsideClick, true);
    // };
  }, [editingRepost, dispatch]);

  const handleUpdateRepost = (e) => {
    if (editingRepost) { 
      e.preventDefault();

      const data = {
        id: editingRepost._id,
        repostComment: repostComment,
      };

      dispatch(updateRepost(data));
      handleResetForm();
      setIsVisible(!isVisible);
    }
  };

  const handleResetForm = () => {
    setRepostComment(" ");
    
    dispatch(resetEditingRepost());
    setIsVisible(false);
  };

  const handleChange = (e) => {
    setRepostComment(e.target.value)
  };

  return (
    <Fragment>
      <div className="backdrop">
        <form
          onSubmit={editingRepost ? handleUpdateRepost : repost}
          className="repost_form"
        >
          <div className="user_profile_image_container">
            <img
              className="user_profile-image"
              src={user?.profile_image}
              alt=""
            />
          </div>
          <textarea
            onChange={handleChange}
            value={repostComment}
            id="repostComment"
            name="repostComment"
            className="repost_text-area"
            placeholder="Say something about this..."
          />
          <RepostPreview imageSrc={imageSrc} post={post} />
          <button type="submit" className="repost_share_btn">
            Share
          </button>
          <FontAwesomeIcon
            cursor={"pointer"}
            onClick={() => {
              if (editingRepost) {
                handleResetForm()
              }
              setSharePost(false);
            }}
            className="repost_close_btn"
            icon={faClose}
          />
        </form>
      </div>
    </Fragment>
  );
};

export default RepostForm;
