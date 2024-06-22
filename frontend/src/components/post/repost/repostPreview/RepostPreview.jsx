import './repostPreview.css';
import moment from 'moment'

const RepostPreview = ({ post, imageSrc }) => {
  return (
    <div>
        <div className='selected_post'>
          <div className='repost-author_profile'>
            <div className='repost_profile_image_container'>
              <img className='repost_user-profile_image' src={post.user?.profile_image} alt='' />
              </div>
     
            <p className='repost-author_name'>{post.user?.nick_name}</p>
            <h6 className='repost-post_date'>{moment(post.createdAt).fromNow()}</h6>       
          </div>
          <div className={`repost_text_content ${post.originalPost ? post.originalPost.postBody.length < 100 && '' : post.postBody.length < 100 && ''}`}>
          <h4 className='repost_title '>{post.originalPost? post.originalPost.postTitle : post.postTitle}</h4>

        <div className='repost_body_container'>
           <div className='repost_minimized_body'>
            <p>{post.originalPost ? post.originalPost.postBody : post.postBody}</p>
          </div>
          {post.originalPost ? 
          post.originalPost.postBody.length > 100 && (<div className='repost_elipsis'><h6>(See more...)</h6></div>)
          :
          post.postBody.length > 100 && (<div className='repost_elipsis'><h6>(See more...)</h6></div>)}
           
          </div>       
        </div>


          <div className='repost_img_container'>
            <img
            className="repost_img" 
            src={imageSrc} alt=""/>
          </div>         
        </div>

    </div>
  )
}

export default RepostPreview