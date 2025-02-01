import React, { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { flushSync } from 'react-dom';
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
import CommentForm from "../postItem/comments/commentForm/CommentForm";
import CommentList from "./comments/commentList/CommentList";
import "./postItem.css";

import moment from "moment";

import { useDispatch, useSelector } from "react-redux";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";

import {
  deletePost,
  editPost,
  upvotes,
  downvotes,
} from "../../../features/post/postSlice";


const PostItem = React.memo(({ post }) => {
  const [isMinimized, setIsMinimized] = useState(true);
  const [isPostOptions, setIsPostOptions] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [openCommentFormId, setOpenCommentFormId] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [sharePost, setSharePost] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const togglePostOptions = useCallback(() => {
    setIsPostOptions(!isPostOptions);
  }, [isPostOptions]);

  const handleDeletePost = useCallback(() => {
    dispatch(deletePost(post._id));
  }, [dispatch, post._id]);

  const handleEditPost = useCallback(() => {
    dispatch(editPost(post));
  }, [dispatch, post]);

  const toggleVisibility = useCallback(() => {
    setIsVisible(!isVisible);
    handleEditPost();
  }, [handleEditPost, isVisible]);

  const toggleCommentForm = useCallback(
    (postId) => {
      setOpenCommentFormId(openCommentFormId === postId ? null : postId);
    },
    [openCommentFormId]
  );

  const toggle_upvoted = useCallback(() => {
    flushSync(() => {
      dispatch(upvotes(post._id));  
    })
  }, [dispatch, post._id]);

  const toggle_downvoted = useCallback(() => {
    flushSync(() => {
       dispatch(downvotes(post._id));  
    })
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
            </div>{" "}
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
                <li onClick={toggleVisibility}>
                  <FontAwesomeIcon icon={faPencil} /> Edit
                </li>
                <li onClick={handleDeletePost}>
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </li>
                <li onClick={() => setIsMinimized(true)}>
                  <FontAwesomeIcon icon={faClose} /> Minimize
                </li>
                <li>
                  <FontAwesomeIcon icon={faCopy} /> Copy link
                </li>
                <li>
                  <FontAwesomeIcon icon={faFlag} /> Report
                </li>
              </ul>
            </>
          )}
        </div>{" "}
        <div className={`post_item_content`}>
          <h5 className="post_title">{post.postTitle}</h5>
          <div className={`${!isMinimized && "reverse_post"}`}>
            <div
              className={`post_body_container ${
                isMinimized ? "minimized" : "expanded"
              }`}
            >
              <div className="post_body">
                <p>{post.postBody}</p>
              </div>
            </div>
            {isMinimized && post.postBody.length > 100 ? (
              <div className="post_elipsis">
                <h6 onClick={() => setIsMinimized(false)}>(See more...)</h6>
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
        </div>
        <div className="post_meta_container">
          <div className="post_feedback_actions">
            <div className="upvote_downvote_container">
              <div className="upvote" onClick={toggle_upvoted}>
                <FontAwesomeIcon
                  icon={faUpLong}
                  color={post.upvote.indexOf(user._id) !== -1 ? "blue" : "black"}
                />
                {post.upvoteValue}
              </div>
              <div className="downvote" onClick={toggle_downvoted}>
                <FontAwesomeIcon
                  icon={faDownLong}
                  color={post.downvote.indexOf(user._id) !== -1 ? "red" : "black"}
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
                onClick={() => {}}
                icon={faShareNodes}
              />
            </span>{" "}
          </div>
        </div>
        {openCommentFormId === post._id && <CommentForm post={post} />}
        <div>
          {openCommentFormId === post._id && <CommentList post={post} />}
        </div>
      </div>
      {isVisible && (
        <PostForm isVisible={isVisible} setIsVisible={setIsVisible} />
      )}
    </>
  );
});

export default PostItem;
