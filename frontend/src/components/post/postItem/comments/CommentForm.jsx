import { useState } from "react";
import { useDispatch } from "react-redux";
import  {postComment}  from "../../../../features/comments/commentSlice.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import "./comment.css";
import CommentList from "./CommentList.jsx";

const Comment = ({ post }) => {
  const [reply, setReply] = useState("");

  const dispatch = useDispatch();

  
  const handleChange = (e) => {
    setReply(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const commentData = {
      postId: post._id,
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
      <CommentList post={post} />
      </div>

    </>
  );
};

export default Comment;
