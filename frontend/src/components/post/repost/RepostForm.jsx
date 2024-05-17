import { Fragment, useState } from 'react';
import './repostForm.css';
import RepostItem from './RepostItem';
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { createRepost } from '../../../features/post/postSlice';

const RepostForm = ({ post, setSharePost, imageSrc }) => {
  const [formData, setFormData] = useState({
    repostComment: ''
  });

  const { repostComment } = formData;

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const repost = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('repostComment', repostComment);
    data.append('id', post._id);
    dispatch(createRepost(data));
    console.log("repost sent:",data, "id:", post._id)
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Fragment>
      <div className='backdrop'>
        <form onSubmit={repost} className='repost_form'>
          <div className='user_profile_image_container'>
            <img className='user_profile-image' src={user?.profile_image} alt='' />
          </div>
          <textarea
            onChange={handleChange}
            value={repostComment}
            id='repostComment'
            name='repostComment'
            className='repost_text-area'
            placeholder='Say something... '
          />
          <RepostItem imageSrc={imageSrc} post={post} />
          <button type='submit' className='repost_share_btn'>Share</button>
          <FontAwesomeIcon
            cursor={'pointer'}
            onClick={() => setSharePost(false)}
            className='repost_close_btn'
            icon={faClose}
          />
        </form>
      </div>
    </Fragment>
  );
};

export default RepostForm;
