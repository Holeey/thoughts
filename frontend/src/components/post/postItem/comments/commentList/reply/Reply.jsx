import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faUpLong,
  faDownLong,
} from "@fortawesome/free-solid-svg-icons";
import "./reply.css";
import { Fragment, useState } from "react";
import {
  replyReplies,
  deleteReply,
  replyDownvotes,
  replyUpvotes,
} from "../../../../../../features/comments/commentSlice";

const RecursiveReply = ({ reply }) => {
  const [newReply, setNewReply] = useState("");
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [viewReplies, setViewReplies] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Get user vote status from the database state
  const upvoted = reply.upvote.findIndex(
    (vote) => vote.user && vote.user._id === user.id
  );
  const downvoted = reply.downvote.findIndex(
    (vote) => vote.user && vote.user._id === user.id
  );

  //function for toggling the upvote
  const toggle_upvoted = () => {
    if (downvoted !== -1) {
      return;
    } else {
      dispatch(replyUpvotes(reply._id));
    }
  };

  //function for toggling downvote
  const toggle_downvoted = () => {
    if (upvoted !== -1) {
      return;
    } else {
      dispatch(replyDownvotes(reply._id));
    }
  };

  const replyVisibilty = () => {
    setViewReplies((prevState) => !prevState);
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
  const handleDeleteComment = (commentId) => {
    dispatch(deleteReply(commentId));
  };

  return (
    <div>
      <div className="parent_reply">
        <Fragment key={reply._id}>
          <div className="replies">
            <p>{reply.user?.nick_name}</p>
            <div>
              <p>{reply.reply}</p>
            </div>
          </div>
          <div>
            <span onClick={toggle_upvoted}>
              <FontAwesomeIcon
                icon={faUpLong}
                cursor={"pointer"}
                color={upvoted !== -1 ? "blue" : "white"}
              />
              {reply.upvoteValue}
            </span>
            <span onClick={toggle_downvoted}>
              <FontAwesomeIcon
                icon={faDownLong}
                cursor={"pointer"}
                color={downvoted !== -1 ? "red" : "white"}
              />
              {reply.downvoteValue}
            </span>
            <h6
              onClick={() => toggleVisibility(reply._id)}
              style={{ cursor: "pointer" }}
            >
              Reply
            </h6>
            {reply.replies.length > 0 && (
              <h6 onClick={replyVisibilty} style={{ cursor: "pointer" }}>
                view replies
              </h6>
            )}
            <span>
              <FontAwesomeIcon
                icon={faTrash}
                cursor={"pointer"}
                color="crimson"
                onClick={() => handleDeleteComment(reply._id)}
              />
            </span>
          </div>

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
            {reply.replies?.length > 0 &&
              reply.replies.map((nestedReply) => (
                <Fragment key={nestedReply._id}>
                  {viewReplies && (
                    <RecursiveReply key={nestedReply._id} reply={nestedReply} />
                  )}
                </Fragment>
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
        {comment.replies.length > 0 &&
          comment.replies.map((reply) => (
            <RecursiveReply key={reply._id} reply={reply} />
          ))}
      </div>
    </div>
  );
};

export default Reply;
