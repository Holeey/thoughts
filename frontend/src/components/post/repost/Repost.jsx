import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faTrash,
  faPencil,
  faEllipsisVertical,
  faUpLong,
  faDownLong,
  faComment,
  faShareNodes,
  faClose,
  faCopy,
  faFlag,
} from "@fortawesome/free-solid-svg-icons";

import PostForm from "../postForm/PostForm";
import CommentForm from "../../post/postItem/comments/commentForm/CommentForm";
import CommentList from "../../post/postItem/comments/commentList/CommentList";

import moment from "moment";

import { useDispatch, useSelector } from "react-redux";
import { useState, useRef, useEffect, useMemo, useCallback  } from "react";

import {
  deleteRepost,
  editRepost,
  upvote_repost,
  downvote_repost,
} from "../../../features/repost/repostSlice";
import RepostForm from "../repost/repostItem/RepostForm";

import RepostItem from "./repostItem/RepostItem";
import "./repost.css";

const Repost = React.memo(({ post }) => {
  const [isMinimized, setIsMinimized] = useState(true);
  const [isPostOptions, setIsPostOptions] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [openCommentFormId, setOpenCommentFormId] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [sharePost, setSharePost] = useState(false);

  const dispatch = useDispatch();
  // const { user } = useSelector((state) => state.auth);

  const togglePostOptions = useCallback(() => {
    setIsPostOptions(!isPostOptions);
  }, [isPostOptions]);
  const handleDeletePost = useCallback(() => {
    dispatch(deleteRepost(post._id));
  }, [dispatch, post._id]);
  const handleEditPost = useCallback(() => {
    dispatch(editRepost(post));
  }, [dispatch, post]);
  const toggleVisibility = useCallback(() => {
    setIsVisible(!isVisible);
    handleEditPost();
  }, [handleEditPost, isVisible]);
  const toggleCommentForm = useCallback((postId) => {
    // Close any open comment form if it's not the one being clicked
    setOpenCommentFormId(openCommentFormId === postId ? null : postId);
  }, [openCommentFormId]);


  //function for toggling the upvote
  const toggle_upvoted = useCallback(() => {
      dispatch(upvote_repost(post._id));
  }, [dispatch, post._id]);

  //function for toggling downvote
  const toggle_downvoted = useCallback(() => {
      dispatch(downvote_repost(post._id));
  }, [dispatch, post._id]);

  const clickRef = useRef(null);

  const handleOutsideClick = useCallback((e) => {
    if (clickRef.current && !clickRef.current.contains(e.target)) {
      setIsPostOptions(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick, true);
    return () => {
      document.removeEventListener("click", handleOutsideClick, true);
    };
  });

  return (
    <div>
      <div className="re-post">
        <div className="re-post_author_container ">
          <div className="re-post_user_profile_img_container_post">
            <img
              className="re-post_user_profile_img"
              src={post.user?.profile_image}
            />
          </div>
          <div className="re-post_author-content">
            <div className="re-post_author-info">
              <div className="nick_name">
                <h4>{post.user?.nick_name}</h4>
              </div>
              <a href="#">Follow</a>
              <div className="re-post_time">
                <h6>{moment(post.createdAt).fromNow()}</h6>
              </div>
            </div>{" "}
            <div className="bio">
              <h6>{post.user.bio}</h6>
            </div>
          </div>
          <div className="re-post_options_elipsis">
            <FontAwesomeIcon
              icon={faEllipsisVertical}
              size="2x"
              onClick={togglePostOptions}
            />
          </div>
          {isPostOptions && (
            <>
              <ul ref={clickRef}>
                <li onClick={toggleVisibility}>
                  <FontAwesomeIcon icon={faPencil} /> Edit
                </li>
                <li onClick={handleDeletePost}>
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </li>
                <li onClick={() => setIsMinimized(true)}>
                  <FontAwesomeIcon icon={faClose} /> Minimize
                </li>
                <li onClick={() => setIsMinimized(true)}>
                  <FontAwesomeIcon icon={faCopy} /> Copy link
                </li>
                <li onClick={() => setIsMinimized(true)}>
                  <FontAwesomeIcon icon={faFlag} /> Report
                </li>
              </ul>
            </>
          )}
        </div>
        <div>
          <p className="re-post_body">{post.repostComment}</p>
          <RepostItem post={post} />
        </div>
        <div className="re-post_meta_container">
          <div className="re-post_feedback_actions">
            <div className="re-post_upvote_downvote_container">
              <div className="re-post_upvote" onClick={toggle_upvoted}>
                <FontAwesomeIcon
                  icon={faUpLong}
                  color={post.upvoteValue > 0 ? "blue" : "black"}
                />
                {post.upvoteValue}
              </div>
              <div className="re-post_downvote" onClick={toggle_downvoted}>
                <FontAwesomeIcon
                  icon={faDownLong}
                  color={post.downvoteValue > 0 ? "red" : "black"}
                />
                {post.downvoteValue}
              </div>
            </div>
            <span
              style={{ cursor: "pointer" }}
              onClick={() => toggleCommentForm(post._id)}
            >
              <FontAwesomeIcon icon={faComment} />
            </span>
            <span>
              <FontAwesomeIcon
                style={{ cursor: "pointer" }}
                onClick={() => setSharePost(!sharePost)}
                icon={faShareNodes}
              />
            </span>{" "}
          </div>
        </div>
      </div>{" "}
      {(isVisible || sharePost) && (
        <RepostForm
          post={post}
          setSharePost={setSharePost}
          sharePost={sharePost}
          imageSrc={imageSrc}
          isVisible={isVisible}
          setIsVisible={setIsVisible}
        />
      )}
      {openCommentFormId === post._id && <CommentForm post={post} />}
      <div>{openCommentFormId === post._id && <CommentList post={post} />}</div>
    </div>
  );
});

export default Repost;
