import { useSelector } from "react-redux";

import "./dashboard.css";
import Post from "../../components/post/Post";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      {user && (
        <div className="dashboard">
          <div className="topic_section">
            <h2>Topics</h2>
          </div>
          <div className="topic_section">
            <Post />
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
