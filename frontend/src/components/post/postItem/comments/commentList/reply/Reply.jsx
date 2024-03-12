import { useSelector, useDispatch } from "react-redux";
import "./reply.css";
import { Fragment, useState } from "react";
import { replyReplies } from "../../../../../../features/comments/commentSlice";

const RecursiveReply = ({ reply }) => {
  const [newReply, setNewReply] = useState("");
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [viewReplies, setViewReplies] = useState("");

  const dispatch = useDispatch();

  const replyVisibilty = () => {
    setViewReplies(!viewReplies);
  };

  const toggleVisibility = (commentId) => {
    setSelectedCommentId(commentId === selectedCommentId ? null : commentId);
  };

  const handleChange = (e) => {
    setNewReply(e.target.value);
  };

  const handleSubmit = (e, replyId) => {
    e.preventDefault();
    const replyData = {
      replyId,
      commentId: reply._id,
      newReply,
    };
    dispatch(replyReplies(replyData));
    setNewReply("");
    setSelectedCommentId(null);
  };

  return (
    <div>
      <div className="reply_section">
        <Fragment key={reply._id}>
          <div className="replies">
            <p>{reply.user?.nick_name}</p>
            <div>
              <p>{reply.reply}</p>
            </div>
          </div>
          <div>
            <span>upvote:{reply.upvote}</span>
            <span>downvote: {reply.downvote}</span>
          </div>
          <h6 onClick={() => toggleVisibility(reply._id)}>Reply</h6>

          {selectedCommentId === reply._id && (
            <>
              <form onSubmit={(e) => handleSubmit(e, reply._id)}>
                <input
                  onChange={handleChange}
                  type="text"
                  placeholder={`reply to @${reply.user.nick_name}`}
                  value={newReply}
                  name="reply"
                  id="reply"
                />
                <div>
                  <button type="submit">send</button>
                </div>
              </form>
            </>
          )}
        </Fragment>

        {/* Recursive rendering of nested replies */}

        {reply.replies && (
          <div className="nested-replies">
            {reply.replies.map((nestedReply) => (
              <>
                <h6 onClick={replyVisibilty} style={{ cursor: "pointer" }}>
                  view replies
                </h6>
                {viewReplies && (
                  <RecursiveReply key={nestedReply._id} reply={nestedReply} />
                )}
              </>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Reply = ({ comment }) => {
  return (
    <div>
      <div className="reply_section">
        {comment.replies?.map((reply) => (
          <RecursiveReply key={reply._id} reply={reply} />
        ))}
      </div>
    </div>
  );
};

export default Reply;
