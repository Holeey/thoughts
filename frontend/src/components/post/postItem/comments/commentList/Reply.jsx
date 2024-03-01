import { useSelector } from "react-redux";
import './reply.css'

const Reply = ({ comment }) => {
  return (
    <div>
        <h6>View previous replies</h6>
      <div className="reply_section">
        
        {
          comment.replies.map((reply) => (
            <>
            <div className="replies">
              <p>{reply.user.nick_name}</p>
              <p>{reply.reply}</p>
            </div>
            <h6>Reply</h6>
            </>
          ))}
      </div>
    </div>
  );
};

export default Reply;
