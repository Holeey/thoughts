import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import  {postComment, getComments, resetComment}  from "../../../../features/comments/commentSlice.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import "./comment.css";

const Comment = ({ postId }) => {
  const [reply, setReply] = useState("");

  const dispatch = useDispatch();
  const comments = useSelector((state) => state.comment.comments)

  useEffect(() => {
    dispatch(getComments(postId))
  }, [dispatch, postId])
  
  const handleChange = (e) => {
    setReply(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const commentData = {
      postId,
      reply
    }
    dispatch(postComment(commentData));
    setReply("");
  };

  return (
    <>
      <form className="comment_form" onSubmit={handleSubmit}>
        <div>view 1234k comments...</div>
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
      </form>
      <div>
        { comments.length > 0 &&
        comments.map((comment) => (
          <ul>
            <li key={comment._id}>{ comment.comment}</li>
          </ul>
        ))}
      </div>
    </>
  );
};

export default Comment;
