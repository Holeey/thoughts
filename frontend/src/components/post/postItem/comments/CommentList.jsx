import React from 'react'

const CommentList = ({post}) => {
    console.log(post)
  return (
    <div>
        <div>
        {post.comments.length > 0 && (
          <ul className="comment_list">
            {post.comments.map((comment) => (
              <li key={comment._id}>
                <p>{comment.comment}</p>
                <p>User: {comment.user}</p>
                <p>Post: {comment.post}</p>
                {/* Add more details as needed */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default CommentList




  