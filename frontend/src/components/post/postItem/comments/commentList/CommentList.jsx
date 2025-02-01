import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faUpLong,
  faPaperPlane,
  faDownLong,
} from "@fortawesome/free-solid-svg-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  commentUpvotes,
  commentDownvotes,
  deleteComment,
  getComments,
  replyComment,
  resetComment,
} from "../../../../../features/comments/commentSlice.js";
import "./commentList.css";
import Reply from "./reply/Reply.jsx";

const CommentList = React.memo(({ post }) => {
  const [reply, setReply] = useState("");
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [viewReplies, setViewReplies] = useState(null);
  const [isMinimized, setIsMinimized] = useState(true);

  const dispatch = useDispatch();
  const { comments } = useSelector((state) => state.comment);
 
  const { user } = useSelector((state) => state.auth);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const replyVisibilty = useCallback((replyCommentId) => {
    setViewReplies((prevViewReplies) => replyCommentId === prevViewReplies ? null : replyCommentId);
  }, [viewReplies]); 

  const toggleVisibility = useCallback((commentId) => {
    setSelectedCommentId((prevSelectedCommentId) => commentId === prevSelectedCommentId ? null : commentId);
  }, [selectedCommentId]); 
  
  const handleChange = (event) => {
    setReply((prevValue) => event.target.value);
  };

  const handleSubmit = (e, commentId) => {
    e.preventDefault();
    const replyData = {
      commentId,
      reply,
    };
    dispatch(replyComment(replyData));
    setReply("");
    setSelectedCommentId(null); // Close the reply form after submitting
  };
  const handleDeleteComment = (commentId) => {
    dispatch(deleteComment(commentId));
  };

  useEffect(() => {
    dispatch(getComments(post._id));
    // return () => {
    //   dispatch(resetComment());
    // };
  }, [dispatch, post._id]);

  return (
    <div>
      <div>
        {comments && comments.length > 0 && (
          <div className="comment_list">
            {comments.map((comment) => (
              <div key={comment._id} className="comment_item_container">
                <div className="comment_item">
                  <div className="comment_user">
                    <div className="comment_user_profile_img_container">
                      <img
                        className="comment_user_profile_img"
                        src={comment.user.profile_image}
                        alt="profile"
                      />
                    </div>
                    <h4>{comment.user.nick_name}</h4>
                    <h6>{moment(comment.createdAt).fromNow()}</h6>
                  </div>

                  <div
                    className={`comment_body_container ${
                      isMinimized ? "minimized" : "expanded"
                    }`}
                  >
                    <p>{comment.comment}</p>{" "}
                  </div>
                  {/* {isMinimized && comment.comment.length > 100 ? (
                    <div onClick={toggleMinimize} className="comment_elipsis">
                      <h6>See more...</h6>
                    </div>
                  ) : (
                    " "
                  )} */}

                  <div className="comment_feedback-options">
                    <div
                      onClick={() => {
                        const downvoted = comment.downvote.findIndex(
                          (vote) => vote.user && vote.user._id === user.id
                        );
                        if (downvoted !== -1) {
                          return;
                        } else {
                          dispatch(commentUpvotes(comment._id));
                        }
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faUpLong}
                        color={
                          comment.upvoteValue === 1
                            ? "blue"
                            : "black"
                        }
                        cursor={"pointer"}
                      />

                      {comment.upvoteValue}
                    </div>

                    <div
                      onClick={() => {
                        const upvoted = comment.upvote.findIndex(
                          (vote) => vote.user && vote.user._id === user.id
                        );
                        if (upvoted !== -1) {
                          return;
                        } else {
                          dispatch(commentDownvotes(comment._id));
                        }
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faDownLong}
                        color={
                          comment.downvoteValue === 1
                            ? "red"
                            : "black"
                        }
                        cursor={"pointer"}
                      />

                      {comment.downvoteValue}
                    </div>

                    <div>
                      {" "}
                      <h6
                        style={{ cursor: "pointer" }}
                        onClick={() => toggleVisibility(comment._id)}
                      >
                        Reply
                      </h6>
                    </div>

                    {comment.replies.length > 0 && (
                      <h6
                        onClick={() => replyVisibilty(comment._id)}
                        style={{ cursor: "pointer" }}
                      >
                        view replies
                      </h6>
                    )}

                    <div>
                      <FontAwesomeIcon
                        cursor={"pointer"}
                        icon={faTrash}
                        color="crimson"
                        onClick={() => handleDeleteComment(comment._id)}
                      />
                    </div>
                  </div>

                  {selectedCommentId === comment._id && (
                    <form
                      onSubmit={(e) => handleSubmit(e, comment._id)}
                      className="reply_form"
                    >
                      <div>
                        <div className="comment_user_profile_img_container">
                          <img
                            className="comment_user_profile_img"
                            src={user.profile_image}
                            alt="profile"
                          />
                        </div>
                      </div>
                      <div className="reply_form_input">
                        {" "}
                        <input
                          onChange={handleChange}
                          type="text"
                          placeholder={`reply @${comment.user.nick_name}`}
                          value={reply}
                          name="reply"
                          id="reply"
                        />
                        <button className="reply_btn" type="submit">
                          <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                      </div>
                    </form>
                  )}
                </div>
                {viewReplies === comment._id && <Reply comment={comment} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default CommentList;
