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
import { commentDownvotes, commentUpvotes, deleteComment, getComments, replyComment } from "../../../../../features/comments/commentSlice.js";
import './commentList.css'
import Reply from "./reply/Reply.jsx";

const CommentList = ({ post }) => {
  const [reply, setReply] = useState("");
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [viewReplies, setViewReplies] = useState('');

  const dispatch = useDispatch();
  const { comments } = useSelector((state) => state.comment);
  const { user } = useSelector((state) => state.auth);
  
  const toggleVisibility = (commentId) => {
    setSelectedCommentId(commentId === selectedCommentId ? null : commentId);
  };
  const replyVisibilty = () => {
    setViewReplies(!viewReplies)
  }

  let upvoted;
  let downvoted;
  
  
    //function for toggling the upvote
    const toggle_upvoted = (commentId, comment) => {
      // Get user vote status from the database state
      downvoted = comment.downvote.findIndex((vote) => vote.user._id === user.id);
      if (downvoted !== -1) {
        return;
      } else {
        dispatch(commentUpvotes(commentId))
      }
    };
  
    //function for toggling downvote
    const toggle_downvoted = (commentId, comment) => {
     // Get user vote status from the database state
      upvoted = comment.upvote.findIndex((vote) => vote.user._id === user.id);
      if (upvoted !== -1) {
        return;
      } else {
        dispatch(commentDownvotes(commentId))
      }
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
                <p>user: {comment.user.nick_name}</p>
                <p>{comment.comment}</p>
                <h6 onClick={replyVisibilty} style={{cursor: "pointer"}} >View replies</h6>
                { viewReplies && ( <Reply comment={comment} />) }
                
                <div className="comment_feedback-options">
                  
                  <span>
                    <FontAwesomeIcon icon={faUpLong} 
                    onClick={() => toggle_upvoted(comment._id, comment)}
                    color={upvoted !== -1 ? "blue" : "black"}
                    />
                    {comment.upvote}
                  </span>
                  <span>
                    <FontAwesomeIcon icon={faDownLong} 
                    onClick={() => toggle_downvoted(comment._id, comment)}
                    color={downvoted !== -1 ? "blue" : "black"}
                    />
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
