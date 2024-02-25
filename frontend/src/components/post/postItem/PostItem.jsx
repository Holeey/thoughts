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
import CommentForm from "../postItem/comments/commentForm/CommentForm"

import moment from "moment";

import { useState, useRef, useEffect } from "react";
import "./postItem.css";

import {
  deletePost,
  editPost,
  upvotes,
  downvotes,
  unDownvoted,
  unUpvoted,
} from "../../../features/post/postSlice";

import { useDispatch } from "react-redux";

const PostItem = ({ post }) => {
  const [isMinimized, setIsMinimized] = useState(true);
  const [isPostOptions, setIsPostOptions] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isUpVoted, setIsUpVoted] = useState(false);
  const [isDownVoted, setIsDownVoted] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const dispatch = useDispatch();

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
  const handleComments = () => {
    setShowComments(!showComments);
  };
  //function for toggling the upvote using both backend/frontend to persist state
  const toggle_upvoted = () => {
    if (clickCount === 1 && isDownVoted) {
      return;
    } else if (clickCount === 1) {
      handleUpvoteClick(isUpVoted);
    } else if (clickCount < 1 && post.upvotedBycurrentUser === true) {
      handleUpvoteClick(true);
    } else if (clickCount < 1 && post.downvotedByCurrentUser === true) {
      return;
    } else {
      dispatch(upvotes(post._id));
      setClickCount(clickCount + 1);
      setIsUpVoted(true);
      setIsDownVoted(false);
    }
  };
  //function for toggling downvote using both backend/frontend to persist state
  const toggle_downvoted = () => {
    if (clickCount === 1 && isUpVoted) {
      return;
    } else if (clickCount === 1) {
      handleDownvoteClick(isDownVoted);
    } else if (clickCount < 1 && post.downvotedByCurrentUser === true) {
      handleDownvoteClick(true);
    } else if (clickCount < 1 && post.upvotedBycurrentUser === true) {
      return;
    } else {
      dispatch(downvotes(post._id));
      setClickCount(clickCount + 1);
      setIsDownVoted(true);
      setIsUpVoted(false);
    }
  };
  //upvote callback function
  const handleUpvoteClick = (isUpVoted) => {
    if (isUpVoted) {
      dispatch(unUpvoted(post._id));
      setIsUpVoted(false);
    }
    setClickCount(0);
  };
  //downvote callback function
  const handleDownvoteClick = (isDownVoted) => {
    if (isDownVoted) {
      dispatch(unDownvoted(post._id));
      setIsDownVoted(false);
    }
    setClickCount(0);
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

  return (
    <>
      <div className="post_item">
        <div className="post_author_container">
          <div className="post_author">
            <div className="user_profile_img_container">
              <img
                className="user_profile_img"
                src={post.user?.profile_image}
                alt="profile_Img"
              />
            </div>
            <h4>{post.user?.nick_name}</h4>
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
        </div>
        <div className={`post_item_content`}>
          <div className="post_title">
            <h4>{post.postTitle}</h4>
          </div>

          <div
            className={`post_body_container ${
              isMinimized ? "minimized" : "expanded"
            }`}
          >
            <p className="post_body">{post.postBody}</p>
          </div>

          {isMinimized && post.postBody.length > 100 ? (
            <span className="post_elipsis">
              Continue reading{" "}
              <FontAwesomeIcon icon={faEllipsis} onClick={toggleMinimize} />{" "}
            </span>
          ) : (
            ""
          )}
        </div>
        <div className="post_meta_container">
          <div className="post_feedback_actions">
            <span onClick={toggle_upvoted}>
              <FontAwesomeIcon
                icon={faUpLong}
                color={post.upvotedBycurrentUser === true ? "blue" : "black"}
              />
              {post.upvoteValue}
            </span>
            <span onClick={toggle_downvoted}>
              <FontAwesomeIcon
                icon={faDownLong}
                color={post.downvotedByCurrentUser === true ? "red" : "black"}
              />
              {post.downvoteValue}
            </span>
            <span onClick={handleComments}>
              <FontAwesomeIcon icon={faComment} />
            </span>
            <span>
              <FontAwesomeIcon icon={faShareNodes} />
            </span>{" "}
          </div>

          <div className="post_time">
            <span>posted {moment(post.createdAt).fromNow()}</span>
          </div>
        </div>
      </div>
      {isVisible && (
        <PostForm isVisible={isVisible} setIsVisible={setIsVisible} />
      )}
      {showComments && <CommentForm post={post} />}
    </>
  );
};

export default PostItem;
