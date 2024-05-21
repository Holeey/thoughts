import { useSelector } from "react-redux";
import "./dashboard.css";
import PostForm from "../../components/post/postForm/PostForm";
import PostItem from "../../components/post/postItem/PostItem";
import  { getAllPosts, reset } from "../../features/post/postSlice";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllReposts } from "../../features/repost/repostSlice";
import RepostItem from "../../components/post/repost/repostItem/RepostItem";



const Dashboard = () => {
  const [isVisible, setIsVisible] = useState(false)
  const {user} = useSelector((state) => state.auth)
  const posts  = useSelector((state) => state.post.posts)  
  const reposts = useSelector((state) => state.repost.reposts)

  const dispatch = useDispatch();


 // Combine posts and reposts into a single array and sort by createdAt (or updatedAt) timestamps.
 const combinedFeed = [...posts, ...reposts].sort((a, b) => b.createdAt - a.createdAt);
//  console.log('combinedFeed:', combinedFeed)

    useEffect(() => {
      dispatch(getAllPosts())
      dispatch(getAllReposts())
      // return () => {
      //   dispatch(reset())
      // }
    }, [posts,  dispatch])

  return (
    <>
      {user && (
        <div className="dashboard">
          <div className="topic_section">
            <h2>Topics</h2>
          </div>
          <div className="topic_section">
        <input onClick={()=> setIsVisible(true)} placeholder="Share your thoughts"/> 
          <div> 
          {combinedFeed.map(item => (
                <div key={item._id} className="feed-item">
                    {item.type === 'Post' ? (
                     <PostItem key={item._id} post={item} />
                    ) : (
                     <RepostItem key={item._id} post={item} />
                    )}
                </div>
            ))}

            </div>
          </div>
          <div className="topic_section">
            <h2>Extras</h2>
          </div>
        </div>
      )}
      {isVisible && <PostForm isVisible={isVisible} setIsVisible={setIsVisible} /> }
    </>
  );
};

export default Dashboard;
