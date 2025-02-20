import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { postComment } from "../../../../../features/comments/commentSlice.js";
import CommentList from "../commentList/CommentList.jsx";
import { getComments } from "../../../../../features/comments/commentSlice.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import "./commentForm.css";

const Comment = ({ post }) => {
  const [reply, setReply] = useState("");

  const { comments } = useSelector((state) => state.comment);

  const filteredComments = comments.filter(
    (comment) => comment.post === post._id
  );

  const dispatch = useDispatch();

  const handleChange = (event) => {
    setReply((prevValue) => event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const commentData = {
      postId: post._id,
      reply,
    };
    dispatch(postComment(commentData));
    setReply("");
  };

  const toggleCommentForm = useCallback(
    (postId) => {
      // Fetch comments only if opening a new form

      dispatch(getComments(postId));
    },
    [dispatch] // Dependency array to track latest state
  );

  return (
    <>
      <div className="comment_container">
        <form className="comment_form" onSubmit={handleSubmit}>
          <div className="comment_input-container">
            <input
              onChange={handleChange}
              className="comment_input"
              type="text"
              placeholder="comment"
              value={reply}
              name="reply"
              id="reply"
            />
            <button type="submit" className="comment_button">
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
          <h5
            style={{ cursor: "pointer", color: "purple" }}
            onClick={() => {
              toggleCommentForm(post._id);
            }}
          >
            View comments
          </h5>
        </form>
      </div>
      <CommentList comments={filteredComments} />
    </>
  );
};

export default Comment;
