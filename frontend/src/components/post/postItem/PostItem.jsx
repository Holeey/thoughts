import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faEllipsisVertical,
  faUpLong,
  faDownLong,
  faComment,
  faShareNodes,
} from "@fortawesome/free-solid-svg-icons";

import moment from "moment";

import { useState } from "react";
import "./postItem.css";

const PostItem = ({ user, post }) => {
  const [isMinimized, setIsMinimized] = useState(true);
  const [isPostOptions, setIsPostOptions] = useState(false);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };
  const togglePostOptions = () => {
    setIsPostOptions(!isPostOptions);
  };

  return (
    <>
      <div className="post_item">
        <div className="post_author_container">
          <div className="post_author">
            <div className="user_profile_img_container">
              <img
                className="user_profile_img"
                src={user?.profile_image}
                alt="profile_Img"
              />
            </div>
            <h4>{user?.nick_name}</h4>
          </div>
          <div className="post_options">
            <FontAwesomeIcon
              icon={faEllipsisVertical}
              onClick={togglePostOptions}
            />
          </div>
          {isPostOptions && (
            <>
              <ul>
                <li>Edit</li>
                <li>Delete</li>
                <li onClick={toggleMinimize}>Minimize</li>
              </ul>
            </>
          )}
        </div>
        <div className={`post_item_content`}>
          <div className="post_title">
            <h4>{post.postTitle}</h4>
          </div>

          <div
            className={`post_body_container ${
              isMinimized ? "minimized" : "expanded"
            }`}
          >
            <p className="post_body">{post.postBody}</p>
          </div>

          {isMinimized && post.postBody.length > 100 ? (
            <span className="post_elipsis">
              Continue reading{" "}
              <FontAwesomeIcon icon={faEllipsis} onClick={toggleMinimize} />{" "}
            </span>
          ) : (
            ""
          )}
        </div>
        <div className="post_meta_container">
          <div className="post_feedback_actions">
            <span>
              <FontAwesomeIcon icon={faUpLong} />
            </span>
            <span>
              <FontAwesomeIcon icon={faDownLong} />
            </span>
            <span>
              <FontAwesomeIcon icon={faComment} />
            </span>
            <span>
              <FontAwesomeIcon icon={faShareNodes} />
            </span>{" "}
          </div>

          <div className="post_time">
            <span>posted {moment(post.createdAt).fromNow()}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostItem;
