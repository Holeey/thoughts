import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faUpLong,
  faDownLong,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import "./reply.css";
import React, { Fragment, useState, useCallback } from "react";
import {
  replyReplies,
  deleteReply,
  replyDownvotes,
  replyUpvotes,
} from "../../../../../../features/comments/commentSlice";

const RecursiveReply = React.memo(({ reply }) => {
  const [newReply, setNewReply] = useState("");
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [viewReplies, setViewReplies] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);


  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  //function for toggling the upvote
  const toggle_upvoted = () => {
      dispatch(replyUpvotes(reply._id));
  };

  //function for toggling downvote
  const toggle_downvoted = () => {
      dispatch(replyDownvotes(reply._id));
  };

  const replyVisibilty = () => {
    setViewReplies((prevState) => !prevState);
  };

  const toggleVisibility = (commentId) => {
    setSelectedCommentId(commentId === selectedCommentId ? null : commentId);
  };

  const handleChange = (event) => {
    setNewReply((prevValue) => event.target.value);
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
          <div className="reply_box">
            <div className="reply_profile">
              <div className="reply_user_profile_img_container">
                <img
                  className="reply_user_profile_img"
                  src={reply.user?.profile_image}
                  alt="profile"
                />
              </div>
              <h4>{reply.user?.nick_name}</h4>
              <h6>{moment(reply.createdAt).fromNow()}</h6>
            </div>
            <div
              className={`reply_text ${isMinimized ? "minimized" : "expanded"}`}
            >
              <p>{reply.reply}</p>
            </div>
            {isMinimized && reply.reply.length > 100 ? (
              <div onClick={toggleMinimize} className="reply_elipsis">
                <h6>See more...</h6>
              </div>
            ) : (
              " "
            )}
            <div className="replies_feedback-options">
              <span onClick={toggle_upvoted}>
                <FontAwesomeIcon
                  icon={faUpLong}
                  cursor={"pointer"}
                  color={reply.upvoteValue === 1 ? "blue" : "black"}
                />
                {reply.upvoteValue}
              </span>
              <span onClick={toggle_downvoted}>
                <FontAwesomeIcon
                  icon={faDownLong}
                  cursor={"pointer"}
                  color={reply.downvoteValue === 1 ? "red" : "black"}
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
                  <div className="nested_reply_form">
                    {" "}
                    <div className="reply_user_profile_img_container">
                      <img
                        className="reply_user_profile_img"
                        src={user?.profile_image}
                        alt="profile"
                      />
                    </div>
                    <div className="nested_reply_input">
                      <input
                        onChange={handleChange}
                        type="text"
                        placeholder={`reply to @${reply.user.nick_name}`}
                        value={newReply}
                        name="reply"
                        id="reply"
                      />
                      <div>
                        <button className="nested_reply_btn" type="submit">
                          <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>
        </Fragment>

        {/* Recursive rendering of nested replies */}

        {reply.replies && (
          <div>
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
});

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
