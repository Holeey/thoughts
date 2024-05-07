import { Fragment, useState } from 'react'
import './repostForm.css'
import RepostItem from './RepostItem'
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faClose} from "@fortawesome/free-solid-svg-icons";

const RepostForm = ({ post, setSharePost, imageSrc }) => { 
  const [repostComment, setRepostComment] = useState('')


  // const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

    const repost = () => {

    }
    const handleChange = (e) => {
      setRepostComment(e.target.value)
    }
  return (
    <Fragment>
    <div className='backdrop'>
        <form onSubmit={repost} className='repost_form'>
          <div className='user_profile_image_container'>
            <img className='user_profile-image'  src={user?.profile_image} alt=''/>
          </div>
            <textarea
            onChange={handleChange}
            className='repost_text-area'
            placeholder='Say something... '/>
            
                      
           <RepostItem  imageSrc={imageSrc} post={post}/>

            <button type='submit' className='repost_share_btn'>Share</button>
             <FontAwesomeIcon
              cursor={'pointer'}
             onClick={() => setSharePost(false)}
             className='repost_close_btn'
             icon={faClose} />
            
                      
           
        </form>      

    </div>
</Fragment>
  )
}

export default RepostForm