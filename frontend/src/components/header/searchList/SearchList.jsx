import { useSelector } from "react-redux"
import './search.css'
import { Link } from "react-router-dom"
const SearchList = () => {
    const {searchPosts} = useSelector((state) => state.post)
  return (
    <>
    <div className="search_list"> 
    <div>result(s)base on your search keyword:</div>
      <div>
        { searchPosts.length > 0 ? 
        searchPosts.map(post => (
            <li key={post._id}><Link to={`/${post._id}`}>{post.postTitle}</Link></li>
        )) : ('')}
    </div></div>

    </>
  )
}

export default SearchList