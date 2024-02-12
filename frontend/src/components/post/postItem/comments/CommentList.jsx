import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getComments } from "../../../../features/comments/commentSlice";

const CommentList = ({post}) => {
  const dispatch = useDispatch()
  const {comments} = useSelector((state) => state.comment)
  useEffect(() => {
    dispatch(getComments(post._id))
  }, [dispatch, post._id])
  console.log( "These are comments:", comments);
  return (
    <div>
      <div>
        {comments && comments.length > 0 && (
          <ul className="comment_list">
            {comments.map((comment) => (
              <li key={comment._id}>
                <p>{comment.comment}</p>
                <p>User: {comment.user.nick_name}</p>
                {/* Additional details as needed */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CommentList;
