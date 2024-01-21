import { useSelector } from "react-redux";
import "./dashboard.css";
import PostForm from "../../components/post/postForm/PostForm";
import PostItem from "../../components/post/postItem/PostItem";
import  { getAllPosts, reset } from "../../features/post/postSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";


const Dashboard = () => {
  const {user} = useSelector((state) => state.auth)
  const { posts } = useSelector((state) => state.posts)  
  const Posts = Array.isArray(posts.posts) ? posts.posts : [];
  
  const dispatch = useDispatch();
  
    useEffect(() => {
      dispatch(getAllPosts())
      return ()=>{
        dispatch(reset())
      }
    }, [dispatch])


  return (
    <>
      {user && (
        <div className="dashboard">
          <div className="topic_section">
            <h2>Topics</h2>
          </div>
          <div className="topic_section">
            <PostForm />
            <div> 
   
            {Posts.length > 0 ? 
            Posts.map((post) => (
              <PostItem key={post._id} post={post} user={user}/>

            )) : ''}

            </div>
          </div>
          <div className="topic_section">
            <h2>Extras</h2>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
