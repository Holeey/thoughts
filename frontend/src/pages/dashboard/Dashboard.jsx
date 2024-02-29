import { useSelector } from "react-redux";
import "./dashboard.css";
import PostForm from "../../components/post/postForm/PostForm";
import PostItem from "../../components/post/postItem/PostItem";
import  { getAllPosts, reset } from "../../features/post/postSlice";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


const Dashboard = () => {
  const [isVisible, setIsVisible] = useState(false)
  const {user} = useSelector((state) => state.auth)
  const posts  = useSelector((state) => state.post.posts)  

  const dispatch = useDispatch();

    useEffect(() => {
      dispatch(getAllPosts())
    }, [posts, dispatch])

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
   
            {posts.length > 0 ? 
            posts.map((post) => (
              <PostItem key={post._id} post={post} />
            )) : ''}

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
