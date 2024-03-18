import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faTrash,
  faUpLong,
  faPaperPlane,
  faDownLong,
  faReply,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
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

const CommentList = ({ post }) => {
  const [reply, setReply] = useState("");
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [viewReplies, setViewReplies] = useState(false);

  const dispatch = useDispatch();
  const { comments } = useSelector((state) => state.comment);
  const { user } = useSelector((state) => state.auth);

  const replyVisibilty = () => {
    setViewReplies(!viewReplies);
  };

  const toggleVisibility = (commentId) => {
    setSelectedCommentId(commentId === selectedCommentId ? null : commentId);
  };

  const handleChange = (e) => {
    setReply(e.target.value);
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
    //   resetComment();
    // };
  }, [dispatch, post._id]);

  return (
    <div>
      <div>
        {comments && comments.length > 0 && (
          <div className="comment_list">
            {comments.map((comment) => (
              <div key={comment._id} className="comment_item">
                <p>user: {comment.user.nick_name}</p>
                <p>{comment.comment}</p>
                {comment.replies.length > 0 &&
                <h6 onClick={replyVisibilty} style={{ cursor: "pointer" }}>
                  view replies
                </h6>}
                {viewReplies && <Reply comment={comment} />}
                <div className="comment_feedback-options">
                  <span
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
                        comment.upvote.findIndex(
                          (vote) => vote.user && vote.user._id === user.id
                        ) !== -1
                          ? "blue"
                          : "white"
                      }
                      cursor={"pointer"}
                    />

                    {comment.upvoteValue}
                  </span>
                  <span
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
                        comment.downvote.findIndex(
                          (vote) => vote.user && vote.user._id === user.id
                        ) !== -1
                          ? "red"
                          : "white"
                      }
                      cursor={"pointer"}
                    />

                    {comment.downvoteValue}
                  </span>
                  <span>
                    <FontAwesomeIcon
                      icon={faReply}
                      cursor={'pointer'}
                      onClick={() => toggleVisibility(comment._id)}
                    />
                    {selectedCommentId === comment._id && (
                      <form
                        onSubmit={(e) => handleSubmit(e, comment._id)}
                        className="reply_form"
                      >
                        <input
                          onChange={handleChange}
                          type="text"
                          placeholder="reply"
                          value={reply}
                          name="reply"
                          id="reply"
                        />
                        <button type="submit">
                          <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                      </form>
                    )}
                  </span>
                  <span>
                    <FontAwesomeIcon
                      icon={faTrash}
                      color="crimson"
                      onClick={() => handleDeleteComment(comment._id)}
                    />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {}
    </div>
  );
};

export default CommentList;
