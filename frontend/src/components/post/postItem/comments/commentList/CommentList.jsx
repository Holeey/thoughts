import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faTrash,
  faUpLong,
  faPaperPlane,
  faDownLong,
  faReply
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { deleteComment, getComments, replyComment } from "../../../../../features/comments/commentSlice.js";
import './commentList.css'

const CommentList = ({ post }) => {
  const [reply, setReply] = useState("");
  const [selectedCommentId, setSelectedCommentId] = useState(null);

  const dispatch = useDispatch();
  const { comments } = useSelector((state) => state.comment);

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
      reply
    };
    dispatch(replyComment(replyData));
    setReply("");
    setSelectedCommentId(null); // Close the reply form after submitting
  };
  const handleDeleteComment = (commentId) => {
    dispatch(deleteComment(commentId))
  }

  useEffect(() => {
    dispatch(getComments(post._id));
  }, [dispatch, post._id]);

  return (
    <div>
      <div>
        {comments && comments.length > 0 && (
          <div className="comment_list">
            {comments.map((comment) => (
              <div key={comment._id} className="comment_item">
                <p>user:{comment.user.nick_name}</p>
                <p>{comment.comment}</p>
                <p>replies: {comment.replies}</p>
                <div className="comment_feedback-options">
                  <span>
                    <FontAwesomeIcon icon={faUpLong} />
                    {comment.upvote}
                  </span>
                  <span>
                    <FontAwesomeIcon icon={faDownLong} />
                    {comment.downvote}
                  </span>
                  <span>
                    <FontAwesomeIcon icon={faReply} onClick={() => toggleVisibility(comment._id)} />
                    {selectedCommentId === comment._id && (
                      <form onSubmit={(e) => handleSubmit(e, comment._id)} className="reply_form">
                        <input
                          onChange={handleChange}
                          type="text"
                          placeholder="reply"
                          value={reply}
                          name="reply"
                          id="reply"
                        />
                        <button type="submit"><FontAwesomeIcon icon={faPaperPlane} /></button>
                      </form>
                    )}
                  </span>
                  <span>
                   <FontAwesomeIcon icon={faTrash} color="crimson" onClick={() => handleDeleteComment(comment._id)} />
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
