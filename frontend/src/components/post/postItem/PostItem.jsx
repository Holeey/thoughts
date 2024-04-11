import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faEllipsisVertical,
  faUpLong,
  faDownLong,
  faComment,
  faShareNodes,
} from "@fortawesome/free-solid-svg-icons";

import PostForm from "../postForm/PostForm";
import CommentForm from "../postItem/comments/commentForm/CommentForm";
import CommentList from "./comments/commentList/CommentList";

import moment from "moment";

import { useState, useRef, useEffect } from "react";
import "./postItem.css";

import {
  deletePost,
  editPost,
  upvotes,
  downvotes,
} from "../../../features/post/postSlice";

import { useDispatch, useSelector } from "react-redux";

const PostItem = ({ post }) => {
  const [isMinimized, setIsMinimized] = useState(true);
  const [isPostOptions, setIsPostOptions] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [openCommentFormId, setOpenCommentFormId] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };
  const togglePostOptions = () => {
    setIsPostOptions(!isPostOptions);
  };
  const handleDeletePost = () => {
    dispatch(deletePost(post._id));
  };
  const handleEditPost = () => {
    dispatch(editPost(post));
  };
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
    handleEditPost();
  };
  const toggleCommentForm = (postId) => {
    // Close any open comment form if it's not the one being clicked
    setOpenCommentFormId(openCommentFormId === postId ? null : postId);
  };

  // Get user vote status from the database state
  const upvoted = post.upvote.findIndex((vote) => vote.user._id === user.id);
  const downvoted = post.downvote.findIndex(
    (vote) => vote.user._id === user.id
  );

  //function for toggling the upvote
  const toggle_upvoted = () => {
    if (downvoted !== -1) {
      return;
    } else {
      dispatch(upvotes(post._id));
    }
  };

  //function for toggling downvote
  const toggle_downvoted = () => {
    if (upvoted !== -1) {
      return;
    } else {
      dispatch(downvotes(post._id));
    }
  };

  const clickRef = useRef(null);

  const handleOutsideClick = (e) => {
    if (clickRef.current && !clickRef.current.contains(e.target)) {
      setIsPostOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick, true);
    return () => {
      document.removeEventListener("click", handleOutsideClick, true);
    };
  });

  useEffect(() => {
    const loadImage = async () => {
      if (post.postImg) {
        try {
          const module = await import(`../../../images/${post.postImg}`);
          setImageSrc(module.default);
        } catch (error) {
          console.error("Error loading image:", error);
        }
      }
    };
  
    loadImage();
  }, [post]);
  

  return (
    <>
      <div className="post_item">
        <div className="post_author_container">
        <div className="user_profile_img_container_post">
              <img
                className="user_profile_img"
                src={post.user?.profile_image}
                alt="profile_Img"
              />
            </div>
          <div className="post_author-content">
            <div className="post_author-info">
            <div className="nick_name">
            <h4>{post.user?.nick_name}</h4>
           
            </div>
            <a href="#">Follow</a>
            <div className="post_time">
              <h6>{moment(post.createdAt).fromNow()}</h6>
            </div>
              
            </div>
           {' '}
            <div className="bio">
              <h6>{post.user.bio}</h6>
            </div>
          </div>
          <div className="post_options_elipsis">
            <FontAwesomeIcon
              icon={faEllipsisVertical}
              size="2x"
              onClick={togglePostOptions}
            />
          </div>
          {isPostOptions && (
            <>
              <ul ref={clickRef}>
                <li onClick={toggleVisibility}>Edit</li>
                <li onClick={handleDeletePost}>Delete</li>
                <li onClick={toggleMinimize}>Minimize</li>
              </ul>
            </>
          )}     
        </div>{" "}
        <div className={`post_item_content`}>
          <h5 className="post_title">{post.postTitle}</h5>
          <div
            className={`post_body_container ${
              isMinimized ? "minimized" : "expanded"
            }`}
          >
            
            <p className="post_body">{post.postBody}</p>
          </div>
          {isMinimized && post.postBody.length > 100 ? (
            <div className="post_elipsis">
              <h6 onClick={toggleMinimize}>(See more...)</h6>
            </div>
          ) : (
            ""
          )}
          {imageSrc && (
            <div className="postImg">
              <img src={imageSrc} alt="" />
            </div>
          )}
        </div>
        <div className="post_meta_container">
          <div className="post_feedback_actions">
            <span onClick={toggle_upvoted}>
              <FontAwesomeIcon
                icon={faUpLong}
                color={upvoted !== -1 ? "blue" : "black"}
              />
              {post.upvoteValue}
            </span>
            <span onClick={toggle_downvoted}>
              <FontAwesomeIcon
                icon={faDownLong}
                color={downvoted !== -1 ? "red" : "black"}
              />
              {post.downvoteValue}
            </span>
            <span onClick={() => toggleCommentForm(post._id)}>
              <FontAwesomeIcon icon={faComment} />
            </span>
            <span>
              <FontAwesomeIcon icon={faShareNodes} />
            </span>{" "}
          </div>
        </div>
      </div>
      {isVisible && (
        <PostForm isVisible={isVisible} setIsVisible={setIsVisible} />
      )}
      {openCommentFormId === post._id && <CommentForm post={post} />}
      <div>{openCommentFormId === post._id && <CommentList post={post} />}</div>
    </>
  );
};

export default PostItem;
