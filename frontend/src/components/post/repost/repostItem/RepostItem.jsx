import "./repostItem.css";
import moment from "moment";
import { useState, useEffect } from "react";

const RepostItem = ({ post }) => {
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    const loadImage = async () => {
      if (post?.originalPost?.postImg) {
        try {
          const module = await import(
            `../../../../images/${post.originalPost.postImg}`
          );
          setImageSrc(module.default);
        } catch (error) {
          console.error("Error loading image:", error);
        }
      }
    };

    if (post?.originalPost) {
      loadImage();
    }
  }, [post?.originalPost]);

  
  if (!post?.originalPost || !post?.originalPost?.user) {
    return <div>Content unavailable! </div>; // Or any other fallback UI
  }

  return (
    <div>
      <div className="repost_item_wrapper">
        <div className="repost_item">
          <div className="repost_author_container">
            <div className="user_profile_img_container_repost">
              <img
                className="user_profile_img"
                src={post.originalPost.user.profile_image}
                alt="profile_Img"
              />
            </div>
            <div className="repost_author-content">
              <div className="repost_author-info">
                <div className="nick_name">
                  <h4>{post.originalPost.user.nick_name}</h4>
                </div>

                <div className="repost_time">
                  <h6>{moment(post.originalPost.createdAt).fromNow()}</h6>
                </div>
              </div>{" "}
              <div className="bio">
                <h6>{post.originalPost.user.bio}</h6>
              </div>
            </div>
          </div>
          <div className={`repost_item_content`}>
            <h5 className="repost_title">{post.originalPost.postTitle}</h5>
            <div className="reverse_repost">
              <div className="repost_body_container">
                <div className="repost_body">
                  <p>{post.originalPost.postBody}</p>
                </div>
              </div>

              {imageSrc && (
                <div className="repostImg">
                  <img src={imageSrc} alt="" />
                </div>
              )}
            </div>
            <div className="repost_meta">
            <h6> {post.originalPost.upvoteValue} likes</h6>
            <h6> {post.originalPost.downvoteValue} dislikes </h6> 
            <h6> {post.originalPost.upvoteValue} comments</h6>
            <h6> {post.originalPost.upvoteValue} shares</h6>   
            {''}   
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default RepostItem;
