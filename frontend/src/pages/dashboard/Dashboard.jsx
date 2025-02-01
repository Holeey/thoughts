import { useSelector } from "react-redux";
import "./dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import PostForm from "../../components/post/postForm/PostForm";
import PostItem from "../../components/post/postItem/PostItem";
import  { getAllPosts, reset } from "../../features/post/postSlice";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllReposts } from "../../features/repost/repostSlice";




const Dashboard = () => {
  const [isVisible, setIsVisible] = useState(false)
  const {user} = useSelector((state) => state.auth)
  const posts  = useSelector((state) => state.post.posts)  


  const dispatch = useDispatch();

//  const postdFeed = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    useEffect(() => {
      dispatch(getAllPosts())
      dispatch(getAllReposts())
    }, [ dispatch ])

  return (
    <>
      {user && (
        <div className="dashboard">
          <div className="feed_section">
         <div className="topic_section">
            <div className="header">Rooms</div>
            <section className="topic_list">
            <div>Sports</div>
            <div>Entertainment</div>
            <div>Technology</div>
            <div>Politics</div>
            <div>Health/Lifestyle</div>
            </section>
          </div>
          <div className="post_extra-container">
        <div className="post_feed">
          <div className="post_feed_item">
        <div
          style={{
            cursor: 'pointer',
          }} 
          className="share_thought_btn" 
          onClick={()=> setIsVisible(true)} 
          >
           Share your thoughts 
          <FontAwesomeIcon
            cursor={'pointer'}
            icon={faPen}
          /> 
        </div>
        
          {posts.map(item => (
          <PostItem key={item._id} post={item} /> ))}

            </div>

           </div> 
          <div className="extra_section">
            <h3 className="header">Adverts</h3>
            <div className="content"></div>
          </div>   
        </div>

          </div>
          
        </div>
      )}
      {isVisible && <PostForm isVisible={isVisible} setIsVisible={setIsVisible} /> }
    </>
  );
};

export default Dashboard;
