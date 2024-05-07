import { Fragment } from 'react'
import './repostForm.css'
import RepostItem from './RepostItem'

const RepostForm = ({ post, setSharePost, imageSrc }) => { 
    const repost = () => {

    }
  return (
    <Fragment>
    <div className='backdrop'>
        <form onSubmit={repost} className='repost_form'>
            <textarea className='repost_text-area' placeholder='Say something... '/>
            
                      
           <RepostItem  imageSrc={imageSrc} post={post}/>

            <button type='submit' className='repost_btn'>Submit</button>
            <button onClick={() => setSharePost(false)} type='button' className='repost_close_btn'>Close</button>
        </form>      

    </div>
</Fragment>
  )
}

export default RepostForm